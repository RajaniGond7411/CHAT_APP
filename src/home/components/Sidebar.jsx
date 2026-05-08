import React, { useEffect, useState } from 'react';
import { RiUserSearchLine } from "react-icons/ri";
import { IoArrowBackCircle } from "react-icons/io5";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BiLogOutCircle } from "react-icons/bi";
import userConversation from '../../Zustand/useConversation.js';
import { useSocketContext } from '../../context/socketContext.jsx';

const Sidebar = ({ onSelectUser }) => {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const { onlineUsers } = useSocketContext();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const { setSelectedConversation } = userConversation();

    useEffect(() => {
        const chatUserHandler = async () => {
            if (chatUser.length > 0) return;
            setLoading(true);
            try {
                const chatters = await axios.get(`/api/user/currentchatters`);
                setChatUser(chatters.data);
            } catch (error) {
                console.error("Error fetching chatters:", error);
            } finally {
                setLoading(false);
            }
        };
        chatUserHandler();
    }, [chatUser.length]);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchInput) return;

        setLoading(true);
        setIsSearching(true);
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.length === 0) {
                setSearchUser([]);
                toast.info("User Not Found");
            } else {
                setSearchUser(data);
            }
        } catch (error) {
            setSearchUser([]);
            toast.error("User not found");
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSelectedUserId(user?._id);
    };

    const handleLogOut = async () => {
        const confirmlogout = window.prompt("Type your username to LOGOUT");
        if (confirmlogout === authUser.username) {
            setLoading(true);
            try {
                const logout = await axios.post(`/api/auth/logout`);
                toast.info(logout.data?.message);
                localStorage.removeItem('chat_app');
                setAuthUser(null);
                navigate('/login');
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                setLoading(false);
            }
        } else if (confirmlogout !== null) {
            toast.info("Logout Cancelled!");
        }
    };


    const UserListItem = ({ user }) => {
        const isOnline = onlineUsers.includes(user._id);

        return (
            <div
                onClick={() => handleUserClick(user)}
                className={`flex gap-3 items-center rounded p-2 py-2 cursor-pointer transition-colors ${selectedUserId === user._id ? 'bg-sky-500 text-white' : 'hover:bg-gray-200'
                    }`}
            >
                <div className='relative'>
                    <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-300'>
                        <img src={user.profilepic} alt="user" className="object-cover w-full h-full" />
                    </div>
                    {/* The Online Green Dot */}
                    {isOnline && (
                        <span className='absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white'></span>
                    )}
                </div>
                <div className='flex flex-col flex-1'>
                    <p className={`font-bold ${selectedUserId === user._id ? 'text-white' : 'text-gray-950'}`}>
                        {user.username}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className='h-full w-full flex flex-col px-1 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
            {/* Search Header */}
            <div className='flex justify-between gap-2'>
                <form onSubmit={handleSearchSubmit} className='w-full flex items-center justify-between bg-white rounded-full'>
                    {isSearching && (
                        <div
                            onClick={() => {
                                setIsSearching(false);
                                setSearchInput("");
                                setSearchUser([]);
                            }}
                            className='pl-3 cursor-pointer text-gray-600 hover:text-black'
                        >
                            <IoArrowBackCircle size={25} />
                        </div>
                    )}

                    <input
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            if (e.target.value === "") {
                                setIsSearching(false);
                                setSearchUser([]);
                            }
                        }}
                        type="text"
                        className='px-4 flex-1 bg-transparent outline-none placeholder:text-gray-500'
                        placeholder='Search User...'
                    />
                    <button type='submit' className='btn btn-circle bg-sky-600 hover:bg-gray-950 border-none'>
                        <RiUserSearchLine color='white' size={20} />
                    </button>
                </form>
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    className='self-center h-10 w-10 hover:scale-110 transition-transform cursor-pointer rounded-full border-2 border-sky-500'
                    alt="profile"
                />
            </div>

            <div className='divider px-3 my-1'></div>

            {/* Chat List */}
            <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300'>
                {loading && !isSearching ? (
                    <div className='flex justify-center mt-10'><span className="loading loading-spinner text-sky-500"></span></div>
                ) : (
                    <div className='w-full'>
                        {isSearching ? (
                            searchUser.length > 0 ? (
                                searchUser.map((user) => <UserListItem key={user._id} user={user} />)
                            ) : (
                                <div className='text-center text-red-900 mt-10 font-bold'>
                                    <p>User Not Found!</p>
                                </div>
                            )
                        ) : (
                            chatUser.length === 0 ? (
                                <div className='font-bold items-center flex flex-col text-xl text-yellow-500 mt-10'>
                                    <h1 className='text-4xl mb-2'>🤨</h1>
                                    <p>Your chat list is empty.</p>
                                    <p className='text-sm font-normal'>Search for users to start talking!</p>
                                </div>
                            ) : (
                                chatUser.map((user, index) => (
                                    <React.Fragment key={user._id}>
                                        <UserListItem user={user} />
                                        {index < chatUser.length - 1 && <div className='divider px-2' />}
                                    </React.Fragment>
                                ))
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Logout Footer */}
            {!isSearching && (
                <div className='mt-auto px-1 py-1 flex items-center gap-2'>
                    <button
                        onClick={handleLogOut}
                        className='flex items-center justify-center hover:bg-black w-10 h-10 rounded-full cursor-pointer hover:text-white transition-all'
                        title="Logout"
                    >
                        <BiLogOutCircle size={24} className="text-white" />
                    </button>
                    <p className='text-sm font-medium cursor-pointer'><i>Logout</i></p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
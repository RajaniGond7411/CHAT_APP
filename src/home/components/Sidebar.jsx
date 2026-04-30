import React, { useEffect, useState } from 'react';
import { RiUserSearchLine } from "react-icons/ri";
import { IoArrowBackCircle } from "react-icons/io5";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BiLogOutCircle } from "react-icons/bi";
import userConversation from '../../Zustand/useConversation.js';

const Sidebar = () => {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const { messages, selectedConversation, setSelectedConversation } = userConversation();

    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true);
            try {
                const chatters = await axios.get('/api/user/currentchatters');
                setChatUser(chatters.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };
        chatUserHandler();
    }, []);

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
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setSearchUser([]);
            toast.error("User not found");
        }
    };

    const handleUserClick = (user) => {
        setSelectedConversation(user);
        setSelectedUserId(user?._id);

    };

    const handleLogOut = async () => {

        const confirmlogout = window.prompt("type 'Username' to LOGOUT");
        if (confirmlogout === authUser.username) {
            setLoading(true)
            try {
                const logout = await axios.post('/api/auth/logout')
                const data = logout.data;
                if (data?.success === false) {
                    setLoading(false)
                    console.log(data?.message);
                }
                toast.info(data?.message)
                localStorage.removeItem('chat_app')
                setAuthUser(null)
                setLoading(false)
                navigate('/login')
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        } else {
            toast.info("Logout Cancelled!")
        }

    }

    return (
        <div className='h-full w-auto px-1 border-r border-gray-700 '>
            <div className='flex justify-between gap-2'>
                <form onSubmit={handleSearchSubmit} className='w-full flex items-center justify-between bg-white rounded-full'>

                    {/* Integrated your IoArrowBackSharp div here */}
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
                        placeholder='Search User'
                    />
                    <button type='submit' className='btn btn-circle bg-sky-600 hover:bg-gray-950 border-none'>
                        <RiUserSearchLine color='white' />
                    </button>
                </form>
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    className='self-center h-10 w-10 hover:scale-110 cursor-pointer rounded-full'
                    alt="profile"
                />
            </div>

            <div className='divider px-3'></div>

            <div className='min-h-[70%] max-h-[80%] overflow-y-auto scrollbar'>
                <div className='w-auto'>
                    {isSearching ? (
                        searchUser.length > 0 ? (
                            searchUser.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserClick(user)}
                                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user._id ? 'bg-sky-500' : ''}`}
                                >
                                    <div className='avatar'>
                                        <div className='w-10 rounded-full'>
                                            <img src={user.profilepic} alt="user" />
                                        </div>
                                    </div>
                                    <div className='flex flex-col flex-1'>
                                        <p className='font-bold text-gray-950'>{user.username}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='text-center text-red-900 mt-10 font-bold'>
                                <p>User Not Found!</p>
                            </div>
                        )
                    ) : (
                        chatUser.length === 0 ? (
                            <div className='font-bold items-center flex flex-col text-xl text-yellow-500 mt-10'>
                                <h1>Why are you Alone? 🤨</h1>
                                <h1>Search Users to Chat.</h1>
                            </div>
                        ) : (
                            chatUser.map((user, index) => (
                                <React.Fragment key={user._id}>
                                    <div
                                        key={user._id}
                                        onClick={() => handleUserClick(user)}
                                        className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user._id ? 'bg-sky-500' : ''}`}
                                    >
                                        <div className='avatar'>
                                            <div className='w-10 rounded-full'>
                                                <img src={user.profilepic} alt="user" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col flex-1'>
                                            <p className='font-bold text-gray-950'>{user.username}</p>
                                        </div>
                                    </div>
                                    {index < chatUser.length - 1 && (
                                        <div className='divider px-2' />
                                    )}
                                </React.Fragment>
                            ))
                        )
                    )}
                </div>
            </div>
            {!isSearching && (
                <div className='mt-auto px-1 py-1 flex items-center gap-2'>
                    <button onClick={handleLogOut} className='flex items-center justify-center hover:bg-black w-10 h-10 rounded-full cursor-pointer hover:text-white transition-all'>
                        <BiLogOutCircle size={25} />
                    </button>
                    <p className='text-sm font-medium cursor-pointer'><i>Logout</i></p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
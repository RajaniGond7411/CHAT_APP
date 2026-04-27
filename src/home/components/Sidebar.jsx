import React, { useEffect, useState } from 'react'
import { RiUserSearchLine } from "react-icons/ri"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'
const Sidebar = () => {

    const navigate = useNavigate();
    const { authUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserid, setselectedUserid] = useState(null);



    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await axios.get(`/api/user/currentchatters`)
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false)
                    console.log(data.message);
                }
                setLoading(false)
                setChatUser(data)

            } catch (error) {
                setLoading(false)
                console.log(error);

            }
        }
        chatUserHandler()
    }, [])
    console.log(chatUser);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message);

            }
            setLoading(false)
            if (data.loading === 0) {
                toast.info("User Not Found")
            } else {
                setSearchUser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }
    const handleUserClick = () => {
        selectedUserid(user._id)
    }
    console.log(searchUser);

    return (
        <div className='h-full w-auto px-1'>
            <div className='flex justify-between gap-2'>
                <form onSubmit={handleSearchSubmit} className='w-auto flex items-center justify-between bg-white rounded-full'>
                    <input value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type="text" className='px-4 w-auto bg-transparent outline-none rounded-1-full' placeholder='Search User' />
                    <button className='btn btn-circle bg-sky-600 hover:bg-gray-950 '>
                        <RiUserSearchLine />

                    </button>
                </form>
                <img onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    className='self-center h-10 w-10 hover:scale-110 cursor-pointer' />
            </div>
            <div className="divider px-3 "></div>
            {searchUser?.length > 0 ? (
                <>
                </>

            ) : (
                <>
                    <div className='min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar '>
                        <div className='w-auto'>
                            {chatUser.length === 0 ? (
                                <>
                                    <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                                        <h1>Why are you Alone?🤔</h1>
                                        <h1>Search Users to Chat.</h1>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {chatUser.map((user, index) => (
                                        <div key={user._id}>
                                            <div
                                                onClick={() => handleUserClick(user)}
                                                className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                                    ${selectUserId === user?._id ? 'bg-sky-500' : ''}`}>
                                                <div className='avatar'>
                                                    <div className='w-12 rounded-full'>
                                                        <img src={user.profilepic} alt="user.img" />
                                                    </div>
                                                    <div className='flex flex-col flex-1'>
                                                        <p className='font-bold text-gray-950'>{user.username}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="divider divide-solid px-3 h-px">

                                            </div>
                                        </div>
                                    )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )
            }
        </div >
    )
}

export default Sidebar
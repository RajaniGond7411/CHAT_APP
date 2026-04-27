import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import MessageContainer from './components/MessageContainer.jsx';
import Sidebar from './components/Sidebar.jsx';

const Home = () => {
    const { authUser } = useAuth();
    return (
        <div className='flex justify-between min-w-full 
       md:min-w-150
       md:max-[65%] px-2 h-[80%]
        md:h-full rounded-xl shadow-lg bg-white/20 backdrop-blur-md border border-white/10'>
            <div>
                <Sidebar />
            </div>
            <div>
                <MessageContainer />
            </div>
        </div>
    )
}

export default Home
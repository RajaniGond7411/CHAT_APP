import React from 'react'
import userConversation from '../../Zustand/useConversation.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PiChatsFill } from "react-icons/pi";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const MessageContainer = () => {
  const { messages, selectedConversation, setSelectedConversation } = userConversation();
  const { authUser } = useAuth();
  return (
    <div className="md:min-w-125 h-full flex-col py-2">
      {selectedConversation === null ? (
        <div className='flex items-center justify-center w-full h-full'>
          <div className='px-4 text-center text-2xl text-gray-950
           font-semibold flex flex-col items-center gap-2'>
            <p className='text-2xl'>Welcome!!🙏 {authUser.fullname}😊 </p>
            <p className='text-lg'> Select a person to start messaging..</p>
            <PiChatsFill className='text-6xl text-center' />
          </div>
        </div>
      ) : (<>
        <div className='flex justify-between gap-1 bg-sky-600 ml-2 md:px-2 rounded-lg h-10 md:h-12'>
          <div className='flex gap-2 md:justify-between items-center w-full'>
            <div className='md:hidden ml-1 self-center'>
              <button onClick={() => { "" }} className='bg-white rounded-full px-2 py-1 self-center'>
                <IoArrowBackCircleOutline size={25} />
              </button>
            </div>
            <div className='flex justify-between mr-2 gap-2'>
              <div className='self-center'>
                <img className='rounded-full w-6 md:w-10 md: h-10 cursor-pointer'
                  src={selectedConversation?.profilepic} />
              </div>
              <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
                {selectedConversation?.fullname}
              </span>
            </div>
          </div>
        </div>
      </>)
      }
    </div>
  )
}

export default MessageContainer
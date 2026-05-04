import React, { useEffect, useRef, useState } from 'react'
import userConversation from '../../Zustand/useConversation.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PiChatsFill } from "react-icons/pi";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from 'axios';

const MessageContainer = ({ onBackUser }) => {
  const { messages, selectedConversation, setMessage, setSelectedConversation } = userConversation();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(`/api/message/${selectedConversation?._id}`);
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setMessage(data);
      } catch (error) {
        setLoading(false);
        console.log(error);

      }
    }
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessage])
  console.log(messages);

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
              <button onClick={() => onBackUser(true)} className='bg-white rounded-full px-2 py-1 self-center'>
                <IoMdArrowRoundBack size={25} />
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
        <div className="flex-1 overflow-auto">
          {loading && (
            <div className='flex w-full flex-col items-center justify-center gap-4 bg-transparent'>
              <div className='loading loading-spinner '></div>
            </div>
          )}
          {!loading && messages?.length === 0 && (
            <p className='text-center text-white items-center'><i>Start a Conversation..</i></p>
          )}
          {!loading && messages?.length > 0 && messages?.map((message) => (
            <div className='text-white' key={message?._id} ref={lastMessageRef}>
              <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
                <div className='chat-image avatar'></div>
                <div className={`chat-bubble ${message.senderId === authUser._id ? 'bg-blue-600' : ''}`}>
                  {message?.message}
                </div>
                <div className='chat-footer text-[10px] opacity-80'>
                  {new Date(message?.createdAt).toLocaleDateString('en-IN')}
                  {new Date(message?.createdAt).toLocaleDateString('en-IN', { hour: 'numeric', minute: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>)
      }

    </div>
  )
}

export default MessageContainer
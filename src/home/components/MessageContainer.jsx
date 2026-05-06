import React, { useEffect, useRef, useState } from 'react'
import userConversation from '../../Zustand/useConversation.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PiChatsFill } from "react-icons/pi";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import { BiSolidSend } from "react-icons/bi";

const MessageContainer = ({ onBackUser }) => {
  const { messages, selectedConversation, setMessage, setSelectedConversation } = userConversation();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)

  }, [messages])

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

  const handleMessages = (e) => {
    setSendData(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation?._id}`,
        { messages: sendData });
      const data = await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }
      setSending(false);
      setMessage([...messages, data])
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  }

  return (
    <div className="md:min-w-125 h-[99%] flex flex-col py-2">
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
            <div className='' key={message?._id} ref={lastMessageRef}>
              <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
                <div className='chat-image avatar'></div>
                <div className={`chat-bubble ${message.senderId === authUser._id ? 'bg-sky-600' : ''}`}>
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
        <form onSubmit={handleSubmit} className='rounded-full text-black'>
          <div className='w-full rounded-full flex items-center bg-white'>
            <input value={sendData} onChange={handleMessages} required id='message' type='text'
              className='w-full bg-transparent outline-none px-4 rounded-full' />
            <button type='submit'>
              {sending ? <div className='loading loading-spinner'></div> :
                <BiSolidSend size={20}
                  className='text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1' />
              }
            </button>
          </div>
        </form>
      </>)}
    </div>
  )
}

export default MessageContainer
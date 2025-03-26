import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import "./Message.css"; // Import the CSS file
import { GlobalContext } from '@/component/GlobalStore/GlobalState';

const Message = () => {
  const { user } = useAuth();
  const { handleToggleState, upDatePage } = useContext(GlobalContext);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // Listen for new messages
    socketRef.current.on('newMessage', (message) => {
      if (selectedUser && (message.sender._id === selectedUser._id || message.recipient._id === selectedUser._id)) {
        setMessages(prev => [...prev, message]);
      }
    });

    // Load initial conversations and messages
    loadConversations();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      loadMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Group messages by conversation
      const conversationMap = new Map();
      data.forEach(message => {
        const otherUser = message.sender._id === user._id ? message.recipient : message.sender;
        if (!conversationMap.has(otherUser._id)) {
          conversationMap.set(otherUser._id, {
            user: otherUser,
            lastMessage: message,
            unread: message.recipient._id === user._id && !message.read
          });
        }
      });
      
      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to load messages');
      }
      
      const messages = await response.json();
      setMessages(messages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages. Please try again later.');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          recipientId: selectedUser._id,
          content: newMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 p-3 ">
    <header className="flex justify-between">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-medium">
              {user?.role === 'mentor' ? 'Mentees' : 'Mentors'}
            </h1>
            <p className="text-base font-medium text-slate-600">
              {user?.role === 'mentor' ? 'Connect with Mentees' : 'Find a Mentor'}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <img
              onClick={() => upDatePage("Message")}
              src="/image/messageIcon.png"
              className="md:w-12 h-9 md:h-12 cursor-pointer"
              alt="Message Icon"
              loading="lazy"
            />
            <img
              onClick={() => upDatePage("Setting")}
              src="/image/settingIcon.png"
              className="md:w-12 h-9 md:h-12 cursor-pointer"
              alt="Setting Icon"
              loading="lazy"
            />
          </div>
        </div>

        <div onClick={handleToggleState} className="block lg:hidden mt-3">
          <button aria-label="Toggle menu">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        </header>
 
    <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] lg:h-[calc(100vh-120px)]">
      
      {/* Conversations List */}
      <div className="w-full lg:w-1/3 border-b lg:border-r border-gray-200 overflow-y-auto">
        <div className="p-2 lg:p-4">
          {conversations.map((conv) => (
            <div
              key={conv.user._id}
              className={`flex items-center p-2 lg:p-3 cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === conv.user._id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setSelectedUser(conv.user)}
            >
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className={`w-8 h-8 lg:w-10 lg:h-10 ${
                    conv.user.isBot ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                {conv.unread && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conv.unread ? '1' : ''}
                  </span>
                )}
              </div>
              <div className="ml-2 lg:ml-3">
                <h3 className="font-medium text-sm lg:text-base">
                  {conv.user.name}
                  {conv.user.isBot && (
                    <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      Bot
                    </span>
                  )}
                </h3>
                <p className="text-xs lg:text-sm text-gray-500 truncate">
                  {conv.lastMessage.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-3 lg:p-4 border-b border-gray-200 flex items-center">
              <button 
                onClick={() => setSelectedUser(null)}
                className="lg:hidden mr-2 text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <div className="flex items-center">
                <h3 className="font-medium text-sm lg:text-base">{selectedUser.name}</h3>
                {selectedUser.isBot && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    Bot
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 lg:p-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender._id === user._id ? 'justify-end' : 'justify-start'
                  } mb-2 lg:mb-4`}
                >
                  <div
                    className={`max-w-[85%] lg:max-w-[70%] rounded-lg p-2 lg:p-3 ${
                      message.sender._id === user._id
                        ? 'bg-customOrange text-white'
                        : message.sender.isBot
                        ? 'bg-blue-50 text-blue-800 border border-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {message.sender.isBot && (
                      <div className="flex items-center mb-1">
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-xs font-medium text-blue-600">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm lg:text-base">{message.content}</p>
                    <span className={`text-[10px] lg:text-xs opacity-70 ${
                      message.sender._id === user._id ? 'text-white' : ''
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-2 lg:p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-customOrange"
                />
                <button
                  type="submit"
                  className="bg-customOrange text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm lg:text-base">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Message;
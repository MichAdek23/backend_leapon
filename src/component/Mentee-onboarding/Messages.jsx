import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical, Search } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { GlobalContext } from '@/component/GlobalStore/GlobalState';

const Messages = () => {
  const { handleToggleState } = useContext(GlobalContext);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const response = await fetch(`/conversations/${activeConversation._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newMessage })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const message = await response.json();
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex mt-4 justify-between px-4 mb-8">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-medium">Messages</h1>
            <p className="text-base font-medium text-slate-600">Communicate with your mentors</p>
          </div>
        </div>
        <div onClick={handleToggleState} className="block lg:hidden mt-3">
          <button aria-label="Toggle menu">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-6xl h-[calc(100vh-12rem)]">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r dark:border-gray-700">
            <div className="p-4 border-b dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {conversations.map(conversation => (
                <div
                  key={conversation._id}
                  onClick={() => setActiveConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    activeConversation?._id === conversation._id ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={conversation.mentor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.mentor.name)}&background=random`}
                      alt={conversation.mentor.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{conversation.mentor.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={activeConversation.mentor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.mentor.name)}&background=random`}
                      alt={activeConversation.mentor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{activeConversation.mentor.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
                    </div>
                  </div>
                  <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div
                      key={message._id}
                      className={`flex ${message.sender === 'mentee' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'mentee'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 
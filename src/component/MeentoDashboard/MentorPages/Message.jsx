import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import "./Message.css"; // Import the CSS file

const Message = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

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
      setMessages(prev => [...prev, message]);
      if (message.sender._id !== user._id) {
        setUnreadCount(prev => prev + 1);
      }
    });

    // Load initial conversations and messages
    loadConversations();
    loadUnreadCount();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser._id);
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

  const loadMessages = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/unread/count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
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

      if (response.ok) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          {conversations.map((conv) => (
            <div
              key={conv.user._id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === conv.user._id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setSelectedUser(conv.user)}
            >
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-10 h-10 text-gray-400"
                />
                {conv.unread && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conv.unread ? '1' : ''}
                  </span>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{conv.user.name}</h3>
                <p className="text-sm text-gray-500 truncate">
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
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium">{selectedUser.name}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender._id === user._id ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender._id === user._id
                        ? 'bg-customOrange text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-70">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-customOrange"
                />
                <button
                  type="submit"
                  className="bg-customOrange text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
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
  );
};

export default Message;
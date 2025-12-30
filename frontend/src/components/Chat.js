import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Chat.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Chat = ({ selectedUserId, onClose }) => {
  const { user, token } = useAuth();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!token || !selectedUserId) return;

    const newSocket = io(API_URL.replace('/api', ''), {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on('new-message', (data) => {
      setChat(data.chat);
      setMessages(data.chat.messages);
      setIsTyping(false);
    });

    newSocket.on('typing', (data) => {
      if (data.userId !== user.id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [token, selectedUserId, user]);

  useEffect(() => {
    if (selectedUserId && token) {
      fetchChat();
    }
  }, [selectedUserId, token]);

  useEffect(() => {
    if (chat && socket) {
      socket.emit('join-chat', chat._id);
    }
  }, [chat, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChat = async () => {
    try {
      const response = await axios.get(`${API_URL}/chats/${selectedUserId}`);
      setChat(response.data);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to fetch chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chat || !socket) return;

    socket.emit('send-message', {
      chatId: chat._id,
      text: message,
    });

    setMessage('');
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleTyping = () => {
    if (!socket || !chat) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', { chatId: chat._id, isTyping: true });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit('typing', { chatId: chat._id, isTyping: false });
    }, 1000);
  };

  if (!selectedUserId) return null;

  const otherUser = chat?.participants?.find((p) => {
    const participantId = typeof p._id === 'object' ? p._id.toString() : p._id;
    return participantId !== user.id;
  });

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className={`user-status ${otherUser?.isOnline ? 'online' : 'offline'}`}></div>
          <span>{otherUser?.username || 'Loading...'}</span>
        </div>
        <button onClick={onClose} className="close-chat">×</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const senderId = typeof msg.sender === 'object' 
            ? (msg.sender._id ? msg.sender._id.toString() : msg.sender.toString())
            : msg.sender.toString();
          const isOwn = senderId === user.id;
          return (
            <div key={index} className={`message ${isOwn ? 'own' : 'other'}`}>
              <div className="message-content">
                <div className="message-text">{msg.text}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-button" disabled={!message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;


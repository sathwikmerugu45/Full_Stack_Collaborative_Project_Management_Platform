import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CHAT_MESSAGES } from '../../graphql/queries';
import { SEND_MESSAGE } from '../../graphql/mutations';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Send, MessageCircle } from 'lucide-react';

interface ChatPanelProps {
  projectId: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ projectId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, sendMessage: sendSocketMessage } = useSocket();
  const { user } = useAuth();

  const { data, loading, refetch } = useQuery(GET_CHAT_MESSAGES, {
    variables: { projectId },
    errorPolicy: 'all'
  });

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    if (data?.chatMessages) {
      setMessages(data.chatMessages);
    }
  }, [data]);

  useEffect(() => {
    if (socket) {
      socket.on('new-message', (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
        refetch();
      });

      socket.on('user-typing', ({ user: typingUser, isTyping }) => {
        setTypingUsers(prev => {
          if (isTyping) {
            return prev.includes(typingUser.name) ? prev : [...prev, typingUser.name];
          } else {
            return prev.filter(name => name !== typingUser.name);
          }
        });
      });

      return () => {
        socket.off('new-message');
        socket.off('user-typing');
      };
    }
  }, [socket, refetch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const { data: messageData } = await sendMessage({
        variables: {
          projectId,
          content: message
        }
      });

      if (messageData?.sendMessage) {
        sendSocketMessage(projectId, messageData.sendMessage);
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (socket && user) {
      socket.emit('typing', { projectId, user, isTyping });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-200">
        <MessageCircle className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Project Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.user.id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.user.id === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    msg.user.id === user?.id 
                      ? 'bg-blue-800 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  }`}>
                    {msg.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-xs ${
                    msg.user.id === user?.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {msg.user.name}
                  </span>
                </div>
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.user.id === user?.id ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 italic">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping(e.target.value.length > 0);
            }}
            onBlur={() => handleTyping(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
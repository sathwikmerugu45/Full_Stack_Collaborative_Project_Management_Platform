import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  sendMessage: (projectId: string, message: any) => void;
  sendTaskUpdate: (projectId: string, task: any) => void;
  sendProjectUpdate: (projectId: string, project: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socketInstance = io('http://localhost:3001');
      
      socketInstance.on('connect', () => {
        console.log('Connected to server');
        socketInstance.emit('user-online', user.id);
      });

      socketInstance.on('user-status-change', ({ userId, online }) => {
        setOnlineUsers(prev => {
          if (online) {
            return [...prev, userId];
          } else {
            return prev.filter(id => id !== userId);
          }
        });
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user]);

  const joinProject = (projectId: string) => {
    if (socket) {
      socket.emit('join-project', projectId);
    }
  };

  const leaveProject = (projectId: string) => {
    if (socket) {
      socket.emit('leave-project', projectId);
    }
  };

  const sendMessage = (projectId: string, message: any) => {
    if (socket) {
      socket.emit('send-message', { projectId, message });
    }
  };

  const sendTaskUpdate = (projectId: string, task: any) => {
    if (socket) {
      socket.emit('task-updated', { projectId, task });
    }
  };

  const sendProjectUpdate = (projectId: string, project: any) => {
    if (socket) {
      socket.emit('project-updated', { projectId, project });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        joinProject,
        leaveProject,
        sendMessage,
        sendTaskUpdate,
        sendProjectUpdate,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
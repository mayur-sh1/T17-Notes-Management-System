import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import socketService from '../services/socket';
import { AuthService } from '../services/auth';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (user) {
      const token = AuthService.getToken();
      if (token) {
        const socket = socketService.connect(token);
        
        socket.on('connect', () => {
          setConnected(true);
        });

        socket.on('disconnect', () => {
          setConnected(false);
        });

        return () => {
          socketService.disconnect();
          setConnected(false);
        };
      }
    } else {
      socketService.disconnect();
      setConnected(false);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketService.getSocket(), connected }}>
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


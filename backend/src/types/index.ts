import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export interface JwtUserPayload extends JwtPayload {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface SocketUser {
  userId: string;
  socketId: string;
  username?: string;
}

export interface NoteEditChange {
  type: 'insert' | 'delete' | 'format';
  position: number;
  length?: number;
  content?: string;
  format?: Record<string, any>;
}

export interface NoteEditData {
  noteId: string;
  changes: NoteEditChange[];
  timestamp: Date;
}


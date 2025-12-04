import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export interface NoteEditData {
  noteId: string;
  changes: any;
  timestamp: Date;
}

export interface CommentData {
  noteId: string;
  content: string;
}


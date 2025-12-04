export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isRichText: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: User;
  tags?: NoteTag[];
  shares?: Share[];
  comments?: Comment[];
  _count?: {
    comments?: number;
    versions?: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  _count?: {
    notes?: number;
  };
}

export interface NoteTag {
  id: string;
  noteId: string;
  tagId: string;
  tag: Tag;
}

export interface Share {
  id: string;
  noteId: string;
  userId?: string;
  groupId?: string;
  permission: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
  createdAt: string;
  user?: User;
  group?: Group;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator?: User;
  members?: GroupMember[];
  _count?: {
    members?: number;
    shares?: number;
  };
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user?: User;
}

export interface Comment {
  id: string;
  content: string;
  noteId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface VersionHistory {
  id: string;
  noteId: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}


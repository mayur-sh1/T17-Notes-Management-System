export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export const PERMISSIONS = {
  READ: 'READ',
  WRITE: 'WRITE',
  DELETE: 'DELETE',
  ADMIN: 'ADMIN',
} as const;

export const NOTIFICATION_TYPES = {
  NOTE_SHARED: 'note_shared',
  NOTE_UPDATED: 'note_updated',
  COMMENT_ADDED: 'comment_added',
  GROUP_INVITE: 'group_invite',
} as const;

export const SOCKET_EVENTS = {
  // Client to Server
  NOTE_JOIN: 'note:join',
  NOTE_LEAVE: 'note:leave',
  NOTE_EDIT: 'note:edit',
  NOTE_SAVE: 'note:save',
  COMMENT_ADD: 'comment:add',
  
  // Server to Client
  USER_JOINED: 'user:joined',
  USER_LEFT: 'user:left',
  NOTE_UPDATE: 'note:update',
  COMMENT_NEW: 'comment:new',
  NOTIFICATION_NEW: 'notification:new',
  ERROR: 'error',
} as const;


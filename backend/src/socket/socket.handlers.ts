import { Server } from 'socket.io';
import { AuthenticatedSocket, NoteEditData, CommentData } from './socket.types';
import prisma from '../config/database';
import { getRedisClient } from '../config/redis';
import { NOTIFICATION_TYPES } from '../utils/constants';

const activeEditors = new Map<string, Set<string>>(); // noteId -> Set of userIds

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    const username = socket.user?.username || 'Unknown';
    
    console.log(`✅ User ${username} (${userId}) connected: ${socket.id}`);

    // Join user's personal room for notifications
    socket.join(`user:${userId}`);

    // Handle note editing room joins
    socket.on('note:join', async (noteId: string) => {
      try {
        // Check if user has access to this note
        const hasAccess = await checkNoteAccess(userId, noteId);
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied to this note' });
          return;
        }

        socket.join(`note:${noteId}`);
        
        // Track active editors
        if (!activeEditors.has(noteId)) {
          activeEditors.set(noteId, new Set());
        }
        activeEditors.get(noteId)!.add(userId);

        // Store active editor in Redis
        const redis = await getRedisClient();
        await redis.setEx(`note:${noteId}:editor:${socket.id}`, 3600, userId);
        
        // Broadcast that user joined
        socket.to(`note:${noteId}`).emit('user:joined', {
          userId,
          username,
          socketId: socket.id,
        });

        // Send current active editors to the new user
        const editors = Array.from(activeEditors.get(noteId) || []);
        socket.emit('note:editors', { editors });
      } catch (error) {
        console.error('Error in note:join:', error);
        socket.emit('error', { message: 'Failed to join note room' });
      }
    });

    socket.on('note:leave', async (noteId: string) => {
      try {
        socket.leave(`note:${noteId}`);
        
        // Remove from active editors
        if (activeEditors.has(noteId)) {
          activeEditors.get(noteId)!.delete(userId);
          if (activeEditors.get(noteId)!.size === 0) {
            activeEditors.delete(noteId);
          }
        }

        // Remove from Redis
        const redis = await getRedisClient();
        await redis.del(`note:${noteId}:editor:${socket.id}`);

        socket.to(`note:${noteId}`).emit('user:left', {
          userId,
          username,
          socketId: socket.id,
        });
      } catch (error) {
        console.error('Error in note:leave:', error);
      }
    });

    socket.on('note:edit', async (data: NoteEditData) => {
      try {
        const { noteId, changes } = data;
        
        // Verify user is in the note room
        const rooms = Array.from(socket.rooms);
        if (!rooms.includes(`note:${noteId}`)) {
          return;
        }

        // Broadcast to other editors in the room
        socket.to(`note:${noteId}`).emit('note:update', {
          userId,
          username,
          changes,
          timestamp: new Date(),
        });
        
        // Store edit in Redis for conflict resolution
        const redis = await getRedisClient();
        await redis.lPush(
          `note:${noteId}:edits`,
          JSON.stringify({ userId, changes, timestamp: new Date() })
        );
        await redis.lTrim(`note:${noteId}:edits`, 0, 49); // Keep last 50 edits
      } catch (error) {
        console.error('Error in note:edit:', error);
        socket.emit('error', { message: 'Failed to process edit' });
      }
    });

    socket.on('note:save', async (data: { noteId: string; content: string; title: string }) => {
      try {
        const { noteId, content, title } = data;

        // Check write permission
        const hasWriteAccess = await checkWriteAccess(userId, noteId);
        if (!hasWriteAccess) {
          socket.emit('error', { message: 'No write permission for this note' });
          return;
        }

        // Update note in database
        const note = await prisma.note.update({
          where: { id: noteId },
          data: {
            title,
            content,
            updatedAt: new Date(),
          },
        });

        // Create version history
        await prisma.versionHistory.create({
          data: {
            noteId,
            title,
            content,
            createdBy: userId,
          },
        });

        // Notify all users who have access to this note
        const shares = await prisma.share.findMany({
          where: { noteId },
          select: {
            userId: true,
            group: {
              select: {
                members: {
                  select: { userId: true },
                },
              },
            },
          },
        });

        const userIds = new Set<string>();
        shares.forEach((share) => {
          if (share.userId) userIds.add(share.userId);
          share.group?.members.forEach((member) => userIds.add(member.userId));
        });

        // Get note author
        const noteAuthor = await prisma.note.findUnique({
          where: { id: noteId },
          select: { authorId: true },
        });
        if (noteAuthor) {
          userIds.add(noteAuthor.authorId);
        }

        // Create notifications
        for (const uid of userIds) {
          if (uid !== userId) {
            await prisma.notification.create({
              data: {
                userId: uid,
                type: NOTIFICATION_TYPES.NOTE_UPDATED,
                title: 'Note Updated',
                message: `${username} updated a note you have access to: "${title}"`,
                link: `/notes/${noteId}`,
              },
            });

            // Send real-time notification
            io.to(`user:${uid}`).emit('notification:new', {
              type: NOTIFICATION_TYPES.NOTE_UPDATED,
              title: 'Note Updated',
              message: `${username} updated a note: "${title}"`,
              link: `/notes/${noteId}`,
            });
          }
        }

        // Clear Redis edit cache
        const redis = await getRedisClient();
        await redis.del(`note:${noteId}:edits`);

        socket.emit('note:saved', { noteId, success: true });
      } catch (error) {
        console.error('Error in note:save:', error);
        socket.emit('error', { message: 'Failed to save note' });
      }
    });

    socket.on('comment:add', async (data: CommentData) => {
      try {
        const { noteId, content } = data;

        // Check read permission
        const hasAccess = await checkNoteAccess(userId, noteId);
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        const comment = await prisma.comment.create({
          data: {
            noteId,
            userId,
            content,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        });

        // Broadcast to all users in the note room
        io.to(`note:${noteId}`).emit('comment:new', comment);

        // Notify note owner
        const note = await prisma.note.findUnique({
          where: { id: noteId },
          select: { authorId: true, title: true },
        });

        if (note && note.authorId !== userId) {
          await prisma.notification.create({
            data: {
              userId: note.authorId,
              type: NOTIFICATION_TYPES.COMMENT_ADDED,
              title: 'New Comment',
              message: `${username} commented on your note: "${note.title}"`,
              link: `/notes/${noteId}`,
            },
          });

          io.to(`user:${note.authorId}`).emit('notification:new', {
            type: NOTIFICATION_TYPES.COMMENT_ADDED,
            title: 'New Comment',
            message: `${username} commented on your note`,
            link: `/notes/${noteId}`,
          });
        }
      } catch (error) {
        console.error('Error in comment:add:', error);
        socket.emit('error', { message: 'Failed to add comment' });
      }
    });

    socket.on('disconnect', async () => {
      console.log(`❌ User ${username} (${userId}) disconnected: ${socket.id}`);
      
      // Clean up active editors
      for (const [noteId, editors] of activeEditors.entries()) {
        editors.delete(userId);
        if (editors.size === 0) {
          activeEditors.delete(noteId);
        }
      }
    });
  });
};

// Helper functions
async function checkNoteAccess(userId: string, noteId: string): Promise<boolean> {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      author: true,
      shares: {
        where: {
          OR: [
            { userId },
            {
              group: {
                members: {
                  some: { userId },
                },
              },
            },
          ],
        },
      },
    },
  });

  if (!note) return false;
  if (note.authorId === userId) return true;
  if (note.shares.length > 0) return true;

  return false;
}

async function checkWriteAccess(userId: string, noteId: string): Promise<boolean> {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      shares: {
        where: {
          OR: [
            {
              userId,
              permission: { in: ['WRITE', 'DELETE', 'ADMIN'] },
            },
            {
              group: {
                members: {
                  some: {
                    userId,
                    role: { in: ['ADMIN', 'MODERATOR'] },
                  },
                },
              },
              permission: { in: ['WRITE', 'DELETE', 'ADMIN'] },
            },
          ],
        },
      },
    },
  });

  if (!note) return false;
  if (note.authorId === userId) return true;
  if (note.shares.length > 0) return true;

  return false;
}


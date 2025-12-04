import prisma from '../config/database';
import { NOTIFICATION_TYPES } from '../utils/constants';

export class SharingService {
  static async shareNote(
    noteId: string,
    ownerId: string,
    shareData: {
      userId?: string;
      groupId?: string;
      permission: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
    }
  ) {
    // Check if user owns the note
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      select: { authorId: true, title: true },
    });

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.authorId !== ownerId) {
      throw new Error('Only note owner can share notes');
    }

    // Check if share already exists
    const existing = await prisma.share.findFirst({
      where: {
        noteId,
        userId: shareData.userId,
        groupId: shareData.groupId,
      },
    });

    if (existing) {
      // Update permission
      const share = await prisma.share.update({
        where: { id: existing.id },
        data: { permission: shareData.permission as any },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return share;
    }

    // Create new share
    const share = await prisma.share.create({
      data: {
        noteId,
        userId: shareData.userId,
        groupId: shareData.groupId,
        permission: shareData.permission as any,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Create notification
    if (shareData.userId) {
      await prisma.notification.create({
        data: {
          userId: shareData.userId,
          type: NOTIFICATION_TYPES.NOTE_SHARED,
          title: 'Note Shared',
          message: `A note "${note.title}" has been shared with you`,
          link: `/notes/${noteId}`,
        },
      });
    }

    return share;
  }

  static async getSharedNotes(userId: string) {
    const notes = await prisma.note.findMany({
      where: {
        shares: {
          some: {
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
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
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
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            group: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return notes;
  }

  static async updateSharePermission(
    shareId: string,
    noteOwnerId: string,
    permission: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN'
  ) {
    const share = await prisma.share.findUnique({
      where: { id: shareId },
      include: {
        note: {
          select: { authorId: true },
        },
      },
    });

    if (!share) {
      throw new Error('Share not found');
    }

    if (share.note.authorId !== noteOwnerId) {
      throw new Error('Only note owner can update share permissions');
    }

    const updatedShare = await prisma.share.update({
      where: { id: shareId },
      data: { permission: permission as any },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedShare;
  }

  static async unshareNote(shareId: string, noteOwnerId: string) {
    const share = await prisma.share.findUnique({
      where: { id: shareId },
      include: {
        note: {
          select: { authorId: true },
        },
      },
    });

    if (!share) {
      throw new Error('Share not found');
    }

    if (share.note.authorId !== noteOwnerId) {
      throw new Error('Only note owner can unshare notes');
    }

    await prisma.share.delete({
      where: { id: shareId },
    });

    return { success: true };
  }
}


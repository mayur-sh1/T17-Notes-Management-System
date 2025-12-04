import prisma from '../config/database';
import { createVersionHistory } from '../utils/version-control';

export class NotesService {
  static async createNote(
    authorId: string,
    title: string,
    content: string,
    isRichText: boolean = true,
    tagIds?: string[]
  ) {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        isRichText,
        authorId,
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Create initial version
    await createVersionHistory(note.id, title, content, authorId);

    return note;
  }

  static async getNotes(
    userId: string,
    filters: {
      search?: string;
      tagIds?: string[];
      authorId?: string;
      sharedOnly?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ) {
    const {
      search,
      tagIds,
      authorId,
      sharedOnly = false,
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (sharedOnly) {
      where.shares = {
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
      };
    } else {
      where.OR = [
        { authorId: userId },
        {
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
      ];
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: tagIds },
        },
      };
    }

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          shares: {
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
          _count: {
            select: {
              comments: true,
              versions: true,
            },
          },
        },
      }),
      prisma.note.count({ where }),
    ]);

    return {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getNoteById(noteId: string, userId: string) {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        OR: [
          { authorId: userId },
          {
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
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        shares: {
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
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            versions: true,
          },
        },
      },
    });

    return note;
  }

  static async updateNote(
    noteId: string,
    userId: string,
    data: {
      title?: string;
      content?: string;
      tagIds?: string[];
    }
  ) {
    // Check ownership or write permission
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        OR: [
          { authorId: userId },
          {
            shares: {
              some: {
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
        ],
      },
    });

    if (!note) {
      throw new Error('Note not found or access denied');
    }

    // Update tags if provided
    if (data.tagIds !== undefined) {
      await prisma.noteTag.deleteMany({
        where: { noteId },
      });

      if (data.tagIds.length > 0) {
        await prisma.noteTag.createMany({
          data: data.tagIds.map((tagId) => ({
            noteId,
            tagId,
          })),
        });
      }
    }

    // Update note
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        title: data.title,
        content: data.content,
        updatedAt: new Date(),
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
      },
    });

    // Create version history if content changed
    if (data.content || data.title) {
      await createVersionHistory(
        noteId,
        updatedNote.title,
        updatedNote.content,
        userId
      );
    }

    return updatedNote;
  }

  static async deleteNote(noteId: string, userId: string) {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        OR: [
          { authorId: userId },
          {
            shares: {
              some: {
                userId,
                permission: { in: ['DELETE', 'ADMIN'] },
              },
            },
          },
        ],
      },
    });

    if (!note) {
      throw new Error('Note not found or access denied');
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    return { success: true };
  }

  static async getVersionHistory(noteId: string, userId: string, limit: number = 20) {
    // Check access
    const note = await this.getNoteById(noteId, userId);
    if (!note) {
      throw new Error('Note not found or access denied');
    }

    const versions = await prisma.versionHistory.findMany({
      where: { noteId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return versions;
  }
}


import prisma from '../config/database';

export class TagsService {
  static async getAllTags() {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tags;
  }

  static async createTag(name: string, color?: string) {
    // Check if tag exists
    const existing = await prisma.tag.findUnique({
      where: { name: name.toLowerCase() },
    });

    if (existing) {
      throw new Error('Tag already exists');
    }

    const tag = await prisma.tag.create({
      data: {
        name: name.toLowerCase(),
        color: color || '#3B82F6',
      },
    });

    return tag;
  }

  static async getTagByName(name: string) {
    const tag = await prisma.tag.findUnique({
      where: { name: name.toLowerCase() },
      include: {
        notes: {
          include: {
            note: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            notes: true,
          },
        },
      },
    });

    return tag;
  }

  static async assignTagsToNote(noteId: string, tagIds: string[]) {
    // Remove existing tags
    await prisma.noteTag.deleteMany({
      where: { noteId },
    });

    // Add new tags
    if (tagIds.length > 0) {
      await prisma.noteTag.createMany({
        data: tagIds.map((tagId) => ({
          noteId,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return note;
  }
}


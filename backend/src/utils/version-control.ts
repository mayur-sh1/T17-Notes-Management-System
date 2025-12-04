import prisma from '../config/database';

export const createVersionHistory = async (
  noteId: string,
  title: string,
  content: string,
  createdBy: string
) => {
  return prisma.versionHistory.create({
    data: {
      noteId,
      title,
      content,
      createdBy,
    },
  });
};

export const getVersionHistory = async (noteId: string, limit = 20) => {
  return prisma.versionHistory.findMany({
    where: { noteId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};

export const restoreVersion = async (versionId: string) => {
  const version = await prisma.versionHistory.findUnique({
    where: { id: versionId },
  });

  if (!version) {
    throw new Error('Version not found');
  }

  return prisma.note.update({
    where: { id: version.noteId },
    data: {
      title: version.title,
      content: version.content,
      updatedAt: new Date(),
    },
  });
};


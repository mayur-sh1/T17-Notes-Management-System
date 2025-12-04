import prisma from '../config/database';
import { NOTIFICATION_TYPES } from '../utils/constants';

export class GroupsService {
  static async createGroup(
    creatorId: string,
    name: string,
    description?: string
  ) {
    const group = await prisma.group.create({
      data: {
        name,
        description,
        creatorId,
        members: {
          create: {
            userId: creatorId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return group;
  }

  static async getUserGroups(userId: string) {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            shares: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return groups;
  }

  static async getGroupById(groupId: string, userId: string) {
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: { userId },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        shares: {
          include: {
            note: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return group;
  }

  static async addMember(
    groupId: string,
    adminId: string,
    userId: string,
    role: string = 'MEMBER'
  ) {
    // Check if requester is admin
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        OR: [
          { creatorId: adminId },
          {
            members: {
              some: {
                userId: adminId,
                role: { in: ['ADMIN', 'MODERATOR'] },
              },
            },
          },
        ],
      },
    });

    if (!group) {
      throw new Error('Group not found or insufficient permissions');
    }

    // Check if user is already a member
    const existing = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (existing) {
      throw new Error('User is already a member of this group');
    }

    const member = await prisma.groupMember.create({
      data: {
        groupId,
        userId,
        role,
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

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: NOTIFICATION_TYPES.GROUP_INVITE,
        title: 'Group Invitation',
        message: `You have been added to the group "${group.name}"`,
        link: `/groups/${groupId}`,
      },
    });

    return member;
  }

  static async removeMember(
    groupId: string,
    adminId: string,
    userId: string
  ) {
    // Check if requester is admin
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        OR: [
          { creatorId: adminId },
          {
            members: {
              some: {
                userId: adminId,
                role: { in: ['ADMIN', 'MODERATOR'] },
              },
            },
          },
        ],
      },
    });

    if (!group) {
      throw new Error('Group not found or insufficient permissions');
    }

    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    return { success: true };
  }

  static async updateGroup(
    groupId: string,
    adminId: string,
    data: { name?: string; description?: string }
  ) {
    // Check if requester is admin or creator
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        OR: [
          { creatorId: adminId },
          {
            members: {
              some: {
                userId: adminId,
                role: 'ADMIN',
              },
            },
          },
        ],
      },
    });

    if (!group) {
      throw new Error('Group not found or insufficient permissions');
    }

    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return updatedGroup;
  }
}


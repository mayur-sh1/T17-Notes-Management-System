import prisma from '../config/database';

export class AdminService {
  static async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              notes: true,
              sharedNotes: true,
              groups: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    return user;
  }

  static async deleteUser(userId: string) {
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  }

  static async getSystemStats() {
    const [
      totalUsers,
      totalNotes,
      totalGroups,
      totalTags,
      activeUsersLast30Days,
      mostUsedTags,
      mostActiveUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.note.count(),
      prisma.group.count(),
      prisma.tag.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.tag.findMany({
        include: {
          _count: {
            select: {
              notes: true,
            },
          },
        },
        orderBy: {
          notes: {
            _count: 'desc',
          },
        },
        take: 10,
      }),
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          _count: {
            select: {
              notes: true,
            },
          },
        },
        orderBy: {
          notes: {
            _count: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    return {
      totalUsers,
      totalNotes,
      totalGroups,
      totalTags,
      activeUsersLast30Days,
      mostUsedTags,
      mostActiveUsers,
    };
  }

  static async getAllGroups(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [groups, total] = await Promise.all([
      prisma.group.findMany({
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
            },
          },
          _count: {
            select: {
              members: true,
              shares: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.group.count(),
    ]);

    return {
      groups,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getUsageReports(startDate?: Date, endDate?: Date) {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [notes, users, groups, shares] = await Promise.all([
      prisma.note.count({ where }),
      prisma.user.count({ where }),
      prisma.group.count({ where }),
      prisma.share.count({ where }),
    ]);

    return {
      notes,
      users,
      groups,
      shares,
      period: {
        start: startDate || null,
        end: endDate || null,
      },
    };
  }
}


import { prisma } from "../prisma";
import { logger } from "../logger";

export type ActivityAction =
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "organization.created"
  | "organization.updated"
  | "organization.deleted"
  | "team.created"
  | "team.updated"
  | "team.deleted"
  | "team_member.added"
  | "team_member.removed"
  | "preferences.updated";

export interface LogActivityParams {
  action: ActivityAction;
  entityType: string;
  entityId: string;
  userId?: string;
  organizationId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class ActivityService {
  static async logActivity(params: LogActivityParams): Promise<void> {
    try {
      await prisma.activityLog.create({
        data: {
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          userId: params.userId,
          organizationId: params.organizationId,
          metadata: params.metadata || {},
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });

      logger.debug("Activity logged", {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
      });
    } catch (error) {
      // Log error but don't throw - activity logging shouldn't break the main flow
      logger.error("Failed to log activity", error, {
        action: params.action,
        entityId: params.entityId,
      });
    }
  }

  static async getRecentActivity(
    options: {
      organizationId?: string;
      userId?: string;
      limit?: number;
    } = {}
  ) {
    const { organizationId, userId, limit = 50 } = options;

    const where: any = {};
    if (organizationId) where.organizationId = organizationId;
    if (userId) where.userId = userId;

    return prisma.activityLog.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async getActivityStats(organizationId?: string) {
    const where: any = organizationId ? { organizationId } : {};

    const [total, last24h, last7d] = await Promise.all([
      prisma.activityLog.count({ where }),
      prisma.activityLog.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.activityLog.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      total,
      last24h,
      last7d,
    };
  }
}

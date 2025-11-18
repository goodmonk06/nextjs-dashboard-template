import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateOrganizationSchema } from "@/lib/validations/organization";
import { successResponse, errorResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { eventBus, createEvent, OrganizationUpdatedEvent } from "@/lib/events";
import { metricsAdapter } from "@/lib/adapters/metrics.adapter";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/organizations/:id - Get a single organization
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
        teams: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
        _count: {
          select: {
            users: true,
            teams: true,
            activityLogs: true,
          },
        },
      },
    });

    if (!organization) {
      return errorResponse("Organization not found", null, 404);
    }

    metricsAdapter.recordCounter("api.organizations.get");

    return successResponse(organization);
  } catch (error) {
    logger.error("Error fetching organization", error);
    return errorResponse("Failed to fetch organization", error, 500);
  }
}

// PATCH /api/organizations/:id - Update an organization
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateOrganizationSchema.parse(body);

    const existingOrg = await prisma.organization.findUnique({
      where: { id },
    });

    if (!existingOrg) {
      return errorResponse("Organization not found", null, 404);
    }

    // Check slug uniqueness if being updated
    if (validated.slug) {
      const slugExists = await prisma.organization.findUnique({
        where: { slug: validated.slug },
      });

      if (slugExists && slugExists.id !== id) {
        return errorResponse("Slug already in use", null, 409);
      }
    }

    const organization = await prisma.organization.update({
      where: { id },
      data: validated,
    });

    // Emit event
    const event = createEvent<OrganizationUpdatedEvent>(
      "organization.updated",
      {
        organizationId: organization.id,
        changes: validated,
      }
    );
    await eventBus.emit(event);

    // Record metric
    metricsAdapter.recordCounter("api.organizations.updated");

    logger.info("Organization updated", {
      organizationId: organization.id,
    });

    return successResponse(organization, "Organization updated successfully");
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validation failed", error, 400);
    }
    logger.error("Error updating organization", error);
    return errorResponse("Failed to update organization", error, 500);
  }
}

// DELETE /api/organizations/:id - Delete an organization
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const existingOrg = await prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            teams: true,
          },
        },
      },
    });

    if (!existingOrg) {
      return errorResponse("Organization not found", null, 404);
    }

    // Check if organization has users or teams
    if (existingOrg._count.users > 0 || existingOrg._count.teams > 0) {
      return errorResponse(
        "Cannot delete organization with existing users or teams",
        {
          usersCount: existingOrg._count.users,
          teamsCount: existingOrg._count.teams,
        },
        409
      );
    }

    await prisma.organization.delete({
      where: { id },
    });

    metricsAdapter.recordCounter("api.organizations.deleted");

    logger.info("Organization deleted", { organizationId: id });

    return successResponse(null, "Organization deleted successfully");
  } catch (error) {
    logger.error("Error deleting organization", error);
    return errorResponse("Failed to delete organization", error, 500);
  }
}

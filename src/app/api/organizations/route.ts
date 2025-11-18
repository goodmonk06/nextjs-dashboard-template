import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrganizationSchema } from "@/lib/validations/organization";
import { successResponse, errorResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { eventBus, createEvent, OrganizationCreatedEvent } from "@/lib/events";
import { metricsAdapter } from "@/lib/adapters/metrics.adapter";

// GET /api/organizations - List all organizations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              users: true,
              teams: true,
            },
          },
        },
      }),
      prisma.organization.count(),
    ]);

    metricsAdapter.recordCounter("api.organizations.list");

    return successResponse({
      items: organizations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Error fetching organizations", error);
    return errorResponse("Failed to fetch organizations", error, 500);
  }
}

// POST /api/organizations - Create a new organization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOrganizationSchema.parse(body);

    // Check if slug already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: validated.slug },
    });

    if (existingOrg) {
      return errorResponse("Organization with this slug already exists", null, 409);
    }

    const organization = await prisma.organization.create({
      data: {
        ...validated,
        settings: validated.settings || {},
      },
    });

    // Emit event
    const event = createEvent<OrganizationCreatedEvent>(
      "organization.created",
      {
        organizationId: organization.id,
        name: organization.name,
        slug: organization.slug,
      }
    );
    await eventBus.emit(event);

    // Record metric
    metricsAdapter.recordCounter("api.organizations.created");

    logger.info("Organization created", {
      organizationId: organization.id,
      slug: organization.slug,
    });

    return successResponse(organization, "Organization created successfully", 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validation failed", error, 400);
    }
    logger.error("Error creating organization", error);
    return errorResponse("Failed to create organization", error, 500);
  }
}

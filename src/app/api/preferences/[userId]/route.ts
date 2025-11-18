import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updatePreferencesSchema } from "@/lib/validations/preferences";
import { successResponse, errorResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { metricsAdapter } from "@/lib/adapters/metrics.adapter";

type Params = {
  params: Promise<{
    userId: string;
  }>;
};

// GET /api/preferences/:userId - Get user preferences
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { userId } = await params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse("User not found", null, 404);
    }

    let preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId,
        },
      });
    }

    metricsAdapter.recordCounter("api.preferences.get");

    return successResponse(preferences);
  } catch (error) {
    logger.error("Error fetching preferences", error);
    return errorResponse("Failed to fetch preferences", error, 500);
  }
}

// PATCH /api/preferences/:userId - Update user preferences
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const validated = updatePreferencesSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse("User not found", null, 404);
    }

    // Upsert preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: validated,
      create: {
        userId,
        ...validated,
      },
    });

    metricsAdapter.recordCounter("api.preferences.updated");

    logger.info("Preferences updated", { userId });

    return successResponse(preferences, "Preferences updated successfully");
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validation failed", error, 400);
    }
    logger.error("Error updating preferences", error);
    return errorResponse("Failed to update preferences", error, 500);
  }
}

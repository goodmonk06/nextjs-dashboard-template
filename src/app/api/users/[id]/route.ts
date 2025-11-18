import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validations/user";
import { successResponse, errorResponse } from "@/lib/api-response";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/users/:id - Get a single user
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return errorResponse("User not found", null, 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse("Failed to fetch user", error, 500);
  }
}

// PATCH /api/users/:id - Update a user
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse("User not found", null, 404);
    }

    if (validated.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validated.email },
      });

      if (emailExists && emailExists.id !== id) {
        return errorResponse("Email already in use", null, 409);
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: validated,
    });

    return successResponse(user, "User updated successfully");
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validation failed", error, 400);
    }
    console.error("Error updating user:", error);
    return errorResponse("Failed to update user", error, 500);
  }
}

// DELETE /api/users/:id - Delete a user
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse("User not found", null, 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    return successResponse(null, "User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    return errorResponse("Failed to delete user", error, 500);
  }
}

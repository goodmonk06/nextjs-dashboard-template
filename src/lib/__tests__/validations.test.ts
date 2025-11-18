import { describe, it, expect } from "vitest";
import { createUserSchema, updateUserSchema } from "../validations/user";

describe("User Validation", () => {
  describe("createUserSchema", () => {
    it("should validate a correct user object", () => {
      const validUser = {
        name: "John Doe",
        email: "john@example.com",
        role: "admin" as const,
        status: "active" as const,
      };

      const result = createUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidUser = {
        name: "John Doe",
        email: "not-an-email",
        role: "admin" as const,
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it("should reject empty name", () => {
      const invalidUser = {
        name: "",
        email: "john@example.com",
        role: "admin" as const,
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it("should apply default role of viewer", () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
      };

      const result = createUserSchema.parse(user);
      expect(result.role).toBe("viewer");
    });

    it("should apply default status of active", () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
      };

      const result = createUserSchema.parse(user);
      expect(result.status).toBe("active");
    });

    it("should reject invalid role", () => {
      const invalidUser = {
        name: "John Doe",
        email: "john@example.com",
        role: "superadmin",
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe("updateUserSchema", () => {
    it("should validate partial updates", () => {
      const partialUpdate = {
        name: "Jane Doe",
      };

      const result = updateUserSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it("should validate email-only update", () => {
      const emailUpdate = {
        email: "newemail@example.com",
      };

      const result = updateUserSchema.safeParse(emailUpdate);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email in update", () => {
      const invalidUpdate = {
        email: "invalid-email",
      };

      const result = updateUserSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it("should allow empty object (no updates)", () => {
      const emptyUpdate = {};

      const result = updateUserSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });
  });
});

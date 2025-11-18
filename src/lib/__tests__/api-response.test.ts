import { describe, it, expect } from "vitest";
import { successResponse, errorResponse } from "../api-response";

describe("API Response Helpers", () => {
  describe("successResponse", () => {
    it("should create a success response with data", async () => {
      const data = { id: "1", name: "Test User" };
      const response = successResponse(data);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.data).toEqual(data);
    });

    it("should include optional message", async () => {
      const data = { id: "1" };
      const message = "User created successfully";
      const response = successResponse(data, message);

      const json = await response.json();
      expect(json.message).toBe(message);
    });

    it("should use custom status code", () => {
      const data = { id: "1" };
      const response = successResponse(data, undefined, 201);

      expect(response.status).toBe(201);
    });
  });

  describe("errorResponse", () => {
    it("should create an error response", async () => {
      const errorMessage = "User not found";
      const response = errorResponse(errorMessage);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toBe(errorMessage);
    });

    it("should include error details", async () => {
      const errorMessage = "Validation failed";
      const details = { field: "email", issue: "invalid format" };
      const response = errorResponse(errorMessage, details);

      const json = await response.json();
      expect(json.error).toBe(errorMessage);
      expect(json.details).toEqual(details);
    });

    it("should use custom status code", () => {
      const errorMessage = "Not found";
      const response = errorResponse(errorMessage, null, 404);

      expect(response.status).toBe(404);
    });
  });
});

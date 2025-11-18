import { NextResponse } from "next/server";

export type ApiError = {
  error: string;
  details?: unknown;
};

export type ApiSuccess<T> = {
  data: T;
  message?: string;
};

export function successResponse<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ data, message }, { status });
}

export function errorResponse(
  error: string,
  details?: unknown,
  status = 400
): NextResponse<ApiError> {
  return NextResponse.json({ error, details }, { status });
}

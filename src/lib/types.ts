// User types
export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "pending" | "inactive";
  organizationId: string | null;
  avatarUrl: string | null;
  lastLoginAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

// Organization types
export type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "suspended" | "archived";
  settings: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
};

// User Preferences types
export type UserPreferences = {
  id: string;
  userId: string;
  theme: "dark" | "light" | "auto";
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  dashboardLayout: Record<string, any>;
  customSettings: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
};

// Team types
export type Team = {
  id: string;
  name: string;
  description: string | null;
  organizationId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  joinedAt: Date | string;
};

// Activity Log types
export type ActivityLog = {
  id: string;
  organizationId: string | null;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, any>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date | string;
};

// API Response types
export type PaginatedResponse<T> = {
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type ApiError = {
  error: string;
  details?: unknown;
};

export type ApiSuccess<T> = {
  data: T;
  message?: string;
};

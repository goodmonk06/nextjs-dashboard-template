export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "pending" | "inactive";
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type PaginatedResponse<T> = {
  data: {
    users: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

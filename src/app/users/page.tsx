"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Table from "@/components/Table";
import type { User } from "@/lib/types";

type StatusBadgeProps = {
  status: User["status"];
};

function StatusBadge({ status }: StatusBadgeProps) {
  const colors = {
    active: "bg-green-500/10 text-green-400",
    pending: "bg-yellow-500/10 text-yellow-400",
    inactive: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

type RoleBadgeProps = {
  role: User["role"];
};

function RoleBadge({ role }: RoleBadgeProps) {
  const colors = {
    admin: "bg-blue-500/10 text-blue-400",
    editor: "bg-purple-500/10 text-purple-400",
    viewer: "bg-gray-500/10 text-gray-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[role]}`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer" as User["role"],
    status: "active" as User["status"],
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const result = await response.json();
      setUsers(result.data.users);
      setTotalUsers(result.data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }

      setShowCreateModal(false);
      setFormData({
        name: "",
        email: "",
        role: "viewer",
        status: "active",
      });
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const userColumns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "status", header: "Status" },
    { key: "joined", header: "Joined" },
    { key: "actions", header: "Actions" },
  ];

  const tableData = users.map((user) => ({
    name: user.name,
    email: user.email,
    role: <RoleBadge role={user.role} />,
    status: <StatusBadge status={user.status} />,
    joined: new Date(user.createdAt).toLocaleDateString(),
    actions: (
      <button
        onClick={() => handleDeleteUser(user.id)}
        className="text-sm text-red-400 hover:text-red-300"
      >
        Delete
      </button>
    ),
  }));

  const activeUsers = users.filter((u) => u.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="mt-2 text-slate-400">Manage and monitor user accounts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Users</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {totalUsers}
            </p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">Active Users</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {activeUsers}
            </p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Inactive Users
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {totalUsers - activeUsers}
            </p>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card title="All Users" subtitle="A list of all users in your account">
        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-400">Error: {error}</div>
        ) : (
          <Table
            columns={userColumns}
            data={tableData}
            emptyMessage="No users found"
          />
        )}
      </Card>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">
              Create New User
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as User["role"],
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as User["status"],
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

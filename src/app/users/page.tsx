import Card from "@/components/Card";
import Table from "@/components/Table";

// Dummy user data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: (
      <span className="inline-flex rounded-full bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-400">
        Admin
      </span>
    ),
    status: (
      <span className="inline-flex rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-400">
        Active
      </span>
    ),
    joined: "Jan 15, 2024",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: (
      <span className="inline-flex rounded-full bg-purple-500/10 px-2 py-1 text-xs font-semibold text-purple-400">
        Editor
      </span>
    ),
    status: (
      <span className="inline-flex rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-400">
        Active
      </span>
    ),
    joined: "Feb 03, 2024",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: (
      <span className="inline-flex rounded-full bg-gray-500/10 px-2 py-1 text-xs font-semibold text-gray-400">
        Viewer
      </span>
    ),
    status: (
      <span className="inline-flex rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-400">
        Active
      </span>
    ),
    joined: "Mar 12, 2024",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: (
      <span className="inline-flex rounded-full bg-purple-500/10 px-2 py-1 text-xs font-semibold text-purple-400">
        Editor
      </span>
    ),
    status: (
      <span className="inline-flex rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-semibold text-yellow-400">
        Pending
      </span>
    ),
    joined: "Apr 18, 2024",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: (
      <span className="inline-flex rounded-full bg-gray-500/10 px-2 py-1 text-xs font-semibold text-gray-400">
        Viewer
      </span>
    ),
    status: (
      <span className="inline-flex rounded-full bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-400">
        Inactive
      </span>
    ),
    joined: "May 22, 2024",
  },
];

const userColumns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  { key: "status", header: "Status" },
  { key: "joined", header: "Joined" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="mt-2 text-slate-400">
            Manage and monitor user accounts
          </p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Users</p>
            <p className="mt-2 text-3xl font-semibold text-white">12,543</p>
            <p className="mt-2 text-sm text-green-400">↑ 245 this month</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">Active Users</p>
            <p className="mt-2 text-3xl font-semibold text-white">8,234</p>
            <p className="mt-2 text-sm text-green-400">↑ 12.5% vs last month</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">New This Week</p>
            <p className="mt-2 text-3xl font-semibold text-white">127</p>
            <p className="mt-2 text-sm text-blue-400">18 per day average</p>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card
        title="All Users"
        subtitle="A list of all users in your account"
        actions={
          <input
            type="search"
            placeholder="Search users..."
            className="rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-1.5 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        }
      >
        <Table columns={userColumns} data={users} emptyMessage="No users found" />
      </Card>
    </div>
  );
}

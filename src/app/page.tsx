import Card from "@/components/Card";
import Table from "@/components/Table";

// Dummy data for overview page
const stats = [
  { label: "Total Users", value: "12,543", change: "+12.5%", trend: "up" },
  { label: "Revenue", value: "$45,231", change: "+8.2%", trend: "up" },
  { label: "Active Sessions", value: "2,345", change: "-3.1%", trend: "down" },
  { label: "Conversion Rate", value: "3.24%", change: "+0.5%", trend: "up" },
];

const recentActivities = [
  {
    user: "John Doe",
    action: "Created new account",
    timestamp: "2 minutes ago",
    status: "✅",
  },
  {
    user: "Jane Smith",
    action: "Updated profile",
    timestamp: "15 minutes ago",
    status: "✅",
  },
  {
    user: "Bob Johnson",
    action: "Deleted item",
    timestamp: "1 hour ago",
    status: "⚠️",
  },
  {
    user: "Alice Williams",
    action: "Logged in",
    timestamp: "2 hours ago",
    status: "✅",
  },
  {
    user: "Charlie Brown",
    action: "Failed login attempt",
    timestamp: "3 hours ago",
    status: "❌",
  },
];

const activityColumns = [
  { key: "status", header: "Status", width: "w-16" },
  { key: "user", header: "User" },
  { key: "action", header: "Action" },
  { key: "timestamp", header: "Time" },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="mt-2 text-slate-400">
          Welcome back! Here&apos;s what&apos;s happening with your application today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div>
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-semibold text-white">
                  {stat.value}
                </p>
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Revenue Overview" subtitle="Last 30 days">
          <div className="flex h-64 items-end justify-around gap-2">
            {[65, 45, 75, 55, 85, 70, 90, 60, 80, 95, 70, 85].map(
              (height, i) => (
                <div
                  key={i}
                  className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-400"
                  style={{ height: `${height}%` }}
                ></div>
              )
            )}
          </div>
          <div className="mt-4 flex justify-around text-xs text-slate-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </Card>

        <Card title="User Growth" subtitle="Monthly active users">
          <div className="flex h-64 items-end justify-around gap-2">
            {[40, 55, 50, 70, 65, 80, 75, 90, 85, 95, 92, 100].map(
              (height, i) => (
                <div
                  key={i}
                  className="w-full rounded-t bg-green-500 transition-all hover:bg-green-400"
                  style={{ height: `${height}%` }}
                ></div>
              )
            )}
          </div>
          <div className="mt-4 flex justify-around text-xs text-slate-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card title="Recent Activity" subtitle="Latest user actions">
        <Table
          columns={activityColumns}
          data={recentActivities}
          emptyMessage="No recent activity"
        />
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Table from "@/components/Table";
import type { ActivityLog } from "@/lib/types";

export default function ActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/activity-logs?limit=50");
      if (!response.ok) throw new Error("Failed to fetch activity logs");
      const result = await response.json();
      setLogs(result.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      created: "bg-green-500/10 text-green-400",
      updated: "bg-blue-500/10 text-blue-400",
      deleted: "bg-red-500/10 text-red-400",
      added: "bg-purple-500/10 text-purple-400",
      removed: "bg-orange-500/10 text-orange-400",
    };

    const type = action.split(".")[1] || "default";
    const color = colors[type] || "bg-gray-500/10 text-gray-400";

    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${color}`}>
        {action}
      </span>
    );
  };

  const activityColumns = [
    { key: "action", header: "Action" },
    { key: "user", header: "User" },
    { key: "entity", header: "Entity" },
    { key: "organization", header: "Organization" },
    { key: "time", header: "Time" },
  ];

  const tableData = logs.map((log) => ({
    action: getActionBadge(log.action),
    user: log.user?.name || "System",
    entity: `${log.entityType} (${log.entityId.substring(0, 8)}...)`,
    organization: log.organization?.name || "-",
    time: new Date(log.createdAt).toLocaleString(),
  }));

  const stats = {
    total: logs.length,
    last24h: logs.filter(
      (log) => new Date(log.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length,
    byAction: logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Activity Logs</h1>
        <p className="mt-2 text-slate-400">
          Audit trail of all system activities
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Events</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.total}
            </p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">Last 24 Hours</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.last24h}
            </p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">Most Common</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {(Object.entries(stats.byAction).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] as string)?.split(".")[1] || "-"}
            </p>
          </div>
        </Card>
      </div>

      <Card title="Recent Activity" subtitle="Last 50 events">
        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-400">Error: {error}</div>
        ) : (
          <Table
            columns={activityColumns}
            data={tableData}
            emptyMessage="No activity logs found"
          />
        )}
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Table from "@/components/Table";
import type { Organization } from "@/lib/types";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/organizations");
      if (!response.ok) throw new Error("Failed to fetch organizations");
      const result = await response.json();
      setOrganizations(result.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: "bg-gray-500/10 text-gray-400",
      pro: "bg-blue-500/10 text-blue-400",
      enterprise: "bg-purple-500/10 text-purple-400",
    };
    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[plan as keyof typeof colors]}`}
      >
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-500/10 text-green-400",
      suspended: "bg-yellow-500/10 text-yellow-400",
      archived: "bg-red-500/10 text-red-400",
    };
    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[status as keyof typeof colors]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const organizationColumns = [
    { key: "name", header: "Name" },
    { key: "slug", header: "Slug" },
    { key: "plan", header: "Plan" },
    { key: "status", header: "Status" },
    { key: "created", header: "Created" },
  ];

  const tableData = organizations.map((org) => ({
    name: org.name,
    slug: org.slug,
    plan: getPlanBadge(org.plan),
    status: getStatusBadge(org.status),
    created: new Date(org.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Organizations</h1>
          <p className="mt-2 text-slate-400">
            Manage multi-tenant organizations
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Total Organizations
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {organizations.length}
            </p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Enterprise Plans
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {organizations.filter((o) => o.plan === "enterprise").length}
            </p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm font-medium text-slate-400">Active</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {organizations.filter((o) => o.status === "active").length}
            </p>
          </div>
        </Card>
      </div>

      <Card title="All Organizations" subtitle="Multi-tenant workspace management">
        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-400">Error: {error}</div>
        ) : (
          <Table
            columns={organizationColumns}
            data={tableData}
            emptyMessage="No organizations found"
          />
        )}
      </Card>
    </div>
  );
}

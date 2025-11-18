import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Phase 3 seed...");

  // Clear existing data in correct order (respecting foreign keys)
  await prisma.activityLog.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  console.log("🗑️  Cleared existing data");

  // Create Organizations
  const orgs = await Promise.all([
    prisma.organization.create({
      data: {
        name: "Acme Corporation",
        slug: "acme-corp",
        description: "Leading provider of innovative solutions",
        plan: "enterprise",
        status: "active",
        settings: {
          features: ["advanced-analytics", "custom-branding", "sso"],
          limits: { users: 1000, teams: 50 },
        },
      },
    }),
    prisma.organization.create({
      data: {
        name: "TechStart Inc",
        slug: "techstart",
        description: "Startup focused on cutting-edge technology",
        plan: "pro",
        status: "active",
        settings: {
          features: ["analytics", "api-access"],
          limits: { users: 100, teams: 10 },
        },
      },
    }),
    prisma.organization.create({
      data: {
        name: "Community Hub",
        slug: "community-hub",
        description: "Open community platform for collaboration",
        plan: "free",
        status: "active",
        settings: {
          features: ["basic"],
          limits: { users: 25, teams: 3 },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${orgs.length} organizations`);

  // Create Users with organization assignments
  const users = await Promise.all([
    // Acme Corp users
    prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@acme.com",
        role: "admin",
        status: "active",
        organizationId: orgs[0].id,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Jane Smith",
        email: "jane.smith@acme.com",
        role: "editor",
        status: "active",
        organizationId: orgs[0].id,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Johnson",
        email: "bob.johnson@acme.com",
        role: "viewer",
        status: "active",
        organizationId: orgs[0].id,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    }),
    // TechStart users
    prisma.user.create({
      data: {
        name: "Alice Williams",
        email: "alice@techstart.io",
        role: "admin",
        status: "active",
        organizationId: orgs[1].id,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Charlie Brown",
        email: "charlie@techstart.io",
        role: "editor",
        status: "active",
        organizationId: orgs[1].id,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
      },
    }),
    // Community Hub users
    prisma.user.create({
      data: {
        name: "Diana Prince",
        email: "diana@community.org",
        role: "admin",
        status: "active",
        organizationId: orgs[2].id,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
        lastLoginAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    }),
    prisma.user.create({
      data: {
        name: "Ethan Hunt",
        email: "ethan@community.org",
        role: "editor",
        status: "pending",
        organizationId: orgs[2].id,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
      },
    }),
    // Independent user (no organization)
    prisma.user.create({
      data: {
        name: "Fiona Gallagher",
        email: "fiona@independent.com",
        role: "viewer",
        status: "active",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create User Preferences
  await Promise.all(
    users.map((user, index) =>
      prisma.userPreferences.create({
        data: {
          userId: user.id,
          theme: index % 3 === 0 ? "dark" : index % 3 === 1 ? "light" : "auto",
          language: index % 2 === 0 ? "en" : "ja",
          timezone: index % 2 === 0 ? "America/New_York" : "Asia/Tokyo",
          emailNotifications: index % 2 === 0,
          pushNotifications: index % 3 === 0,
          weeklyDigest: true,
          dashboardLayout: { widgets: ["stats", "activity", "charts"] },
        },
      })
    )
  );

  console.log(`✅ Created ${users.length} user preferences`);

  // Create Teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "Engineering",
        description: "Product development and engineering team",
        organizationId: orgs[0].id,
      },
    }),
    prisma.team.create({
      data: {
        name: "Marketing",
        description: "Marketing and growth team",
        organizationId: orgs[0].id,
      },
    }),
    prisma.team.create({
      data: {
        name: "Core Team",
        description: "Core product team",
        organizationId: orgs[1].id,
      },
    }),
    prisma.team.create({
      data: {
        name: "Moderators",
        description: "Community moderation team",
        organizationId: orgs[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${teams.length} teams`);

  // Add team members
  await Promise.all([
    // Acme Engineering team
    prisma.teamMember.create({
      data: {
        teamId: teams[0].id,
        userId: users[0].id,
        role: "owner",
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: teams[0].id,
        userId: users[1].id,
        role: "admin",
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: teams[0].id,
        userId: users[2].id,
        role: "member",
      },
    }),
    // Acme Marketing team
    prisma.teamMember.create({
      data: {
        teamId: teams[1].id,
        userId: users[0].id,
        role: "owner",
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: teams[1].id,
        userId: users[1].id,
        role: "member",
      },
    }),
    // TechStart Core Team
    prisma.teamMember.create({
      data: {
        teamId: teams[2].id,
        userId: users[3].id,
        role: "owner",
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: teams[2].id,
        userId: users[4].id,
        role: "member",
      },
    }),
    // Community Moderators
    prisma.teamMember.create({
      data: {
        teamId: teams[3].id,
        userId: users[5].id,
        role: "owner",
      },
    }),
  ]);

  console.log("✅ Created team memberships");

  // Create Activity Logs (simulating recent activity)
  const now = Date.now();
  const activityLogs = [];

  // Organization created logs
  for (let i = 0; i < orgs.length; i++) {
    activityLogs.push(
      prisma.activityLog.create({
        data: {
          action: "organization.created",
          entityType: "organization",
          entityId: orgs[i].id,
          organizationId: orgs[i].id,
          userId: users[i * 2]?.id,
          metadata: { name: orgs[i].name, plan: orgs[i].plan },
          createdAt: new Date(now - (30 - i) * 24 * 60 * 60 * 1000),
        },
      })
    );
  }

  // User created logs
  for (let i = 0; i < users.length; i++) {
    activityLogs.push(
      prisma.activityLog.create({
        data: {
          action: "user.created",
          entityType: "user",
          entityId: users[i].id,
          organizationId: users[i].organizationId,
          userId: users[i].id,
          metadata: { email: users[i].email, role: users[i].role },
          createdAt: new Date(now - (25 - i * 2) * 24 * 60 * 60 * 1000),
        },
      })
    );
  }

  // Team created logs
  for (let i = 0; i < teams.length; i++) {
    activityLogs.push(
      prisma.activityLog.create({
        data: {
          action: "team.created",
          entityType: "team",
          entityId: teams[i].id,
          organizationId: teams[i].organizationId,
          userId: users[i * 2]?.id,
          metadata: { name: teams[i].name },
          createdAt: new Date(now - (20 - i) * 24 * 60 * 60 * 1000),
        },
      })
    );
  }

  // Recent user updates
  activityLogs.push(
    prisma.activityLog.create({
      data: {
        action: "user.updated",
        entityType: "user",
        entityId: users[0].id,
        organizationId: users[0].organizationId,
        userId: users[0].id,
        metadata: { changes: { name: "John Doe", lastLoginAt: new Date() } },
        createdAt: new Date(now - 2 * 60 * 60 * 1000),
      },
    })
  );

  // Preferences updates
  activityLogs.push(
    prisma.activityLog.create({
      data: {
        action: "preferences.updated",
        entityType: "user_preferences",
        entityId: users[1].id,
        organizationId: users[1].organizationId,
        userId: users[1].id,
        metadata: { changes: { theme: "dark" } },
        createdAt: new Date(now - 5 * 60 * 60 * 1000),
      },
    })
  );

  await Promise.all(activityLogs);

  console.log(`✅ Created ${activityLogs.length} activity logs`);

  // Print summary
  console.log("\n📊 Seed Summary:");
  console.log("================");
  console.log(`Organizations: ${orgs.length}`);
  console.log(`  - ${orgs[0].name} (${orgs[0].plan})`);
  console.log(`  - ${orgs[1].name} (${orgs[1].plan})`);
  console.log(`  - ${orgs[2].name} (${orgs[2].plan})`);
  console.log(`\nUsers: ${users.length}`);
  console.log(`  - ${users.filter((u) => u.role === "admin").length} admins`);
  console.log(`  - ${users.filter((u) => u.role === "editor").length} editors`);
  console.log(`  - ${users.filter((u) => u.role === "viewer").length} viewers`);
  console.log(`\nTeams: ${teams.length}`);
  console.log(`Activity Logs: ${activityLogs.length}`);
  console.log("\n🎉 Phase 3 seed completed successfully!");
  console.log("\n💡 You can now explore:");
  console.log("   - Organizations at /organizations");
  console.log("   - Users at /users");
  console.log("   - Activity logs at /activity");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

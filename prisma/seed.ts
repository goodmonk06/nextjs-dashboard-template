import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "editor",
    status: "active",
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "viewer",
    status: "active",
  },
  {
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "editor",
    status: "pending",
  },
  {
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "viewer",
    status: "inactive",
  },
  {
    name: "Diana Prince",
    email: "diana.prince@example.com",
    role: "admin",
    status: "active",
  },
  {
    name: "Ethan Hunt",
    email: "ethan.hunt@example.com",
    role: "editor",
    status: "active",
  },
  {
    name: "Fiona Gallagher",
    email: "fiona.gallagher@example.com",
    role: "viewer",
    status: "active",
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.user.deleteMany();
  console.log("🗑️  Cleared existing users");

  // Create users
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log(`✅ Created ${users.length} users`);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

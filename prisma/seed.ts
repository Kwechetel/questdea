import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hash password for admin user
  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@lastte.com" },
    update: {},
    create: {
      email: "admin@lastte.com",
      name: "Admin User",
      passwordHash: passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Created admin user:", admin.email);
  console.log("🔑 Password: ChangeMe123!");
  console.log("✨ Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


/**
 * Bootstrap script — creates the admin user on a fresh production DB.
 * Run once on the server:
 *   npx tsx server/bootstrap-admin.ts
 */

import { storage } from "../lib/storage";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "vinayak@isaitoday.com";
const ADMIN_PASSWORD = "testpass123";

async function bootstrap() {
  const existing = await storage.getUserByEmail(ADMIN_EMAIL);
  if (existing) {
    console.log(`Admin already exists: ${existing.email} (id: ${existing.id})`);
    if (existing.role !== "admin") {
      console.log("Role is not admin — please update manually:");
      console.log(
        `  UPDATE users SET role='admin' WHERE email='${ADMIN_EMAIL}';`
      );
    } else {
      console.log("Role: admin ✓");
    }
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const id = randomUUID();

  const user = await storage.createUser({
    id,
    email: ADMIN_EMAIL,
    firstName: "Vinayak",
    lastName: "",
    profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=vinayak`,
    passwordHash,
    role: "admin",
  });

  console.log(`✓ Admin user created`);
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`  Role:     admin`);
  console.log(`  ID:       ${user.id}`);
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});

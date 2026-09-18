import "dotenv/config";
import { db, usersTable } from "../db/src/index.js";
import { hashPassword } from "../src/lib/auth.js";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "AdminSecurePass123!";
  const passwordHash = await hashPassword(password);

  try {
    await db.insert(usersTable).values({
      email,
      passwordHash,
      role: "admin",
      firstName: "System",
      lastName: "Administrator",
      isEmailVerified: true
    });
    console.log(`Admin account created successfully for: ${email}`);
  } catch (err) {
    console.error("Failed to create admin account (it might already exist):", err);
  }
}

createAdmin().then(() => process.exit(0));

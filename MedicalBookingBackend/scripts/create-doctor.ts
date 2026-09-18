import "dotenv/config";
import { db, usersTable, doctorsTable } from "../db/src/index.js";
import { hashPassword } from "../src/lib/auth.js";

async function createDoctor() {
  const firstName = process.env.DOCTOR_FIRST_NAME || "Sample";
  const lastName = process.env.DOCTOR_LAST_NAME || "Doctor";
  const email = process.env.DOCTOR_EMAIL || "doctor@example.com";
  const password = process.env.DOCTOR_PASSWORD || "DoctorSecurePass123!";
  const phone = process.env.DOCTOR_PHONE || "+1234567890";
  const specialty = ["General Practice", "Family Medicine"];
  const type = "therapist" as const;
  const gender = "male" as const;
  const price = 100;
  const bio = "Licensed healthcare professional available for general consultations and routine care.";
  const yearsExperience = 8;
  const languages = ["English", "Arabic"];
  const sessionType = "individual" as const;
  const paymentInfo = "Standard Electronic Transfer";

  const passwordHash = await hashPassword(password);

  try {
    const [user] = await db.insert(usersTable).values({
      firstName,
      lastName,
      email,
      passwordHash,
      phone,
      role: "doctor",
      isEmailVerified: true,
      preferredLang: "en",
    }).returning();

    await db.insert(doctorsTable).values({
      userId: user.id,
      specialty,
      type,
      gender,
      price,
      bio,
      yearsExperience,
      languages,
      sessionType,
      paymentInfo,
      isOnline: true,
      freeConsultation: false,
      rating: 5,
      reviewCount: 0,
      isApproved: true,
    });

    console.log(`Doctor created successfully: ${email}`);
  } catch (error) {
    console.error("Error creating doctor:", error);
  }
}

createDoctor().then(() => process.exit(0));

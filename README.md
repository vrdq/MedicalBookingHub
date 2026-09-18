# MedicalBookingHub

Full-stack medical appointment scheduling and telemedicine platform built with React 19, Node.js/Express, Drizzle ORM, and PostgreSQL. Features dual-language localization (Arabic/English with RTL support), role-based access control (Patients, Doctors, Administrators), strict double-booking concurrency prevention, consultation messaging, and multi-provider transactional email.

## Architecture

- **Frontend (`MedicalBookingFrontend`)**: React 19 SPA built with Vite and styled with Tailwind CSS v4 and Radix UI primitives. Uses TanStack React Query for server state caching and optimistic UI updates, Wouter for lightweight routing, and React Hook Form + Zod for runtime schema validation.
- **Backend (`MedicalBookingBackend`)**: RESTful API server powered by Express 5 and Node.js. Uses Drizzle ORM for type-safe database queries against PostgreSQL, bundled with Esbuild for minimal cold-start overhead.
- **Role-Based Access Control (RBAC)**: Distinct authorization boundaries and dedicated workflows for Patients, Healthcare Providers (Doctors/Therapists), and System Administrators.
- **Slot Scheduling Engine**: Configurable doctor availability and instant session routing with atomic transaction locks to eliminate race conditions and double-booking.
- **Consultation and Messaging**: Secure consultation channel with base64/multipart medical receipt and document uploads (2MB sanitized payload limit).
- **Transactional Email Subsystem**: Dynamic multi-provider email dispatcher supporting Resend, Brevo API, and direct SMTP transport for verification tokens and 6-digit password reset codes.
- **Localization**: Native bilingual interface (English and Arabic) with automatic RTL (Right-to-Left) layout transitions and localized medical taxonomy.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Radix UI, TanStack Query, Framer Motion, Lucide Icons, Wouter
- **Backend**: Node.js, Express 5, TypeScript, Drizzle ORM, PostgreSQL (`postgres.js`), Zod, Esbuild, Pino
- **Security and Auth**: JWT (JSON Web Tokens), bcryptjs password hashing, Helmet HTTP security headers, CORS origin enforcement, Multer file upload filtering
- **Integrations**: Resend API, Brevo API, SMTP

## Repository Structure

```
MedicalBookingHub/
├── MedicalBookingFrontend/    # React 19 + Vite frontend application
│   ├── src/                  # Components, pages, hooks, localization
│   ├── api-client-react/     # Type-safe API client layer
│   └── vite.config.ts
├── MedicalBookingBackend/     # Express 5 API backend
│   ├── src/                  # Routes, controllers, middlewares, services
│   ├── db/                   # Drizzle schema definitions and migrations
│   ├── zod/                  # Shared Zod validation schemas
│   ├── scripts/              # Database seeding and administrative tools
│   └── build.mjs             # Esbuild production bundler
└── tsconfig.base.json        # Shared TypeScript compiler configuration
```

## Quick Start

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 15+

### 2. Backend Setup

```bash
cd MedicalBookingBackend
npm install

# Configure environment
# DATABASE_URL=postgresql://user:password@localhost:5432/medical_booking
# JWT_SECRET=your-secure-random-jwt-secret
# PORT=5000

# Push database schema
npm run push

# (Optional) Seed admin and doctor accounts
npx tsx scripts/create-admin.ts
npx tsx scripts/create-doctor.ts

# Build and run
npm run build
npm start
```

### 3. Frontend Setup

```bash
cd MedicalBookingFrontend
npm install

# Build production assets
npm run build

# Launch Vite development server
npx vite
```

## License

MIT

-- Manual migration SQL for WhatsApp Contacts table
-- Run this in your Neon database SQL editor if Prisma migrate fails

CREATE TABLE IF NOT EXISTS "whatsapp_contacts" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_contacts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "whatsapp_contacts_phoneNumber_key" ON "whatsapp_contacts"("phoneNumber");

CREATE INDEX IF NOT EXISTS "whatsapp_contacts_phoneNumber_idx" ON "whatsapp_contacts"("phoneNumber");


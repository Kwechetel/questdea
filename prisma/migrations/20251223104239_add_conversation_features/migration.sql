-- AlterTable
ALTER TABLE "whatsapp_contacts" ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastReadAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "whatsapp_contacts_isPinned_idx" ON "whatsapp_contacts"("isPinned");

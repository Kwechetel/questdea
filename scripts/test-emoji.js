/**
 * Test script to verify emoji handling in the database
 * Run: node scripts/test-emoji.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testEmoji() {
  try {
    console.log("🧪 Testing Emoji Support...\n");

    // Test 1: Check if we can save emojis
    console.log("1. Testing emoji save to database...");
    const testMessage = {
      messageId: `test_emoji_${Date.now()}`,
      from: "+1234567890",
      to: "+0987654321",
      text: "Hello 😊👍🎉 Test emoji: 🚀💻⭐",
      type: "TEXT",
      direction: "INCOMING",
      timestamp: new Date(),
    };

    const saved = await prisma.whatsAppMessage.create({
      data: testMessage,
    });

    console.log("✅ Message saved with ID:", saved.id);
    console.log("📝 Saved text:", saved.text);

    // Test 2: Check if we can retrieve emojis
    console.log("\n2. Testing emoji retrieval from database...");
    const retrieved = await prisma.whatsAppMessage.findUnique({
      where: { id: saved.id },
    });

    if (retrieved) {
      console.log("✅ Message retrieved");
      console.log("📝 Retrieved text:", retrieved.text);
      
      // Check if emojis are preserved
      const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
      const hasEmojis = emojiRegex.test(retrieved.text || "");
      
      if (hasEmojis) {
        console.log("✅ Emojis are preserved in database!");
      } else {
        console.log("❌ Emojis were lost during save/retrieve");
      }
    }

    // Test 3: Check database encoding
    console.log("\n3. Checking database encoding...");
    const encodingResult = await prisma.$queryRaw`
      SELECT datname, pg_encoding_to_char(encoding) as encoding
      FROM pg_database
      WHERE datname = current_database()
    `;
    
    console.log("Database encoding:", encodingResult);
    if (encodingResult && encodingResult[0]?.encoding === "UTF8") {
      console.log("✅ Database uses UTF-8 encoding");
    } else {
      console.log("⚠️ Database encoding:", encodingResult[0]?.encoding);
    }

    // Cleanup
    console.log("\n4. Cleaning up test message...");
    await prisma.whatsAppMessage.delete({
      where: { id: saved.id },
    });
    console.log("✅ Test message deleted");

    console.log("\n✅ Emoji test completed!");
  } catch (error) {
    console.error("❌ Error testing emojis:", error);
    if (error.code === "P1001") {
      console.error("Database connection error. Make sure your database is running.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

testEmoji();


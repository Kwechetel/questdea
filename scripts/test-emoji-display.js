/**
 * Test script to check if emojis are in the database and can be retrieved
 * Run: node scripts/test-emoji-display.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testEmojiDisplay() {
  try {
    console.log("🧪 Testing Emoji Display in Messages...\n");

    // Get the most recent messages
    const messages = await prisma.whatsAppMessage.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
    });

    console.log(`Found ${messages.length} recent messages\n`);

    messages.forEach((msg, index) => {
      console.log(`Message ${index + 1}:`);
      console.log(`  ID: ${msg.id}`);
      console.log(`  From: ${msg.from}`);
      console.log(`  Text: ${msg.text || "(no text)"}`);
      if (msg.text) {
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
        const hasEmojis = emojiRegex.test(msg.text);
        if (hasEmojis) {
          const emojis = msg.text.match(emojiRegex);
          console.log(`  ✅ Contains emojis: ${emojis?.join(", ")}`);
        } else {
          console.log(`  ❌ No emojis found`);
        }
        console.log(`  Text length: ${msg.text.length}`);
        console.log(`  Text bytes: ${Buffer.from(msg.text, 'utf8').length}`);
      }
      console.log("");
    });

    console.log("✅ Test completed!");
  } catch (error) {
    console.error("❌ Error:", error);
    if (error.code === "P1001") {
      console.error("Database connection error. Make sure your database is running.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

testEmojiDisplay();


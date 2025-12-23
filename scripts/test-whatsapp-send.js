/**
 * Test sending a WhatsApp message
 * Run with: npm run test:whatsapp-send
 * 
 * Requires Node.js 18+ (for fetch API)
 * Or install node-fetch: npm install node-fetch
 */

require('dotenv').config({ path: '.env.local' });

// Use node-fetch if available, otherwise use global fetch (Node 18+)
let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  // Use global fetch (Node 18+)
  if (typeof globalThis.fetch === 'undefined') {
    console.error('❌ fetch is not available. Please use Node.js 18+ or install node-fetch: npm install node-fetch');
    process.exit(1);
  }
  fetch = globalThis.fetch;
}

const adminPhone = process.env.WHATSAPP_ADMIN_PHONE;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

console.log('🧪 Testing WhatsApp Message Sending...\n');

if (!adminPhone) {
  console.error('❌ WHATSAPP_ADMIN_PHONE is not set in .env.local');
  console.log('\n💡 Add this to your .env.local file:');
  console.log('WHATSAPP_ADMIN_PHONE=+1234567890\n');
  process.exit(1);
}

if (!phoneNumberId || !accessToken) {
  console.error('❌ WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN is not set');
  process.exit(1);
}

console.log(`📱 Sending test message to: ${adminPhone}\n`);

// Format test lead notification
function formatLeadNotification(lead) {
  let message = `🆕 *New Lead Received*\n\n`;
  message += `*Name:* ${lead.name}\n`;
  message += `*Email:* ${lead.email}\n`;
  if (lead.phone) message += `*Phone:* ${lead.phone}\n`;
  if (lead.business) message += `*Business:* ${lead.business}\n`;
  if (lead.message) {
    const truncated = lead.message.length > 200 ? lead.message.substring(0, 200) + '...' : lead.message;
    message += `\n*Message:*\n${truncated}`;
  }
  message += `\n\nView in dashboard: ${process.env.NEXTAUTH_URL || 'https://lastte.vercel.app'}/admin/leads`;
  return message;
}

// Test lead data
const testLead = {
  name: 'Test Lead',
  email: 'test@example.com',
  phone: '+1234567890',
  business: 'Test Company',
  message: 'This is a test notification from LASTTE.',
};

const message = formatLeadNotification(testLead);

console.log('📝 Message content:');
console.log('─'.repeat(50));
console.log(message);
console.log('─'.repeat(50));
console.log('');

// Clean and validate token
let cleanToken = accessToken.trim();
if ((cleanToken.startsWith('"') && cleanToken.endsWith('"')) ||
    (cleanToken.startsWith("'") && cleanToken.endsWith("'"))) {
  cleanToken = cleanToken.slice(1, -1);
}
cleanToken = cleanToken.trim();

// Format phone number
const formattedPhone = adminPhone.replace(/[^\d+]/g, '');
const toPhone = formattedPhone.startsWith('+') ? formattedPhone : `+${formattedPhone}`;

console.log('🔗 Sending via WhatsApp API...\n');

// Send message via WhatsApp API
fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${cleanToken}`,
  },
  body: JSON.stringify({
    to: toPhone,
    type: 'text',
    messaging_product: 'whatsapp',
    text: {
      body: message,
    },
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.error) {
      console.error('❌ Failed to send message:');
      console.error(`   Error: ${data.error.message}`);
      console.error(`   Code: ${data.error.code}`);
      if (data.error.code === 190) {
        console.log('\n💡 Token has EXPIRED or is INVALID.');
        console.log('   Error details:', data.error.message);
        if (data.error.message.includes('expired')) {
          const match = data.error.message.match(/expired on (.+?)\./);
          if (match) {
            console.log('   Expired at:', match[1]);
          }
        }
        console.log('\n📋 Action Required:');
        console.log('   1. Go to: https://developers.facebook.com/');
        console.log('   2. My Apps → Your App → WhatsApp → API Setup');
        console.log('   3. Generate NEW token');
        console.log('   4. Update WHATSAPP_ACCESS_TOKEN in .env.local');
        console.log('   5. Restart dev server (if running)');
        console.log('   6. Run this test again');
        console.log('\n📖 See WHATSAPP_TOKEN_QUICK_FIX.md for detailed steps');
      }
      if (data.error.code === 100) {
        console.log('\n💡 Check your phone number format. It should include country code (e.g., +263773599291).');
      }
      process.exit(1);
    } else {
      console.log('✅ Message sent successfully!');
      console.log(`   Message ID: ${data.messages?.[0]?.id || 'N/A'}`);
      console.log('\n📱 Check your WhatsApp for the notification.\n');
    }
  })
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });

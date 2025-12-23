/**
 * Check WhatsApp Token Status
 * Run with: node scripts/check-token.js
 */

require('dotenv').config({ path: '.env.local' });

const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

console.log('🔍 Checking WhatsApp Token Status...\n');

if (!accessToken) {
  console.error('❌ WHATSAPP_ACCESS_TOKEN is NOT SET in .env.local');
  console.log('\n💡 Add this line to your .env.local file:');
  console.log('WHATSAPP_ACCESS_TOKEN=your_token_here\n');
  process.exit(1);
}

console.log('✅ Token found in .env.local');
console.log(`   Length: ${accessToken.length} characters`);
console.log(`   Preview: ${accessToken.substring(0, 20)}...${accessToken.substring(accessToken.length - 10)}`);
console.log(`   Starts with: ${accessToken.substring(0, 3)}`);

if (!phoneNumberId) {
  console.error('\n❌ WHATSAPP_PHONE_NUMBER_ID is NOT SET');
  process.exit(1);
}

console.log(`   Phone Number ID: ${phoneNumberId}\n`);

// Test token validity
const fetch = require('node-fetch').default || globalThis.fetch;

console.log('🔗 Testing token validity...\n');

fetch(`https://graph.facebook.com/v21.0/me?access_token=${accessToken}`)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error('❌ Token is INVALID or EXPIRED');
      console.error(`   Error: ${data.error.message}`);
      console.error(`   Code: ${data.error.code}`);
      
      if (data.error.code === 190) {
        if (data.error.message.includes('expired')) {
          const match = data.error.message.match(/expired on (.+?)\./);
          if (match) {
            console.error(`   Expired at: ${match[1]}`);
          }
        }
        console.log('\n📋 You need to generate a NEW token:');
        console.log('   1. Go to: https://developers.facebook.com/');
        console.log('   2. My Apps → Your App → WhatsApp → API Setup');
        console.log('   3. Click "Generate Token"');
        console.log('   4. Copy the new token');
        console.log('   5. Update WHATSAPP_ACCESS_TOKEN in .env.local');
        console.log('   6. Save the file');
        console.log('   7. Run this check again\n');
      }
      process.exit(1);
    } else {
      console.log('✅ Token is VALID!');
      console.log(`   App ID: ${data.id}`);
      console.log(`   App Name: ${data.name || 'N/A'}\n`);
      console.log('🎉 Your token is working correctly!\n');
    }
  })
  .catch(error => {
    console.error('❌ Network error:', error.message);
    process.exit(1);
  });


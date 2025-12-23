/**
 * Test WhatsApp Access Token
 * Run with: npm run test:whatsapp
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

const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

console.log('🔍 Testing WhatsApp Configuration...\n');

// Check if token exists
if (!accessToken) {
  console.error('❌ WHATSAPP_ACCESS_TOKEN is not set in .env.local');
  console.log('\n💡 Add this to your .env.local file:');
  console.log('WHATSAPP_ACCESS_TOKEN=your_token_here\n');
  process.exit(1);
}

// Check if phone number ID exists
if (!phoneNumberId) {
  console.error('❌ WHATSAPP_PHONE_NUMBER_ID is not set in .env.local');
  console.log('\n💡 Add this to your .env.local file:');
  console.log('WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here\n');
  process.exit(1);
}

// Validate token format
if (accessToken.length < 50) {
  console.error('❌ Token appears to be too short. Expected 200+ characters.');
  console.log(`   Current length: ${accessToken.length}`);
  process.exit(1);
}

if (!accessToken.startsWith('EAA')) {
  console.warn('⚠️  Token does not start with "EAA" - this might be unusual');
  console.log(`   Token starts with: ${accessToken.substring(0, 10)}...`);
}

console.log('✅ Token found in environment');
console.log(`   Token length: ${accessToken.length} characters`);
console.log(`   Token preview: ${accessToken.substring(0, 20)}...`);
console.log(`   Phone Number ID: ${phoneNumberId}\n`);

// Test token with Facebook Graph API
console.log('🔗 Testing token with Facebook Graph API...\n');

fetch(`https://graph.facebook.com/v21.0/me?access_token=${accessToken}`)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error('❌ Token validation failed:');
      console.error(`   Error: ${data.error.message}`);
      console.error(`   Code: ${data.error.code}`);
      
      if (data.error.code === 190) {
        console.log('\n💡 This usually means:');
        console.log('   1. Token has expired (temporary tokens last 24 hours)');
        console.log('   2. Token is incorrectly formatted');
        console.log('   3. Token doesn\'t have required permissions');
        console.log('\n📖 See WHATSAPP_TOKEN_GUIDE.md for help');
      }
      process.exit(1);
    } else {
      console.log('✅ Token is valid!');
      console.log(`   App ID: ${data.id}`);
      console.log(`   App Name: ${data.name || 'N/A'}\n`);
      
      // Test WhatsApp API endpoint
      console.log('🔗 Testing WhatsApp API endpoint...\n');
      return fetch(
        `https://graph.facebook.com/v21.0/${phoneNumberId}?access_token=${accessToken}&fields=verified_name,display_phone_number`
      );
    }
  })
  .then(res => {
    if (!res) return;
    return res.json();
  })
  .then(data => {
    if (data && data.error) {
      console.error('❌ WhatsApp API test failed:');
      console.error(`   Error: ${data.error.message}`);
      console.error(`   Code: ${data.error.code}`);
      process.exit(1);
    } else if (data) {
      console.log('✅ WhatsApp API connection successful!');
      console.log(`   Verified Name: ${data.verified_name || 'N/A'}`);
      console.log(`   Display Phone: ${data.display_phone_number || 'N/A'}\n`);
      console.log('🎉 All tests passed! Your WhatsApp configuration is ready.\n');
    }
  })
  .catch(error => {
    console.error('❌ Network error:', error.message);
    process.exit(1);
  });


# WhatsApp Two-Way Chat Implementation Guide

## 🎯 Current Setup vs. Full Capabilities

### What You Have Now ✅
- **One-way notifications** - Sending messages to clients
- **Lead notifications** - Automatic alerts when leads are submitted
- **Text messages** - Simple notifications

### What You Can Add 🚀
- **Two-way chat** - Receive and respond to client messages
- **Webhooks** - Real-time message handling
- **Media messages** - Send/receive images, documents, videos
- **Interactive messages** - Buttons, lists, quick replies
- **Message status tracking** - See when messages are delivered/read
- **Chatbot integration** - Automated responses
- **Customer support** - Full conversation management

## 💬 Two-Way Chat Implementation

### How It Works

1. **Client sends message** → WhatsApp Cloud API receives it
2. **Webhook receives notification** → Your server processes it
3. **You respond** → Send message back to client
4. **24-hour window opens** → Can send free-form messages for 24 hours

### Architecture

```
Client WhatsApp → Meta Cloud API → Your Webhook → Your Server → Response → Client
```

## 📋 Implementation Steps

### Step 1: Set Up Webhooks

Webhooks allow WhatsApp to notify your server when messages arrive.

#### 1.1 Create Webhook Endpoint

Create a new API route: `pages/api/webhooks/whatsapp.ts`

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

// Verify webhook signature (security)
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return hash === signature;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle GET request (webhook verification)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Verify token matches your secret
    if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_TOKEN) {
      console.log("✅ Webhook verified");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Forbidden");
    }
  }

  // Handle POST request (incoming messages)
  if (req.method === "POST") {
    const signature = req.headers["x-hub-signature-256"] as string;
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    if (
      !verifySignature(
        body,
        signature.replace("sha256=", ""),
        process.env.WHATSAPP_APP_SECRET || ""
      )
    ) {
      return res.status(403).send("Invalid signature");
    }

    const data = req.body;

    // Handle different webhook types
    if (data.object === "whatsapp_business_account") {
      for (const entry of data.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === "messages") {
            await handleIncomingMessage(change.value);
          }
        }
      }
    }

    return res.status(200).send("OK");
  }

  return res.status(405).send("Method not allowed");
}

// Handle incoming messages
async function handleIncomingMessage(value: any) {
  if (value.messages) {
    for (const message of value.messages) {
      const from = message.from; // Client's phone number
      const text = message.text?.body || "";
      const messageId = message.id;

      console.log(`📨 New message from ${from}: ${text}`);

      // Process the message
      await processMessage(from, text, messageId);
    }
  }
}

// Process and respond to messages
async function processMessage(
  from: string,
  text: string,
  messageId: string
) {
  // Your business logic here
  // Examples:
  
  // 1. Simple auto-reply
  if (text.toLowerCase().includes("hello") || text.toLowerCase().includes("hi")) {
    await sendWhatsAppMessage(
      from,
      "Hello! Thanks for reaching out to LASTTE. How can we help you today?"
    );
  }

  // 2. Check order status
  if (text.toLowerCase().includes("status")) {
    // Query database, etc.
    await sendWhatsAppMessage(from, "Your order status is...");
  }

  // 3. Route to admin
  // Save to database for admin to respond
  await saveMessageToDatabase({
    from,
    text,
    messageId,
    timestamp: new Date(),
  });

  // Notify admin
  await notifyAdmin(`New message from ${from}: ${text}`);
}
```

#### 1.2 Add Environment Variables

Add to `.env.local`:

```env
# WhatsApp Webhook Configuration
WHATSAPP_WEBHOOK_TOKEN=your_secure_random_token_here
WHATSAPP_APP_SECRET=your_app_secret_from_meta
```

Generate a secure token:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Configure Webhook in Meta

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Select your app → **WhatsApp** → **Configuration**
3. Click **Edit** next to **Webhook**
4. Enter:
   - **Callback URL:** `https://yourdomain.com/api/webhooks/whatsapp`
   - **Verify Token:** (same as `WHATSAPP_WEBHOOK_TOKEN` in `.env.local`)
5. Click **Verify and Save**
6. Subscribe to webhook fields:
   - ✅ `messages`
   - ✅ `message_status` (optional - for delivery receipts)

### Step 3: Enhanced Message Handling

#### 3.1 Create Message Storage

Add to your Prisma schema:

```prisma
model WhatsAppMessage {
  id          String   @id @default(cuid())
  from        String   // Client phone number
  to          String   // Your business number
  messageId   String   @unique
  text        String?  @db.Text
  type        String   // text, image, document, etc.
  direction  String   // incoming, outgoing
  status      String?  // sent, delivered, read, failed
  timestamp   DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("whatsapp_messages")
}
```

#### 3.2 Create Admin Chat Interface

Create `pages/admin/whatsapp-chat.tsx` for admins to:
- View all conversations
- Respond to messages
- See message history
- Manage multiple clients

## 🎨 Advanced Features

### 1. Interactive Messages (Buttons)

```typescript
const messageData = {
  messaging_product: "whatsapp",
  to: phoneNumber,
  type: "interactive",
  interactive: {
    type: "button",
    body: {
      text: "How can we help you?"
    },
    action: {
      buttons: [
        {
          type: "reply",
          reply: {
            id: "btn_1",
            title: "Get Quote"
          }
        },
        {
          type: "reply",
          reply: {
            id: "btn_2",
            title: "Track Order"
          }
        }
      ]
    }
  }
};
```

### 2. List Messages

```typescript
const messageData = {
  messaging_product: "whatsapp",
  to: phoneNumber,
  type: "interactive",
  interactive: {
    type: "list",
    body: {
      text: "Select a service:"
    },
    action: {
      button: "Choose",
      sections: [
        {
          title: "Services",
          rows: [
            { id: "web_dev", title: "Web Development" },
            { id: "mobile", title: "Mobile Apps" },
            { id: "consulting", title: "Consulting" }
          ]
        }
      ]
    }
  }
};
```

### 3. Media Messages

```typescript
// Send image
const messageData = {
  messaging_product: "whatsapp",
  to: phoneNumber,
  type: "image",
  image: {
    link: "https://example.com/image.jpg",
    caption: "Check out our latest project!"
  }
};

// Send document
const messageData = {
  messaging_product: "whatsapp",
  to: phoneNumber,
  type: "document",
  document: {
    link: "https://example.com/proposal.pdf",
    filename: "Project Proposal.pdf"
  }
};
```

### 4. Message Status Tracking

```typescript
// In webhook handler
if (change.field === "messages" && value.statuses) {
  for (const status of value.statuses) {
    // Update message status in database
    await updateMessageStatus(status.id, status.status);
    // status can be: sent, delivered, read, failed
  }
}
```

## 🤖 Chatbot Integration

### Simple Rule-Based Bot

```typescript
async function processMessage(from: string, text: string) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("hello") || lowerText.includes("hi")) {
    return "Hello! Welcome to LASTTE. How can we help?";
  }

  if (lowerText.includes("price") || lowerText.includes("cost")) {
    return "Our pricing varies by project. Would you like to schedule a consultation?";
  }

  if (lowerText.includes("portfolio") || lowerText.includes("work")) {
    return "Check out our portfolio: https://lastte.com/work";
  }

  // Default: Route to human
  await notifyAdmin(`New message from ${from}: ${text}`);
  return "Thanks for your message! Our team will respond shortly.";
}
```

### AI-Powered Bot (OpenAI/Claude)

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function processMessageWithAI(from: string, text: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant for LASTTE, a digital systems studio. Be friendly and professional.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return completion.choices[0].message.content;
}
```

## 📊 Use Cases

### 1. Customer Support
- Clients can message for help
- Auto-responses for common questions
- Route complex issues to human agents
- Track conversation history

### 2. Order Updates
- Send order confirmations
- Shipping notifications
- Delivery updates
- Status inquiries

### 3. Appointment Booking
- Interactive buttons for scheduling
- Confirm appointments
- Send reminders
- Handle rescheduling

### 4. Lead Qualification
- Ask qualifying questions
- Collect information
- Route to sales team
- Follow up automatically

### 5. Project Updates
- Send progress updates
- Share milestones
- Request feedback
- Deliver final products

## 🔒 Security Considerations

1. **Verify Webhook Signatures** - Always verify incoming webhooks
2. **Rate Limiting** - Prevent abuse
3. **Authentication** - Secure admin endpoints
4. **Data Privacy** - Encrypt sensitive conversations
5. **Access Control** - Limit who can respond to messages

## 💰 Cost Considerations

- **Free Tier:** 1,000 conversations/month
- **Paid Tier:** Based on conversation volume
- **Template Messages:** Free (but require approval)
- **Free-form Messages:** Free within 24-hour window

## 🚀 Getting Started

1. **Start Simple:**
   - Set up webhook endpoint
   - Handle incoming messages
   - Send basic responses

2. **Add Features Gradually:**
   - Message storage
   - Admin interface
   - Interactive messages
   - AI integration

3. **Scale:**
   - Multiple agents
   - Chatbot automation
   - Analytics and reporting

## 📚 Resources

- [WhatsApp Cloud API Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Interactive Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#interactive-messages)
- [Message Status](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components#statuses-object)

---

**Next Steps:**
1. Review this guide
2. Decide which features you want to implement
3. Start with webhook setup
4. Build admin chat interface
5. Add advanced features as needed

Would you like me to help implement any of these features?


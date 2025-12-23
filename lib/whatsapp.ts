/**
 * WhatsApp Cloud API Service
 * Official WhatsApp Business Cloud API integration for sending notifications
 */

interface WhatsAppMessage {
  messaging_product: "whatsapp"; // Required by WhatsApp Cloud API
  to: string; // Phone number in international format (e.g., +1234567890)
  type: "text" | "template";
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: "body";
      parameters: Array<{
        type: "text";
        text: string;
      }>;
    }>;
  };
}

interface WhatsAppResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

/**
 * Send a WhatsApp message using the Cloud API
 */
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string; errorCode?: number; errorSubcode?: number }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.error("WhatsApp credentials not configured");
    return {
      success: false,
      error: "WhatsApp credentials not configured. Please set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in your environment variables.",
    };
  }

  // Validate and clean token format
  let cleanToken = accessToken.trim();
  
  // Remove any quotes if present
  if ((cleanToken.startsWith('"') && cleanToken.endsWith('"')) ||
      (cleanToken.startsWith("'") && cleanToken.endsWith("'"))) {
    cleanToken = cleanToken.slice(1, -1);
  }
  
  // Remove any leading/trailing whitespace again
  cleanToken = cleanToken.trim();
  
  // Check if token starts with EAA (or has extra character)
  if (!cleanToken.startsWith('EAA') && !cleanToken.startsWith('yEAA')) {
    console.error("Invalid access token format - should start with EAA");
    return {
      success: false,
      error: "Invalid access token format. Token should start with 'EAA'.",
    };
  }
  
  // Use the cleaned token
  const finalToken = cleanToken;

  // Format phone number (remove any non-digit characters except +)
  const formattedPhone = phoneNumber.replace(/[^\d+]/g, "");
  // Ensure it starts with + if it doesn't
  const toPhone = formattedPhone.startsWith("+")
    ? formattedPhone
    : `+${formattedPhone}`;

  const messageData: WhatsAppMessage = {
    messaging_product: "whatsapp",
    to: toPhone,
    type: "text",
    text: {
      body: message,
    },
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${finalToken}`,
        },
        body: JSON.stringify(messageData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", JSON.stringify(data, null, 2));
      
      // Provide helpful error messages
      if (data.error?.code === 190) {
        return {
          success: false,
          error: "Invalid access token. Please check your WHATSAPP_ACCESS_TOKEN. It may have expired (temporary tokens last 24 hours) or be incorrectly formatted.",
        };
      }
      
      if (data.error?.code === 100) {
        return {
          success: false,
          error: "Invalid parameter. Please check your WHATSAPP_PHONE_NUMBER_ID and recipient phone number format.",
        };
      }

      // Error code 10 = Permission denied
      if (data.error?.code === 10) {
        return {
          success: false,
          error: "Permission denied. Your access token doesn't have 'whatsapp_business_messaging' permission. You need to generate a new token with proper permissions. See WHATSAPP_PERMISSIONS_FIX.md for instructions.",
        };
      }

      // Error code 131047 = Message outside 24-hour window
      if (data.error?.code === 131047 || data.error?.error_subcode === 131047) {
        return {
          success: false,
          error: "Message outside 24-hour window. The recipient must message your business number first, or you need to use a pre-approved template message.",
        };
      }
      
      return {
        success: false,
        error: data.error?.message || "Failed to send WhatsApp message",
        errorCode: data.error?.code,
        errorSubcode: data.error?.error_subcode,
      };
    }

    // Log full response for debugging
    console.log("WhatsApp API response:", JSON.stringify(data, null, 2));

    return {
      success: true,
      messageId: (data as WhatsAppResponse).messages?.[0]?.id,
    };
  } catch (error: any) {
    console.error("Error sending WhatsApp message:", error);
    return {
      success: false,
      error: error.message || "Failed to send WhatsApp message",
    };
  }
}

/**
 * Send a WhatsApp template message
 * Templates must be pre-approved by Meta
 */
export async function sendWhatsAppTemplate(
  phoneNumber: string,
  templateName: string,
  languageCode: string = "en",
  parameters: string[] = []
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.error("WhatsApp credentials not configured");
    return {
      success: false,
      error: "WhatsApp credentials not configured. Please set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in your environment variables.",
    };
  }

  // Validate and clean token format (same as sendWhatsAppMessage)
  let cleanToken = accessToken.trim();
  
  // Remove any quotes if present
  if ((cleanToken.startsWith('"') && cleanToken.endsWith('"')) ||
      (cleanToken.startsWith("'") && cleanToken.endsWith("'"))) {
    cleanToken = cleanToken.slice(1, -1).trim();
  }
  
  // Use the cleaned token
  const finalToken = cleanToken;

  // Format phone number
  const formattedPhone = phoneNumber.replace(/[^\d+]/g, "");
  const toPhone = formattedPhone.startsWith("+")
    ? formattedPhone
    : `+${formattedPhone}`;

  const messageData: WhatsAppMessage = {
    messaging_product: "whatsapp",
    to: toPhone,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      ...(parameters.length > 0 && {
        components: [
          {
            type: "body",
            parameters: parameters.map((param) => ({
              type: "text",
              text: param,
            })),
          },
        ],
      }),
    },
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${finalToken}`,
        },
        body: JSON.stringify(messageData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return {
        success: false,
        error: data.error?.message || "Failed to send WhatsApp template",
      };
    }

    return {
      success: true,
      messageId: (data as WhatsAppResponse).messages?.[0]?.id,
    };
  } catch (error: any) {
    console.error("Error sending WhatsApp template:", error);
    return {
      success: false,
      error: error.message || "Failed to send WhatsApp template",
    };
  }
}

/**
 * Format a lead notification message for WhatsApp
 */
export function formatLeadNotification(lead: {
  name: string;
  email: string;
  phone?: string | null;
  business?: string | null;
  message?: string | null;
}): string {
  let message = `🆕 *New Lead Received*\n\n`;
  message += `*Name:* ${lead.name}\n`;
  message += `*Email:* ${lead.email}\n`;
  
  if (lead.phone) {
    message += `*Phone:* ${lead.phone}\n`;
  }
  
  if (lead.business) {
    message += `*Business:* ${lead.business}\n`;
  }
  
  if (lead.message) {
    const truncatedMessage =
      lead.message.length > 200
        ? lead.message.substring(0, 200) + "..."
        : lead.message;
    message += `\n*Message:*\n${truncatedMessage}`;
  }
  
  message += `\n\nView in dashboard: ${process.env.NEXTAUTH_URL || "https://lastte.vercel.app"}/admin/leads`;
  
  return message;
}


import { NextResponse } from 'next/server';
import { createUIMessageStreamResponse } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMsgObj = messages[messages.length - 1];
    
    let lastMessage = '';
    if (lastMsgObj) {
      if (typeof lastMsgObj.content === 'string' && lastMsgObj.content.trim() !== '') {
        lastMessage = lastMsgObj.content;
      } else if (lastMsgObj.parts && Array.isArray(lastMsgObj.parts)) {
        lastMessage = lastMsgObj.parts
          .filter((part: any) => part.type === 'text')
          .map((part: any) => part.text)
          .join('');
      } else if (lastMsgObj.text) { 
        lastMessage = lastMsgObj.text;
      }
    }

    // Send the message to n8n webhook
    // const n8nWebhookUrl = 'https://n8n.luvion.my.id/webhook/97d6eb68-bb95-4396-a0a6-42668e2d9d2a/chat';
    const n8nWebhookUrl = 'https://n8n.luvion.my.id/webhook/073659fe-9b65-4703-bf28-04422bfa0146/chat';
    
    let textResponse = '';
    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: lastMessage,
          messages: messages,
          sessionId: 'luvion-chat-session'
        }),
      });

      if (!n8nResponse.ok) {
        throw new Error(`n8n webhook error: ${n8nResponse.status} ${n8nResponse.statusText}`);
      }

      // Try to parse JSON or fallback to text
      const contentType = n8nResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await n8nResponse.json();
        textResponse = json.output || json.text || json.response || json.message || JSON.stringify(json);
      } else {
        textResponse = await n8nResponse.text();
      }
    } catch (n8nErr: any) {
      console.error('Error fetching from n8n:', n8nErr);
      textResponse = "Maaf, saat ini AI Luvion sedang mengalami gangguan dalam terhubung ke server AI kami. Silakan coba beberapa saat lagi.";
    }

    let recommendedTier = 'Starter';
    const lowerInput = lastMessage.toLowerCase();

    if (
      lowerInput.includes('multi-gudang') ||
      lowerInput.includes('multi gudang') ||
      lowerInput.includes('stok') ||
      lowerInput.includes('gudang') ||
      lowerInput.includes('scale') ||
      lowerInput.includes('banyak toko') ||
      lowerInput.includes('pro') ||
      lowerInput.includes('kurir')
    ) {
      recommendedTier = 'Pro';
    } else if (
      lowerInput.includes('enterprise') ||
      lowerInput.includes('corporate') ||
      lowerInput.includes('perusahaan') ||
      lowerInput.includes('custom model') ||
      lowerInput.includes('sla') ||
      lowerInput.includes('korporat')
    ) {
      recommendedTier = 'Enterprise';
    } else {
      recommendedTier = 'Starter';
    }

    // Append hidden tag to trigger highlight
    const finalResponse = textResponse + `\n\n__HIGHLIGHT_TIER__${recommendedTier}__`;

    // Stream chunks back using plain text streaming for maximum compatibility
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = finalResponse.split(/(\s+)/);
        for (const word of words) {
          if (word) {
            controller.enqueue(encoder.encode(word));
            await new Promise((resolve) => setTimeout(resolve, 20)); // typing delay
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

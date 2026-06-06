import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || '';

    // Analyze input for scale keywords to determine best tier recommendation
    let recommendedTier = 'Starter';
    let recommendedModules = ['Finance Ledger'];
    let explanation = '';

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
      recommendedModules = ['Finance Ledger', 'Pospro/Jastip Pro', 'Gym Pro'];
      explanation = 'Rekomendasi Paket: **Paid Pro ($20/bln)**.\nSistem mendeteksi kebutuhan pengelolaan inventaris multi-gudang/kurir dan skala transaksi tinggi, yang membutuhkan kustom domain sendiri serta Advanced AI Automation untuk sinkronisasi ekosistem.';
    } else if (
      lowerInput.includes('enterprise') ||
      lowerInput.includes('corporate') ||
      lowerInput.includes('perusahaan') ||
      lowerInput.includes('custom model') ||
      lowerInput.includes('sla') ||
      lowerInput.includes('korporat')
    ) {
      recommendedTier = 'Enterprise';
      recommendedModules = ['Finance Ledger', 'Pospro/Jastip Pro', 'Travel Planner', 'Gym Pro'];
      explanation = 'Rekomendasi Paket: **Enterprise (Custom SLA)**.\nKebutuhan integrasi model AI kustom untuk bisnis mandiri, multi-domain, dedicated environment, serta dukungan Dedicated Account Manager cocok untuk solusi khusus tim Enterprise Luvion.';
    } else {
      recommendedTier = 'Starter';
      recommendedModules = ['Finance Ledger'];
      explanation = 'Rekomendasi Paket: **Starter ($0/Free)**.\nSistem merekomendasikan paket Starter untuk memulai digitalisasi bisnis Anda dengan maksimal 3 proyek aktif, basic LLM integration, dan subdomain Luvion.';
    }

    const textResponse = `Halo! Terima kasih telah menjelaskan kebutuhan bisnis Anda. 

Analisis AI Luvion untuk bisnis Anda:
- **Kebutuhan Sistem**: "${lastMessage}"
- **Modul Rekomendasi**: ${recommendedModules.map(m => `\`${m}\``).join(', ')}
- **Estimasi Waktu Deployment**: ~5 menit (Instan via Luvion Engine)

${explanation}

Anda dapat melihat detail dari paket ini di bawah pada bagian pricing. Kami telah memberikan highlight khusus pada paket yang kami rekomendasikan untuk Anda.`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Stream text chunks following the Vercel AI SDK Data Stream protocol:
        // Format: 0:"text_chunk"\n
        const words = textResponse.split(/(\s+)/);
        for (const word of words) {
          if (word) {
            const dataStreamChunk = `0:${JSON.stringify(word)}\n`;
            controller.enqueue(encoder.encode(dataStreamChunk));
            await new Promise((resolve) => setTimeout(resolve, 15)); // simulate network delay
          }
        }
        
        // Append hidden tag to trigger highlight
        const finalTag = `\n\n__HIGHLIGHT_TIER__${recommendedTier}__`;
        const tagChunk = `0:${JSON.stringify(finalTag)}\n`;
        controller.enqueue(encoder.encode(tagChunk));
        
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

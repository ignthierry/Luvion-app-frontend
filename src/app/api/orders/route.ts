import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.luvion.my.id/api';

  try {
    const formData = await request.formData();
    
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No error text');
      console.error(`Backend returned ${res.status}:`, errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(errorJson, { status: res.status });
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to process order on backend' },
          { status: res.status }
        );
      }
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    console.error('Error forwarding order:', error.message || error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

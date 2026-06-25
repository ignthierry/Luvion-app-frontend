import { NextResponse } from 'next/server';

export async function GET() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.luvion.my.id/api';
  
  try {
    const res = await fetch(`${API_URL}/modules`, {
      headers: {
        'Accept': 'application/json'
      },
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No text');
      throw new Error(`Failed to fetch modules from backend. Status: ${res.status}. Response: ${errorText.substring(0, 200)}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching modules:', error.message || error);
    return NextResponse.json([], { status: 500 });
  }
}

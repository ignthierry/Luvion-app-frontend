import { NextResponse } from 'next/server';

export async function GET() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  
  try {
    const res = await fetch(`${API_URL}/pricing`, {
      headers: {
        'Accept': 'application/json'
      },
      next: { revalidate: 60 } // optional cache revalidation
    });
    
    if (!res.ok) throw new Error('Failed to fetch pricing from backend');
    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json([], { status: 500 });
  }
}

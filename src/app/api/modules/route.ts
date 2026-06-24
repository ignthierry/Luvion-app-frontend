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
    
    if (!res.ok) throw new Error('Failed to fetch modules from backend');
    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json([], { status: 500 });
  }
}

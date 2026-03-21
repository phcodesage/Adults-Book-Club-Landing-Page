import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ status: 'connected' });
  } catch (err) {
    console.error('Status route GET error:', err);
    return NextResponse.json({ status: 'error' }, { status: 503 });
  }
}

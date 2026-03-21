import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import type { AnalyticsVisit } from '@/src/types';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const visits = await db
      .collection('analytics')
      .find({})
      .sort({ visitedAt: -1 })
      .limit(500)
      .toArray();

    return NextResponse.json(
      visits.map(({ _id, ...v }: any) => { void _id; return v as AnalyticsVisit; })
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const visit = (await req.json()) as AnalyticsVisit;

    if (!visit?.id) return NextResponse.json({ error: 'Invalid visit payload' }, { status: 400 });

    await db.collection('analytics').insertOne({ _id: visit.id as unknown as never, ...visit });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    // Duplicate key = already recorded; treat as no-op
    if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

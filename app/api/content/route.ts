import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import type { SiteContent } from '@/src/types';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection('siteContent').findOne({ _id: 'singleton' as unknown as never });

    if (!doc) return NextResponse.json(null);

    const { _id, ...content } = doc;
    void _id; // discard mongo _id
    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const content = (await req.json()) as SiteContent;

    await db.collection('siteContent').replaceOne(
      { _id: 'singleton' as unknown as never },
      { _id: 'singleton', ...content },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

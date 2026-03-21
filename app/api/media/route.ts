import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import type { MediaItem } from '@/src/types';

function stripId(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  void _id;
  return rest as MediaItem;
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('media').find({}).sort({ uploadedAt: -1 }).toArray();
    return NextResponse.json(items.map((d: any) => stripId(d as Record<string, unknown>)));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = (await req.json()) as MediaItem | MediaItem[];
    const items = Array.isArray(body) ? body : [body];

    if (!items.length) return NextResponse.json({ error: 'No items provided' }, { status: 400 });

    // Collect existing src values to avoid duplicates
    const existingDocs = await db.collection('media').find({}, { projection: { src: 1 } }).toArray();
    const existingSrcs = new Set(existingDocs.map((d: any) => (d as { src: string }).src));
    const newItems = items.filter((item) => !existingSrcs.has(item.src));

    if (newItems.length) {
      await db.collection('media').insertMany(
        newItems.map((item) => ({ _id: item.id as unknown as never, ...item }))
      );
    }

    const all = await db.collection('media').find({}).sort({ uploadedAt: -1 }).toArray();
    return NextResponse.json(all.map((d: any) => stripId(d as Record<string, unknown>)));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

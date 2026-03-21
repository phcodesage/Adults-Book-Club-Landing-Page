import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import type { MediaItem } from '@/src/types';

type Params = { params: Promise<{ id: string }> };

function stripId(doc: Record<string, unknown>): MediaItem {
  const { _id, ...rest } = doc;
  void _id;
  return rest as MediaItem;
}

// PUT /api/media/:id — replace a single media item
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    const existing = await db.collection('media').findOne({ _id: id as unknown as never });
    if (!existing) return NextResponse.json({ error: 'Media item not found' }, { status: 404 });

    const patch = (await req.json()) as Partial<MediaItem>;
    const updated = { ...existing, ...patch };
    await db.collection('media').replaceOne({ _id: id as unknown as never }, updated);

    const all = await db.collection('media').find({}).sort({ uploadedAt: -1 }).toArray();
    return NextResponse.json({
      previousItem: stripId(existing as Record<string, unknown>),
      nextItem: stripId(updated as Record<string, unknown>),
      mediaLibrary: all.map((d: any) => stripId(d as Record<string, unknown>)),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE /api/media/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    await db.collection('media').deleteOne({ _id: id as unknown as never });
    const all = await db.collection('media').find({}).sort({ uploadedAt: -1 }).toArray();
    return NextResponse.json(all.map((d: any) => stripId(d as Record<string, unknown>)));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment ID' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (body.status === 'verified') {
      updateData.status = 'verified';
      updateData.verifiedAt = new Date().toISOString();
      updateData.verifiedBy = body.verifiedBy || 'admin';
    } else if (body.status === 'rejected') {
      updateData.status = 'rejected';
      updateData.rejectionReason = body.rejectionReason;
    }
    
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const result = await db
      .collection('payments')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}
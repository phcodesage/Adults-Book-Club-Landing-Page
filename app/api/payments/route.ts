import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ZellePayment } from '@/src/types';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const payment: Omit<ZellePayment, '_id'> = {
      courseName: body.courseName,
      customerName: body.customerName,
      phoneNumber: body.phoneNumber,
      referenceNumber: body.referenceNumber,
      amount: body.amount,
      screenshotUrl: body.screenshotUrl,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const result = await db.collection('payments').insertOne(payment);
    
    return NextResponse.json({ 
      success: true, 
      paymentId: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const filter = status ? { status } : {};
    const payments = await db
      .collection('payments')
      .find(filter)
      .sort({ submittedAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
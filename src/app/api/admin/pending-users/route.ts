import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const pendingUsers = await User.find({ isApproved: false }, { password: 0 });

    return NextResponse.json(pendingUsers, { status: 200 });
  } catch (err) {
    console.error('💥 Error fetching pending users:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

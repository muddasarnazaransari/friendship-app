// src/app/api/admin/pending-users/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const pendingUsers = await User.find({ isApproved: false, isBlocked: { $ne: true } }, { password: 0 });
    const approvedUsers = await User.find({ isApproved: true, isBlocked: { $ne: true }, role: 'user' }, { password: 0 });
    const blockedUsers = await User.find({ isBlocked: true }, { password: 0 });

    return NextResponse.json({ pendingUsers, approvedUsers, blockedUsers }, { status: 200 });
  } catch (err) {
    console.error('💥 Error fetching users:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

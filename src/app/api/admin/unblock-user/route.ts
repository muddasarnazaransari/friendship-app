// /src/app/api/admin/unblock-user/route.ts
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    await connectDB();

    await User.findByIdAndUpdate(userId, { status: 'approved' });

    return NextResponse.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error("Unblock Error:", error);
    return NextResponse.json({ message: 'Failed to unblock user' }, { status: 500 });
  }
}

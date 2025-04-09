// src/app/api/check-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ status: "declined" }); // user deleted
    }

    if (user.isApproved) {
      return NextResponse.json({ status: "approved" });
    }

    return NextResponse.json({ status: "pending" });
  } catch (error) {
    console.error("💥 Error checking status:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}

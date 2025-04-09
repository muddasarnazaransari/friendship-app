// src/app/api/admin/approve-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.isApproved = true;
    await user.save();

    // Send approval email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Friendship Request Accepted 🎉",
      text: `Hey ${user.name}, your friendship request has been approved! Visit your dashboard here: ${process.env.BASE_URL}/dashboard`,
    });

    return NextResponse.json({ message: "User approved" });
  } catch (err) {
    console.error("💥 Approval Error:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

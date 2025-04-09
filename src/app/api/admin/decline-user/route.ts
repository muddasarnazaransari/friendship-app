// src/app/api/admin/decline-user/route.ts
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

    const userEmail = user.email;
    const userName = user.name;

    await User.findByIdAndDelete(userId);

    // Send decline email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Friendship Request Declined 💔",
      text: `Sorry ${userName}, the King has declined your friend request. You can try again later.`,
    });

    return NextResponse.json({ message: "User declined and deleted" });
  } catch (err) {
    console.error("💥 Decline Error:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    console.log("✅ [POST] Request received at /api/register");

    const { name, email, mobile, password } = await req.json();
    console.log("📥 Received data:", { name, email, mobile });

    if (!name || !email || !mobile || !password) {
      console.log("❌ Missing required fields");
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectDB();
    console.log("✅ Connected to MongoDB");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already registered:", email);
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed");

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "user",
      isApproved: false,
    });

    await newUser.save();
    console.log("✅ New user saved to database");

    // Notify admin via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      port: 587,
      secure: false,
    });

    console.log("🔄 Verifying transporter...");
    await transporter.verify();
    console.log("✅ Transporter verified successfully");

    const approvalLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard`;

    console.log("📤 Sending email to:", process.env.ADMIN_EMAIL);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "🧑 New Friend Request Received!",
      text: `A user sent a friend request:\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\n\nApprove or Decline here: ${approvalLink}`,
    });

    console.log("✅ Email sent successfully");

    return NextResponse.json({ message: "Registration successful" }, { status: 201 });

  } catch (error) {
    console.error("💥 Registration error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("🔐 Incoming login request:", { email, password });

    await connectDB();
    console.log("✅ Connected to MongoDB");

    const user = await User.findOne({ email });
    console.log("👤 User found:", user);

    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password match:", isMatch);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = JSON.stringify({
      email: user.email,
      role: user.role,
    });

    const cookie = serialize("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    const res = NextResponse.json({ role: user.role });
    res.headers.set("Set-Cookie", cookie);

    if (user.role === "admin") {
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
        subject: "Welcome My King",
        text: "Welcome my king",
      });

      console.log("📧 Email sent to admin");
    }

    return res;
  } catch (err) {
    console.error("💥 Login Error:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

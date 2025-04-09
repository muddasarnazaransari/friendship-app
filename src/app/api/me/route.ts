// src/app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

export async function GET(req: NextRequest) {
  const cookies = req.headers.get("cookie") || "";
  const parsed = parse(cookies);

  if (!parsed.session) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const userData = JSON.parse(parsed.session);
  return NextResponse.json(userData);
}

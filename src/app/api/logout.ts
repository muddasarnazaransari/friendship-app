// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  return new NextResponse(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: {
      'Set-Cookie': 'token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'Content-Type': 'application/json',
    },
  });
}

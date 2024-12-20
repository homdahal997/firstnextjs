// app/(admin)/admin/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Get the base URL from environment variable or construct it
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Use absolute URL for redirect
  return NextResponse.redirect(new URL('/admin/dashboard', baseUrl));
}
// app/api/auth/check-super-admin/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/user.model";

export async function GET() {
  try {
    await dbConnect();
    const superAdmin = await User.findOne({ role: "SUPER_ADMIN" });
    return NextResponse.json({ hasSuperAdmin: !!superAdmin });
  } catch (error) {
    return NextResponse.json({ error: "Failed to check super admin" }, { status: 500 });
  }
}
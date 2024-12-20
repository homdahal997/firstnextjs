// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/user.model";
import { Profile } from "@/models/profile.model";

export async function POST(req: Request) {
    try {
      await dbConnect();
      const { name, username, password, otp, hashedOtp, isSuperAdmin } = await req.json();
  
      // Check if this is the first user
      const userCount = await User.countDocuments();
      const role = userCount === 0 || isSuperAdmin ? 'SUPER_ADMIN' : 'USER';
  
      const [firstName, ...lastNameParts] = name.trim().split(" ");
      const lastName = lastNameParts.join(" ");
  
      const user = await User.create({
        firstName,
        lastName: lastName || firstName,
        email: username,
        password,
        role,
        verified: true,
      });
  
      await Profile.create({
        name,
        email: username,
        userId: user._id,
      });
  
      return NextResponse.json({
        message: "Registration successful",
        isSuperAdmin: role === 'SUPER_ADMIN'
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }
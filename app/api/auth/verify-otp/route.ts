import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/user.model";
import { verifyHash } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { otp, hashedOtp } = await req.json();

    // Check if there are any existing users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      // First user, skip OTP verification
      return NextResponse.json({
        message: "First user, OTP verification skipped",
        otp,
        hashedOtp
      });
    }

    // Verify OTP
    const isOtpVerified = await verifyHash(otp, hashedOtp);
    if (!isOtpVerified) {
      return NextResponse.json(
        { error: "OTP is incorrect" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "OTP verified successfully",
      otp,
      hashedOtp
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
// app/api/auth/validate-email/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/user.model";
import { generateOTP, hashOTP } from "@/lib/utils";
import { sendOTPEmail } from "@/lib/sendgrid";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = generateOTP(); // 6-digit number
        const hashedOtp = await hashOTP(otp);

        // Send OTP via email
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            throw new Error('Failed to send verification email');
        }

        return NextResponse.json({
            message: "Verification code sent",
            hashedOtp
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to send verification code" },
            { status: 500 }
        );
    }
}
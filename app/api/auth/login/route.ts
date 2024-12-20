import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/user.model';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, password } = await req.json();

        const formattedUsername = username.toLowerCase();
        const user = await User.findOne({ email: formattedUsername });

        if (!user) {
            return NextResponse.json(
                { message: 'Username or Password is wrong' },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { message: 'Username or Password is wrong' },
                { status: 401 }
            );
        }

        // Set session cookie
        const response = NextResponse.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            isSuperAdmin: user.role === 'SUPER_ADMIN'
        });

        response.cookies.set('session', user._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
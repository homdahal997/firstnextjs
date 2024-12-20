// models/user.model.ts
import mongoose from 'mongoose';
import { hash } from 'bcryptjs';

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'USER' | 'SUPER_ADMIN';
    verified: boolean;
    verificationToken?: string;
    createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['USER', 'SUPER_ADMIN'],
        default: 'USER',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
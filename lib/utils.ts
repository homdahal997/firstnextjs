import { compare, hash } from "bcryptjs";

export const verifyHash = async (value: string, hashedValue: string) => {
  return await compare(value, hashedValue);
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = async (otp: string) => {
  return await hash(otp, 12);
};
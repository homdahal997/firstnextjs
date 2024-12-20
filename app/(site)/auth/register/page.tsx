// app\(site)\auth\register\page.tsx
import Register from "@/components/Auth/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up Page - Solid SaaS Boilerplate",
  description: "This is Sign Up page for Startup Pro",
  // other metadata
};

export default function RegisterPage() {
  return (
    <>
      <Register />
    </>
  );
}
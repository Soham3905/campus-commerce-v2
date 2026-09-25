import { NextResponse } from "next/server";
import { saveOtp } from "@/lib/otpStore";

/**
 * ==============================================================================
 * Route Handler: POST /api/auth/send-otp
 * ==============================================================================
 * Beginner Note:
 * This runs on the backend server.
 * When the user submits their email on Step 1, this generates a fresh 6-digit OTP,
 * stores it in memory, and returns it so the frontend can notify the user.
 */
export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const email = body?.email;

    // Simple email regex check
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address (e.g. student@campus.edu)." },
        { status: 400 }
      );
    }

    // Generate a random 6-digit number (e.g. 748291)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in backend memory for this email
    saveOtp(email, generatedOtp);

    console.log(`[Backend OTP Service] Generated OTP for ${email}: ${generatedOtp}`);

    return NextResponse.json({
      success: true,
      otp: generatedOtp,
      message: "OTP generated successfully",
    });
  } catch (error: any) {
    console.error("Error generating OTP:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to generate OTP" },
      { status: 500 }
    );
  }
}

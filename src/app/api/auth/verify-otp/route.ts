import { NextResponse } from "next/server";
import { getStoredOtp, clearStoredOtp, MASTER_OTP } from "@/lib/otpStore";

/**
 * ==============================================================================
 * Route Handler: POST /api/auth/verify-otp
 * ==============================================================================
 * Beginner Note:
 * This verifies the OTP entered by the user.
 * Condition:
 *   otp === stored OTP from backend  OR  otp === MASTER_OTP ("123456")
 *
 * If valid, it returns the structured user session object containing:
 * - username, role, profilePicture
 * - token, ssoToken
 * - showTooltip (for guided onboarding tutorials)
 * - university details from VNIT reference
 */
export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const { email, otp } = body;

    // Simple email regex check
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (!otp) {
      return NextResponse.json(
        { success: false, message: "Please provide a 6-digit OTP code." },
        { status: 400 }
      );
    }

    const storedOtp = getStoredOtp(email);
    const isMasterOtp = otp === MASTER_OTP;
    const isGeneratedOtpMatch = storedOtp && otp === storedOtp;

    // Check: user entered generated code OR master OTP ("123456")
    if (!isGeneratedOtpMatch && !isMasterOtp) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid code. Please enter the valid 6-digit code or master OTP.`,
        },
        { status: 400 }
      );
    }

    // Success: Clear OTP after successful verification (security best practice)
    clearStoredOtp(email);

    // Build the user session payload
    const userPayload = {
      id: 1,
      username: "alex_vnit",
      firstName: "Alex",
      lastName: "Morgan",
      email: email,
      phone: "+91 98765 43210",
      role: "admin", // can be "admin", "moderator", or "student"
      token: "campus_auth_jwt_vnit_live_920194",
      ssoToken: "vnit_sso_oauth2_sec_8849129034",
      profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      university: "Visvesvaraya National Institute of Technology (VNIT)",
      department: "Computer Science & Engineering",
      showTooltip: true, // Used by the tutorial/tooltip guide system
    };

    return NextResponse.json({
      success: true,
      message: isMasterOtp ? "Master OTP verified! Welcome Alex." : "Verification successful! Welcome Alex.",
      user: userPayload,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during verification." },
      { status: 500 }
    );
  }
}

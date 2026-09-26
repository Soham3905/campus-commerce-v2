"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setLoginSuccess, logout } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // --------------------------------------------------------------------------
  // Simple React State
  // --------------------------------------------------------------------------
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("student@campus.edu");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP State: 6 digits
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [popupOtp, setPopupOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(48);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Beginner-friendly email regex pattern (e.g., student@campus.edu)
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // References to the 6 input boxes for smooth auto-focus
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown timer for Step 2
  useEffect(() => {
    if (step !== 2) return;
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Listen to browser Back button:
  // If user is on Step 2 and hits the browser's Back button, return to Step 1 instead of leaving
  useEffect(() => {
    // Clear any previous session when on login page
    dispatch(logout());

    const handleBrowserBack = () => {
      setStep(1);
      setPopupOtp(null);
      setErrorMessage(null);
    };

    window.addEventListener("popstate", handleBrowserBack);
    return () => window.removeEventListener("popstate", handleBrowserBack);
  }, []);

  /**
   * Return back to Step 1 safely (used by 'Edit email' and 'Cancel' buttons)
   */
  const handleReturnToStep1 = () => {
    setStep(1);
    setPopupOtp(null);
    setErrorMessage(null);
    if (typeof window !== "undefined" && window.history.state?.campusStep === 2) {
      window.history.back();
    }
  };

  /**
   * Helper function: Request a new OTP from the backend Route Handler (/api/auth/send-otp)
   */
  const requestOtpFromBackend = async (targetEmail: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setGeneratedOtp(data.otp);
        setPopupOtp(data.otp);
        setOtp(["", "", "", "", "", ""]);
        setResendTimer(48);
        setStep(2);
        // Push state so pressing browser Back button returns to Step 1 instead of exiting
        window.history.pushState({ campusStep: 2 }, "");
      } else {
        setErrorMessage(data.message || "Failed to generate OTP from server.");
      }
    } catch (err) {
      console.error("Backend error requesting OTP:", err);
      setErrorMessage("Could not reach backend server to generate OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Step 1: Continue to Verification (Calls Backend API)
  // --------------------------------------------------------------------------
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    // 1. Email validation using Regex check
    if (!cleanEmail) {
      setErrorMessage("Please enter your campus email address.");
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address (e.g. student@campus.edu).");
      return;
    }

    // 2. Request OTP from backend
    await requestOtpFromBackend(cleanEmail);
  };

  // --------------------------------------------------------------------------
  // OTP Inputs Navigation (Auto-advance on typing)
  // --------------------------------------------------------------------------
  const handleOtpChange = (index: number, val: string) => {
    if (errorMessage) setErrorMessage(null);
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean && val !== "") return;

    const newOtp = [...otp];
    // If user pasted multi-digit code
    if (clean.length > 1) {
      const chars = clean.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newOtp[i] = chars[i] || "";
      }
      setOtp(newOtp);
      otpRefs.current[Math.min(chars.length, 5)]?.focus();
      return;
    }

    newOtp[index] = clean;
    setOtp(newOtp);

    // Auto-advance to next box
    if (clean && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // --------------------------------------------------------------------------
  // Step 2: Verify OTP with Backend (/api/auth/verify-otp)
  // Supports both the backend-generated OTP and Master OTP (123456)
  // --------------------------------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join("");

    if (fullCode.length < 6) {
      setErrorMessage("Please enter all 6 digits of your verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: fullCode }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        // Store user in Redux (which also syncs to localStorage)
        if (data.user) {
          dispatch(setLoginSuccess(data.user));
        }
        // Redirect to dashboard (use replace so back button doesn't loop back to OTP page)
        router.replace("/dashboard");
      } else {
        setErrorMessage(
          data.message || "Invalid code. Please enter the valid 6-digit code or master OTP."
        );
      }
    } catch (err) {
      console.error("Backend error verifying OTP:", err);
      setErrorMessage("Could not reach backend server for verification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-zinc-50 px-3 py-3 sm:px-6 sm:py-6 lg:px-8">
      {/* ---------------------------------------------------------------------- */}
      {/* OTP POPUP NOTIFICATION (Fully Mobile-Friendly)                         */}
      {/* ---------------------------------------------------------------------- */}
      {popupOtp && (
        <div className="fixed top-3 left-3 right-3 sm:left-auto sm:right-6 sm:top-6 z-50 max-w-sm flex items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 shadow-2xl ring-1 ring-emerald-500/20 animate-bounce-short">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-xl sm:text-2xl">
            💬
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-text-main truncate">Security Code</span>
              <span className="text-[9px] sm:text-[10px] rounded-full bg-emerald-100 px-1.5 py-0.2 text-emerald-800 font-semibold shrink-0">Just now</span>
            </div>
            <p className="mt-0.5 text-[11px] sm:text-xs text-text-muted">
              OTP:{" "}
              <strong className="font-mono text-sm sm:text-base font-black text-primary tracking-widest">
                {popupOtp}
              </strong>
            </p>
          </div>
          <div className="flex flex-col gap-1 pl-2 border-l border-zinc-100 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (generatedOtp) {
                  setOtp(generatedOtp.split(""));
                }
                setPopupOtp(null);
                setErrorMessage(null);
              }}
              className="rounded-lg bg-primary px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-white shadow-xs hover:bg-primary-hover active:scale-95"
            >
              Auto-fill
            </button>
            <button
              type="button"
              onClick={() => setPopupOtp(null)}
              className="text-[9px] sm:text-[10px] text-text-subtle hover:text-text-main text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 1. TOP HEADER BAR                                                      */}
      {/* ---------------------------------------------------------------------- */}
      <header className="mx-auto flex w-full max-w-md sm:max-w-lg md:max-w-5xl items-center justify-between gap-2 py-1 sm:py-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-primary-light text-primary">
            {/* Graduation Cap Icon */}
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
            </svg>
          </div>
          <span className="truncate text-xs sm:text-sm font-semibold tracking-tight text-text-main">
            Campus Commerce - VNIT
          </span>
        </div>

        {/* Status Badge */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-full border border-emerald-200 bg-primary-light px-2.5 py-1 sm:px-3.5 text-[11px] sm:text-xs font-medium text-primary shadow-2xs">
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary-accent animate-pulse"></span>
          <span className="whitespace-nowrap">Systems Normal</span>
        </div>
      </header>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. MAIN SPLIT CARD (Step 1 & Step 2)                                   */}
      {/* ---------------------------------------------------------------------- */}
      <main className="my-auto flex w-full justify-center py-4 sm:py-6">
        <div className="grid w-full max-w-md sm:max-w-lg md:max-w-5xl grid-cols-1 overflow-hidden rounded-2xl sm:rounded-[28px] border border-zinc-200/90 bg-white shadow-lg sm:shadow-xl shadow-zinc-200/40 md:grid-cols-2">
          
          {/* ================================================================== */}
          {/* LEFT COLUMN: Mascot & Assistant (Hidden on mobile phones)          */}
          {/* ================================================================== */}
          <section className="hidden md:flex flex-col justify-between border-b border-zinc-100 bg-card-subtle p-4 sm:p-6 md:p-8 md:border-b-0 md:border-r">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[10px] sm:text-[11px] font-medium text-text-main shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-accent"></span>
                  Yan • AI &amp; Computer Science Mascot
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[10px] sm:text-[11px] font-medium text-text-main shadow-2xs">
                  🎓 Class of 2025
                </span>
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="relative mt-3 sm:mt-6 rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-3 sm:p-4 text-center shadow-xs">
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-text-main">
                  {step === 1
                    ? "“Hello future innovator! Ready to access your campus workspace?”"
                    : "“Almost there! Just enter the 6-digit security code sent to your device to verify your session.”"}
                </p>
                <div className="absolute -bottom-2 left-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-x-1/2 rotate-45 border-b border-r border-zinc-200/80 bg-white"></div>
              </div>

              {/* Mascot Image */}
              <div className="relative my-2 sm:my-6 flex items-center justify-center">
                <div className="relative h-36 w-36 sm:h-52 sm:w-52 md:h-64 md:w-64 overflow-hidden rounded-2xl">
                  <Image
                    src="/mascot_yan.png"
                    alt="Yan - AI Mascot"
                    width={256}
                    height={256}
                    priority
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              {/* Status Tag */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[10px] sm:text-[11px] font-semibold text-text-muted shadow-2xs">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary-accent"></span>
                YAN IS READY TO ASSIST
              </div>
            </div>

            {/* SDUI State Terminal Bar */}
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-between gap-1.5 rounded-xl bg-terminal-bg px-3 py-2 sm:px-4 sm:py-3 font-mono text-[10px] sm:text-xs text-zinc-300 shadow-inner">
              <span className="text-[10px] sm:text-[11px] text-text-subtle font-semibold">
                SDUI State:
              </span>
              <code className="text-[10px] sm:text-[11px] text-primary-accent truncate max-w-full">
                {step === 1
                  ? '{"mascot":"yan","state":"idle","gaze":"center"}'
                  : '{"mascot":"yan","state":"awaiting_otp","auth_mode":"2fa"}'}
              </code>
            </div>
          </section>

          {/* ================================================================== */}
          {/* RIGHT COLUMN: Step 1 (Login) or Step 2 (Verification)              */}
          {/* ================================================================== */}
          <section className="flex flex-col justify-between bg-white p-5 sm:p-8 md:p-10 lg:p-12">
            {step === 1 ? (
              /* -------------------------------------------------------------- */
              /* STEP 1: LOGIN FORM                                             */
              /* -------------------------------------------------------------- */
              <div>
                {/* Step indicator: Step 1 of 2 */}
                <div className="mb-3 sm:mb-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-text-subtle">
                    STEP 1 OF 2
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-8 rounded-full bg-primary"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-200"></div>
                  </div>
                </div>

                <div className="mb-2 sm:mb-3 inline-block rounded-md bg-primary-light px-2.5 py-0.5 sm:py-1 font-mono text-[11px] sm:text-xs font-semibold text-primary">
                  VNIT Portal
                </div>

                <h1 className="text-xl font-extrabold tracking-tight text-text-main sm:text-2xl lg:text-3xl">
                  Campus-Commerce Login
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-text-muted">
                  Enter your campus mobile or institutional email and password to proceed.
                </p>

                {errorMessage && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-center text-xs font-medium text-red-700">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleStep1Submit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="mb-1 sm:mb-1.5 block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      Mobile number or Campus Email
                    </label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="student@campus.edu"
                      className={`w-full rounded-xl border px-3.5 py-2.5 sm:px-4 sm:py-3 text-base sm:text-sm text-text-main placeholder-text-subtle outline-none transition ${
                        errorMessage
                          ? "border-red-400 bg-red-50/40 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-zinc-200 focus:border-primary focus:ring-1 focus:ring-primary"
                      }`}
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="mb-1 sm:mb-1.5 flex items-center justify-between">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert("Forgot password clicked")}
                        className="text-[11px] sm:text-xs font-semibold text-primary transition hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 sm:px-4 sm:py-3 pr-10 text-base sm:text-sm text-text-main placeholder-text-subtle outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-subtle hover:text-text-main"
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-5 sm:mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 sm:py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span>Requesting OTP from Server...</span>
                    ) : (
                      <>
                        <span>Continue to Verification</span>
                        <span>&rarr;</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* -------------------------------------------------------------- */
              /* STEP 2: TWO-STEP VERIFICATION                                  */
              /* -------------------------------------------------------------- */
              <div>
                {/* Step indicator: Step 2 of 2 */}
                <div className="mb-3 sm:mb-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-text-subtle">
                    STEP 2 OF 2
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-200"></div>
                    <div className="h-1.5 w-8 rounded-full bg-primary"></div>
                  </div>
                </div>

                {/* Badge row */}
                <div className="mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="rounded-md bg-primary-light px-2.5 py-0.5 sm:py-1 font-mono text-[11px] sm:text-xs font-semibold text-primary">
                    VNIT Portal
                  </span>
                  <span className="font-mono text-[11px] text-text-subtle">
                    2FA Verification
                  </span>
                </div>

                <h1 className="text-xl font-extrabold tracking-tight text-text-main sm:text-2xl lg:text-3xl">
                  Two-Step Verification
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-text-muted leading-relaxed">
                  Enter the 6-digit verification code sent to{" "}
                  <strong className="text-text-main">{email}</strong>.{" "}
                  <button
                    type="button"
                    onClick={handleReturnToStep1}
                    className="font-semibold text-primary hover:underline"
                  >
                    Edit email
                  </button>
                </p>

                {errorMessage && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-center text-xs font-medium text-red-700">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
                  <div>
                    {/* Security Verification Code Header */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Security Verification Code
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-emerald-700">
                        SMS &amp; Authenticator
                      </span>
                    </div>

                    {/* 6 OTP Input Boxes */}
                    <div className="grid grid-cols-6 gap-2 sm:gap-3">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          placeholder="•"
                          className={`h-11 sm:h-14 w-full rounded-xl border px-0 text-center font-mono text-lg font-bold outline-none transition sm:text-xl ${
                            errorMessage
                              ? "border-red-400 bg-red-50/40 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                              : digit
                              ? "border-primary bg-primary-light/30 text-text-main"
                              : "border-zinc-200 bg-white text-text-main"
                          } focus:border-primary focus:ring-2 focus:ring-primary/20`}
                        />
                      ))}
                    </div>

                    {/* Resend Code row */}
                    <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                      <span>Didn&apos;t receive a code?</span>
                      {resendTimer > 0 ? (
                        <span className="font-medium text-text-subtle">
                          Resend code (0:{resendTimer < 10 ? `0${resendTimer}` : resendTimer})
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => requestOtpFromBackend(email)}
                          className="font-semibold text-primary hover:underline disabled:opacity-50"
                        >
                          {isLoading ? "Sending..." : "Resend code"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 sm:py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span>Verifying with Server...</span>
                    ) : (
                      <>
                        <span>Verify &amp; Access Workspace</span>
                        <span>&rarr;</span>
                      </>
                    )}
                  </button>

                  {/* Secondary navigation options */}
                  <div className="flex items-center justify-center gap-3 pt-2 text-xs text-text-subtle">
                    <button
                      type="button"
                      className="hover:text-primary transition font-medium underline-offset-2 hover:underline"
                    >
                      Use Backup Security Key
                    </button>
                    <span>&bull;</span>
                    <button
                      type="button"
                      onClick={handleReturnToStep1}
                      className="hover:text-text-main transition font-medium"
                    >
                      Cancel and return to login
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Helpdesk Footer */}
            <div className="mt-6 sm:mt-8 text-center text-xs text-text-muted">
              Need campus activation support?{" "}
              <button
                onClick={() => alert("IT Helpdesk contact: ithelpdesk@vnit.ac.in")}
                className="font-semibold text-text-main underline hover:text-primary"
              >
                IT Helpdesk
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. FOOTER LINKS                                                        */}
      {/* ---------------------------------------------------------------------- */}
      <footer className="mx-auto flex w-full max-w-md sm:max-w-lg md:max-w-5xl items-center justify-center gap-4 sm:gap-6 py-2 text-xs text-text-subtle">
        <a href="#" className="hover:text-text-main transition">Privacy</a>
        <span>&bull;</span>
        <a href="#" className="hover:text-text-main transition">Terms</a>
        <span>&bull;</span>
        <a href="#" className="hover:text-text-main transition">Status</a>
      </footer>
    </div>
  );
}

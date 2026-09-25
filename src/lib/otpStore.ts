/**
 * ==============================================================================
 * Simple In-Memory OTP Store
 * ==============================================================================
 * Beginner Note:
 * This file temporarily stores OTP codes in memory while your server is running.
 * It works just like a simple dictionary: { "user@email.com": "548291" }
 */

// 1. MASTER OTP: A secret code that always lets you log in for easy testing
export const MASTER_OTP = "123456";

// 2. Simple storage dictionary
// (We attach it to globalThis so Next.js doesn't reset it when you save files)
const store: Record<string, string> = (globalThis as any)._otpStore || {};
(globalThis as any)._otpStore = store;

/**
 * Save an OTP for a user's email
 */
export function saveOtp(email: string, code: string) {
  store[email.trim().toLowerCase()] = code;
}

/**
 * Get the saved OTP for a user's email
 */
export function getStoredOtp(email: string): string | null {
  return store[email.trim().toLowerCase()] || null;
}

/**
 * Clear the OTP after successful login (optional cleanup)
 */
export function clearStoredOtp(email: string) {
  delete store[email.trim().toLowerCase()];
}

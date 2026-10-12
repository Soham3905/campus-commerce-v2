import { NextResponse } from "next/server";
import { THEMES_REGISTRY } from "@/sdui/themeBundle";
import { validateThemeStrict, StrictThemeValidationResult } from "@/sdui/validators/validator";

/**
 * ==============================================================================
 * Backend Theme Validation API: GET /api/themes/validate
 * ==============================================================================
 * 🎓 Beginner Note:
 * This is our Check 1 (Backend Validation).
 *
 * How it works:
 * 1. Takes all themes from our theme bundle (theme1, theme2, theme3).
 * 2. Runs validateThemeStrict() on each theme on the server.
 * 3. Sends back a simple JSON with the results (isValid, isDisabled, errors).
 * ==============================================================================
 */
export async function GET() {
  const results: Record<string, StrictThemeValidationResult> = {};

  // Inspect each theme against the SDUI rulebook
  for (const [themeId, schema] of Object.entries(THEMES_REGISTRY)) {
    results[themeId] = validateThemeStrict(schema, themeId);
  }

  // Send the validation result back to the frontend
  return NextResponse.json({
    success: true,
    results,
  });
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { THEMES_REGISTRY } from "@/sdui/themeBundle";
import { validateThemeStrict, StrictThemeValidationResult } from "@/sdui/validators/validator";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, StrictThemeValidationResult> = {};

  const themeFiles: Record<string, string> = {
    theme1: path.join(process.cwd(), "src/sdui/themeBundle/theme1.json"),
    theme2: path.join(process.cwd(), "src/sdui/themeBundle/theme2.json"),
    theme3: path.join(process.cwd(), "src/sdui/themeBundle/theme3.json"),
  };

  const themesToValidate: Record<string, any> = { ...THEMES_REGISTRY };

  for (const [themeId, filePath] of Object.entries(themeFiles)) {
    try {
      if (fs.existsSync(filePath)) {
        themesToValidate[themeId] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      }
    } catch (err) {
      console.error(`[Validate API] Failed to read ${filePath}:`, err);
    }
  }

  themesToValidate.landing_schema = themesToValidate.theme1;
  themesToValidate.clean_white = themesToValidate.theme2;
  themesToValidate.black_minimal = themesToValidate.theme3;

  for (const [themeId, schema] of Object.entries(themesToValidate)) {
    results[themeId] = validateThemeStrict(schema, themeId);
  }

  return NextResponse.json({
    success: true,
    results,
  });
}

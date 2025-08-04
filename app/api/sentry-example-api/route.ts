import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Simulate an error for testing Sentry
  console.error(
    "This error is raised on the backend called by the example page.",
  );
  return NextResponse.json({ data: "Testing Sentry Error..." });
}

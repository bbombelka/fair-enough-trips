import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export function proxy(req: NextRequest, event: NextFetchEvent) {
  const country = req.headers.get("x-vercel-ip-country") || "";
  const blockedCountries = ["CN", "HK", "SG"];

  if (blockedCountries.includes(country)) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  const userAgent = req.headers.get("user-agent") || "";

  if (userAgent.toLowerCase().includes("googlebot")) {
    const url = new URL("/api/track-googlebot", req.url);
    event.waitUntil(
      fetch(url.toString(), {
        method: "POST",
      }).catch((err) => console.error("Failed to track Googlebot:", err))
    );
  }

  return NextResponse.next();
}

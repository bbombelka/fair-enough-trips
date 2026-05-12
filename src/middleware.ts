import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export function middleware(req: NextRequest, event: NextFetchEvent) {
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

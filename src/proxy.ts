import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") || "";
  const blockedCountries = ["CN", "HK", "SG"];

  if (blockedCountries.includes(country)) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  return NextResponse.next();
}

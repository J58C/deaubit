//app/api/report/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sendAbuseReportEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeAndValidateUrl, sanitizeInput } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  
  const limit = await checkRateLimit(ip, "report_abuse"); 
  
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many reports. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { linkUrl, reason, details, contact } = body;

    if (!linkUrl || !reason) {
        return NextResponse.json({ error: "Link and Reason are required." }, { status: 400 });
    }

    const validUrl = sanitizeAndValidateUrl(linkUrl);
    if (!validUrl) {
        return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
    }

    await sendAbuseReportEmail({
        linkUrl: validUrl,
        reason: sanitizeInput(reason),
        details: sanitizeInput(details || ""),
        reporter: sanitizeInput(contact || "")
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Report Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

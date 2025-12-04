// app/api/links/[slug]/stats/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, verifyUserJWT } from "@/lib/auth";

function getUser(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserJWT(token);
}

type ClickData = {
  clickedAt: Date;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  referrer: string | null;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const user = getUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await context.params;

    const link = await prisma.shortLink.findUnique({
      where: { slug },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (link.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const clicks = (await prisma.click.findMany({
      where: { shortLinkId: link.id },
      select: {
        clickedAt: true,
        browser: true,
        os: true,
        country: true,
        city: true,
        referrer: true,
      },
      orderBy: { clickedAt: "desc" },
    })) as ClickData[];

    const last7Days = new Array(7)
      .fill(0)
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      })
      .reverse();

    const chartData = last7Days.map((date) => {
      return {
        date,
        count: clicks.filter((c) =>
          c.clickedAt.toISOString().startsWith(date)
        ).length,
      };
    });

    const cleanReferrer = (url: string | null) => {
        if (!url || url.includes("Direct")) return "Direct / Unknown";
        try {
            return new URL(url).hostname.replace("www.", "");
        } catch {
            return url;
        }
    };

    const groupBy = (key: keyof ClickData, cleanFn?: (val: string | null) => string) => {
      const counts: Record<string, number> = {};
      
      clicks.forEach((c) => {
        if (key === 'clickedAt') return;
        let val = (c[key] as string) || "Unknown";
        if (cleanFn) val = cleanFn(val);
        counts[val] = (counts[val] || 0) + 1;
      });

      return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    };

    return NextResponse.json({
      total: clicks.length,
      chartData,
      topBrowsers: groupBy("browser"),
      topOS: groupBy("os"),
      topCountries: groupBy("country"),
      topReferrers: groupBy("referrer", cleanReferrer),
      recentClicks: clicks.slice(0, 10),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

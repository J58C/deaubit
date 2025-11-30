//app/api/links/[slug]/stat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, verifyAdminJWT } from "@/lib/auth";

async function ensureAuth(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token || !verifyAdminJWT(token)) {
    throw new Error("Unauthorized");
  }
}

type ClickData = {
  clickedAt: Date;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureAuth(req);

    const { slug } = await context.params;

    const link = await prisma.shortLink.findUnique({
      where: { slug },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const clicks = (await prisma.click.findMany({
      where: { shortLinkId: link.id },
      select: {
        clickedAt: true,
        browser: true,
        os: true,
        country: true,
        city: true,
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

    const groupBy = (key: keyof ClickData) => {
      const counts: Record<string, number> = {};
      
      clicks.forEach((c) => {
        if (key === 'clickedAt') return;
        const val = (c[key] as string) || "Unknown";
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
      recentClicks: clicks.slice(0, 10),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Unauthorized or Error" },
      { status: 401 }
    );
  }
}

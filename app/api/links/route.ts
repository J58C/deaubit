import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRandomSlug } from "@/lib/slug";

async function ensureAuth(req: NextRequest) {
  return;
}

export async function GET(req: NextRequest) {
  await ensureAuth(req);

  const links = await prisma.shortLink.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  await ensureAuth(req);

  const body = await req.json();
  const targetUrl = String(body.targetUrl || "").trim();
  let slug = (body.slug ? String(body.slug) : "").trim();

  if (!targetUrl || !targetUrl.startsWith("http")) {
    return NextResponse.json(
      { error: "Target URL tidak valid. Sertakan http(s)://" },
      { status: 400 },
    );
  }

  if (!slug) {
    while (true) {
      const candidate = generateRandomSlug(6);
      const existing = await prisma.shortLink.findUnique({
        where: { slug: candidate },
      });
      if (!existing) {
        slug = candidate;
        break;
      }
    }
  } else {
    const exists = await prisma.shortLink.findUnique({
      where: { slug },
    });
    if (exists) {
      return NextResponse.json(
        { error: "Slug sudah digunakan. Pilih slug lain." },
        { status: 400 },
      );
    }
  }

  const link = await prisma.shortLink.create({
    data: { slug, targetUrl },
  });

  return NextResponse.json(link, { status: 201 });
}

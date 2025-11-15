//app/api/public-links/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRandomSlug } from "@/lib/slug";

interface CreateLinkRequest {
  targetUrl?: string;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Payload tidak valid." },
      { status: 400 }
    );
  }

  const targetUrl = String((body as CreateLinkRequest)?.targetUrl || "").trim();

  if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
    return NextResponse.json(
      { error: "Target URL tidak valid. Sertakan http(s)://" },
      { status: 400 }
    );
  }

  let slug: string;

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

  const link = await prisma.shortLink.create({
    data: { slug, targetUrl },
  });

  return NextResponse.json(
    {
      id: link.id,
      slug: link.slug,
      targetUrl: link.targetUrl,
      createdAt: link.createdAt,
    },
    { status: 201 }
  );
}

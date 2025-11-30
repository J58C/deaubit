//app/api/links/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRandomSlug } from "@/lib/slug";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE_NAME, verifyAdminJWT } from "@/lib/auth";

async function ensureAuth(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token || !verifyAdminJWT(token)) {
    throw new Error("Unauthorized");
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureAuth(req);
    const links = await prisma.shortLink.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(links);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureAuth(req);

    const body = await req.json();
    const targetUrl = String(body.targetUrl || "").trim();
    let slug = (body.slug ? String(body.slug) : "").trim();
    
    const passwordInput = body.password ? String(body.password) : null;
    const expiresAtInput = body.expiresAt ? new Date(body.expiresAt) : null;

    if (!targetUrl || !targetUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Target URL tidak valid. Sertakan http(s)://" },
        { status: 400 }
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
          { status: 400 }
        );
      }
    }

    let passwordHash = null;
    if (passwordInput) {
      passwordHash = await bcrypt.hash(passwordInput, 10);
    }

    const link = await prisma.shortLink.create({
      data: { 
        slug, 
        targetUrl,
        password: passwordHash,
        expiresAt: expiresAtInput
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

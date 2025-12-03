// app/api/links/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, verifyUserJWT } from "@/lib/auth";

function getUser(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserJWT(token);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const user = getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug: rawSlug } = await context.params;
  const slug = decodeURIComponent(rawSlug);

  const existing = await prisma.shortLink.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Shortlink tidak ditemukan." },
      { status: 404 },
    );
  }

  if (existing.userId !== user.id) {
    return NextResponse.json(
      { error: "Forbidden: Anda bukan pemilik link ini." },
      { status: 403 },
    );
  }

  await prisma.shortLink.delete({
    where: { id: existing.id },
  });

  return NextResponse.json({ ok: true });
}

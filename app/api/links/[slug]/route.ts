import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function ensureAuth(req: NextRequest) {
  return;
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  await ensureAuth(req);

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

  await prisma.shortLink.delete({
    where: { id: existing.id },
  });

  return NextResponse.json({ ok: true });
}

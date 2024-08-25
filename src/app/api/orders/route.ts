import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Make sure to import your Prisma client correctly.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId as string },
      })
    : await prisma.order.findMany(); // Fetch all orders if no orderId is provided.

  if (!order || (Array.isArray(order) && order.length === 0)) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

import { NextResponse } from "next/server";

import axios from "axios";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const paymentId = searchParams.get("paymentId");

  const orderId = searchParams.get("orderId");

  const productId = searchParams.get("productId");  

  // Check if the order exists

  const order = await prisma.order.findUnique({
    where: { id: orderId as string },
  });
  
  if (!order) {
    // If the order does not exist, return an error response

    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  // faça a chamada para a API do Mercado Pago para verificar o status do pagamento

  const response = await axios.get(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`,
      },
    }
  );
  const paymentStatus = response.data.status;
  console.log(paymentStatus === "pending");

  if (paymentStatus === "pending") {
    // atualize o banco de dados

    await prisma.order.update({
      where: { id: orderId as string },

      data: { status: "APPROVED" },
    });

    // redirecione para a tela de sucesso

    return NextResponse.redirect(`https://localhost:3000/success`);
  }

  return NextResponse.redirect(`https://localhost:3000/checkout/${productId}`);
}

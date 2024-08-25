import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { payment } from "@/lib/mercadopago";
import { z } from "zod";

const checkoutSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(10, "Phone must have at least 10 characters"),
  customerCPF: z.string().min(11, "CPF must have at least 11 characters"),
  customerEmail: z.string().email("Invalid email"),
});

export async function POST(request: Request) {
  const { productId, customerName, customerPhone, customerCPF, customerEmail } =
    await request.json();

  try {
    const checkoutData = checkoutSchema.parse({
      productId,
      customerName,
      customerPhone,
      customerCPF,
      customerEmail,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    throw error;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Create an order
  const order = await prisma.order.create({
    data: {
      productId,
      customerName,
      customerPhone,
      customerCPF,
      customerEmail,
      status: "PENDING",
      paymentMethod: "Pix",
    },
  });

  // Generate qrCode Pix Payment
  const paymentBody = {
    transaction_amount: product.price,
    description: `Payment for ${product.name}`,
    payment_method_id: "pix",
    payer: {
      email: customerEmail,
      identification: {
        type: "CPF",
        number: customerCPF,
      },
    },
  };

  try {
    const paymentResponse = await payment.create({
      body: paymentBody,
      
    });

    return NextResponse.json({ orderId: order.id, payment: paymentResponse });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Payment creation failed", details: error },
      { status: 500 }
    );
  }
}


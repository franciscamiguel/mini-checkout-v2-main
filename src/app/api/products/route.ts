import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Define a schema for the product data
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Invalid image URL").optional(),
  price: z.number().positive("Price must be a positive number"),
});

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const { name, description, image, price } = await req.json();

    const productData = productSchema.parse({
      name,
      description,
      image,
      price,
    });

    const newProduct = await prisma.product.create({
      data: {
        name: productData.name,
        image: productData.image ?? "", 
        price: productData.price,
        description: productData.description,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/products:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Handle GET request
export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

const productIdSchema = z.string().uuid("Invalid product ID");

// Handle DELETE request
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const productId = productIdSchema.parse(id);

    await prisma.product.delete({ where: { id: productId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    throw error;
  }
}

// Handle PUT request
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const productId = productIdSchema.parse(id);

    const { name, description, image, price } = await req.json();

    const productData = productSchema.parse({
      name,
      description,
      image,
      price,
    });

    await prisma.product.update({
      where: { id: productId },
      data: productData,
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    throw error;
  }
}

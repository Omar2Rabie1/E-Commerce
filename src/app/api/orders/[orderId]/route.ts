import { NextResponse } from "next/server";
import { getUserToken } from "@/Helpers/getUserToken";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const token = await getUserToken();
    
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
    }

    // Fetch single order by ID
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/${orderId}`, {
      headers: { token: token + "" },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch order";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/auth";

export async function POST(request: Request) {
  try {
    // ✅ SAFE: Server-side authentication check
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { 
          status: "error",
          message: "Unauthorized - Please login" 
        },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await request.json();

    // ✅ SAFE: Validate input
    if (!productId) {
      return NextResponse.json(
        { 
          status: "error",
          message: "Product ID is required" 
        },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { 
          status: "error",
          message: "Quantity must be greater than 0" 
        },
        { status: 400 }
      );
    }

    // ✅ SAFE: Get user token from session
    const userToken = session.token;
    
    if (!userToken) {
      return NextResponse.json(
        { 
          status: "error",
          message: "Authentication token not found" 
        },
        { status: 401 }
      );
    }

    // ✅ SAFE: Call external API
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": userToken,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          status: "error",
          message: errorData.message || `HTTP ${response.status}: Failed to add to cart` 
        },
        { status: response.status }
      );
    }

    const cartData = await response.json();

    return NextResponse.json({
      status: "success",
      message: "Product added to cart successfully",
      data: cartData
    });

  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json(
      { 
        status: "error",
        message: "Internal server error" 
      },
      { status: 500 }
    );
  }
}

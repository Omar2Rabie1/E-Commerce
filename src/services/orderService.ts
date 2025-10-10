// src/services/orderService.ts
import { OrdersResponse } from '@/src/interfaces/order';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';

// تعريف نوع دقيق للسيشن
interface SessionUser {
  token?: string;
  name?: string;
  email?: string;
  image?: string;
  id?: string;
}

interface SessionWithToken {
  token?: string;
  user?: SessionUser;
}

export async function getOrders(page: number = 1, limit: number = 10): Promise<OrdersResponse> {
  try {
    const session = await getServerSession(authOptions) as SessionWithToken;

    if (!session) {
      throw new Error('No session found. User must be authenticated.');
    }

    let token: string | undefined = session.token;
    
    // محاولة جلب التوكن من أماكن مختلفة
    if (session.token) {
      token = session.token;
    }
    // } else if (session.user?.token) {
    //   token = session.user.token;
    // }

    if (!token) {
      console.log('Session structure:', JSON.stringify(session, null, 2));
      throw new Error('Authentication token not found in session.');
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders?page=${page}&limit=${limit}`,
      {
        headers: {
          'token': token,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred while fetching orders.');
    }
  }
}
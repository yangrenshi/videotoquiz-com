import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createWaffoCheckoutSession } from '@/lib/waffo';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to proceed with checkout', requiresLogin: true },
        { status: 401 }
      );
    }

    const body = await req.json();
    const plan = body.plan === 'monthly' ? 'monthly' : 'onetime';

    const result = await createWaffoCheckoutSession({
      plan,
      userId: user.id,
      userEmail: user.email,
    });

    if ('error' in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: result.checkoutUrl,
    });
  } catch (err: any) {
    console.error('[WaffoCheckoutRoute] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error creating checkout' },
      { status: 500 }
    );
  }
}

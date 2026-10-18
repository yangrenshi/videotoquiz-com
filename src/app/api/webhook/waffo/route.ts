import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@waffo/pancake-ts';
import { getDb } from '@/lib/d1';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signatureHeader = req.headers.get('x-waffo-signature') || req.headers.get('X-Waffo-Signature');

    if (!signatureHeader) {
      console.warn('[WaffoWebhook] Missing X-Waffo-Signature header');
      return NextResponse.json({ message: 'Missing signature' }, { status: 400 });
    }

    let event: any;
    try {
      event = verifyWebhook(rawBody, signatureHeader);
    } catch (err: any) {
      console.error('[WaffoWebhook] Signature verification failed:', err?.message || err);
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const eventType = event.eventType || event.type;
    console.log('[WaffoWebhook] Received event:', eventType);

    // 订单完成 / 订阅激活
    if (
      eventType === 'order.completed' ||
      eventType === 'PAYMENT_NOTIFICATION' ||
      eventType === 'subscription.activated'
    ) {
      const order = event.data?.order || event.result || event.data;
      const metadata = order?.metadata || {};
      const userId = metadata.userId || order?.buyerIdentity;
      const plan = metadata.plan;

      if (!userId) {
        console.warn('[WaffoWebhook] No userId found in order metadata');
        return NextResponse.json({ message: 'No userId associated' }, { status: 200 });
      }

      // 根据购买的套餐充值相应额度
      // onetime ($4.99) -> 25 次完整测试 pass = 125 积分
      // monthly ($9.99) -> 200 次完整测试 pass = 1000 积分
      const creditsToAdd = plan === 'monthly' ? 1000 : 125;

      const db = getDb();
      await db.addCredits(
        userId,
        creditsToAdd,
        `PURCHASE_WAFFO_${(plan || 'ONETIME').toUpperCase()}`,
        {
          orderId: order?.id || order?.orderId,
          amount: order?.amount || order?.totalAmount,
          currency: order?.currency || 'USD',
          provider: 'waffo',
        }
      );

      console.log(`[WaffoWebhook] Successfully granted ${creditsToAdd} credits to user ${userId}`);
    }

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (err: any) {
    console.error('[WaffoWebhook] Server error:', err);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}

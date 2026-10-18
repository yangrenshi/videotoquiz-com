import { WaffoPancake } from '@waffo/pancake-ts';

// 懒加载单例模式初始化 Waffo Pancake 客户端
let waffoClientInstance: WaffoPancake | null = null;

function formatPrivateKey(rawKey: string): string {
  let key = rawKey.trim().replace(/\\n/g, '\n');
  if (!key.includes('-----BEGIN PRIVATE KEY-----') && !key.includes('-----BEGIN RSA PRIVATE KEY-----')) {
    // 自动按 64 字符换行并包裹 PEM 标准头尾
    const chunks = key.match(/.{1,64}/g) || [key];
    key = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----`;
  }
  return key;
}

export function getWaffoClient(): WaffoPancake | null {
  const merchantId = process.env.WAFFO_MERCHANT_ID;
  const rawPrivateKey = process.env.WAFFO_PRIVATE_KEY;

  if (!merchantId || !rawPrivateKey) {
    return null;
  }

  if (!waffoClientInstance) {
    waffoClientInstance = new WaffoPancake({
      merchantId,
      privateKey: formatPrivateKey(rawPrivateKey),
    });
  }

  return waffoClientInstance;
}

export interface WaffoCheckoutOptions {
  plan: 'onetime' | 'monthly';
  userId: string;
  userEmail: string;
}

/**
 * 发起 Waffo Pancake 结账会话
 */
export async function createWaffoCheckoutSession({
  plan,
  userId,
  userEmail,
}: WaffoCheckoutOptions): Promise<{ checkoutUrl: string } | { error: string }> {
  const client = getWaffoClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.videotoquiz.com';

  const productId =
    plan === 'onetime'
      ? process.env.WAFFO_PRODUCT_ID_ONETIME
      : process.env.WAFFO_PRODUCT_ID_MONTHLY;

  if (!productId) {
    return {
      error: `Waffo Product ID for ${plan} plan is not configured. Please set WAFFO_PRODUCT_ID_${plan.toUpperCase()} in environment variables.`,
    };
  }

  if (!client) {
    // 若未配置凭据，返回友好说明
    return {
      error: 'Waffo credentials (WAFFO_MERCHANT_ID / WAFFO_PRIVATE_KEY) not configured on server.',
    };
  }

  try {
    const session = await client.checkout.createSession({
      productId,
      currency: 'USD',
      buyerEmail: userEmail,
      metadata: {
        userId,
        plan,
      },
      successUrl: `${siteUrl}?payment=success&provider=waffo&plan=${plan}`,
      darkMode: true,
    });

    return { checkoutUrl: session.checkoutUrl };
  } catch (err: any) {
    console.error('[Waffo] Failed to create checkout session:', err?.message || err);
    return { error: err?.message || 'Failed to create checkout session with Waffo' };
  }
}

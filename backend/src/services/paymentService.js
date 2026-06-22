import crypto from 'crypto';
import Razorpay from 'razorpay';

export const REGISTRATION_AMOUNT_PAISE = 100;
export const REGISTRATION_CURRENCY = 'INR';

let razorpayClient;

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error(`[Payment] RAZORPAY_NOT_CONFIGURED | ts=${new Date().toISOString()} reason="RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing"`);
    const error = new Error('Razorpay is not configured');
    error.statusCode = 503;
    error.code = 'RAZORPAY_NOT_CONFIGURED';
    throw error;
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayClient;
}

export async function createRegistrationOrder({ attendeeName, attendeeEmail }) {
  const client = getRazorpayClient();
  const receipt = `reg_${Date.now()}`;

  console.log(`[Payment] RAZORPAY_API_CALL | ts=${new Date().toISOString()} receipt=${receipt} amount=${REGISTRATION_AMOUNT_PAISE} currency=${REGISTRATION_CURRENCY}`);
  const t0 = Date.now();
  try {
    const order = await client.orders.create({
      amount: REGISTRATION_AMOUNT_PAISE,
      currency: REGISTRATION_CURRENCY,
      receipt,
      notes: {
        attendeeName,
        attendeeEmail,
        purpose: 'registration',
      },
    });
    console.log(`[Payment] RAZORPAY_API_SUCCESS | ts=${new Date().toISOString()} orderId=${order.id} receipt=${receipt} durationMs=${Date.now() - t0}`);
    return order;
  } catch (err) {
    console.error(`[Payment] RAZORPAY_API_ERROR | ts=${new Date().toISOString()} receipt=${receipt} error="${err.message}" statusCode=${err.statusCode ?? 'N/A'} durationMs=${Date.now() - t0}`);
    throw err;
  }
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    const error = new Error('Razorpay is not configured');
    error.statusCode = 503;
    error.code = 'RAZORPAY_NOT_CONFIGURED';
    throw error;
  }

  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(payload)
    .digest('hex');

  const received = Buffer.from(signature, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');

  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

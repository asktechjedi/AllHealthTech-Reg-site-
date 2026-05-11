import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order.
 * @param {number} amount - Amount in paise
 * @param {string} currency - Currency code (e.g. "INR")
 * @param {string} receiptId - Receipt identifier (ticketId)
 * @returns {Promise<object>} Razorpay order object
 */
export async function createOrder(amount, currency, receiptId) {
  const order = await razorpay.orders.create({
    amount,
    currency,
    receipt: receiptId,
  });
  return order;
}

/**
 * Verify Razorpay payment signature using HMAC-SHA256.
 * @param {string} razorpayOrderId
 * @param {string} razorpayPaymentId
 * @param {string} razorpaySignature
 * @returns {boolean}
 */
export function verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === razorpaySignature;
}

/**
 * Initiate a refund for a Razorpay payment.
 * @param {string} razorpayPaymentId - The Razorpay payment ID to refund
 * @param {number} amount - Amount to refund in paise
 * @returns {Promise<object>} Razorpay refund object
 */
export async function initiateRefund(razorpayPaymentId, amount) {
  const refund = await razorpay.payments.refund(razorpayPaymentId, { amount });
  return refund;
}

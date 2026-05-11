import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate.js';
import { transporter } from '../services/emailService.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

router.post('/', validate(contactSchema), async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    await transporter.sendMail({
      from: process.env.ORGANIZER_EMAIL,
      to: process.env.ORGANIZER_EMAIL,
      replyTo: email,
      subject: `[Contact Form] ${subject} - from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #1e40af;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; width: 30%; background: #f3f4f6; border: 1px solid #e5e7eb;">Name</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; background: #f3f4f6; border: 1px solid #e5e7eb;">Email</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; background: #f3f4f6; border: 1px solid #e5e7eb;">Subject</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; background: #f3f4f6; border: 1px solid #e5e7eb; vertical-align: top;">Message</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: 'Your message has been sent successfully',
    });
  } catch (err) {
    next(err);
  }
});

export default router;

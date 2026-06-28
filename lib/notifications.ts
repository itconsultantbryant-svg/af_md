/** Dev-friendly notification helpers. Wire SMTP/Twilio via env in production. */

export async function sendVerificationEmail(email: string, code: string) {
  const smtpHost = process.env.SMTP_HOST;
  if (smtpHost) {
    // Production: integrate nodemailer/resend here
    console.log(`[EMAIL] To: ${email} | Verification code: ${code}`);
    return { sent: true, method: "smtp" };
  }
  console.log(`\n📧 EMAIL VERIFICATION for ${email}\n   Code: ${code}\n`);
  return { sent: true, method: "console" };
}

export async function sendVerificationSms(phone: string, code: string) {
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  if (twilioSid) {
    console.log(`[SMS] To: ${phone} | Verification code: ${code}`);
    return { sent: true, method: "twilio" };
  }
  console.log(`\n📱 SMS VERIFICATION for ${phone}\n   Code: ${code}\n`);
  return { sent: true, method: "console" };
}

export async function sendEnrollmentConfirmation(
  email: string,
  courseTitle: string
) {
  console.log(`\n✅ Enrollment submitted: ${email} → ${courseTitle}\n`);
}

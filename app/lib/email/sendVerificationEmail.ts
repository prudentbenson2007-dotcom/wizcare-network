import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type VerificationEmailInput = {
  email: string;
  name: string;
  code: string;
};

export async function sendVerificationEmail({
  email,
  name,
  code,
}: VerificationEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Your WizCare Network verification code",
    html: `
      <div style="font-family: Arial, sans-serif; background:#020617; padding:40px 20px;">
        <div style="max-width:560px; margin:0 auto; background:#0f172a; border-radius:24px; padding:40px; color:#ffffff;">
          <div style="text-align:center;">
            <div style="font-size:28px; font-weight:800;">
              WizCare <span style="color:#22d3ee;">Network</span>
            </div>

            <p style="color:#94a3b8; font-size:12px; letter-spacing:2px;">
              INTELLIGENT CARE. HUMAN CONNECTION.
            </p>
          </div>

          <h1 style="margin-top:36px; font-size:28px;">
            Verify your email
          </h1>

          <p style="color:#cbd5e1; line-height:1.7;">
            Hello ${name},
          </p>

          <p style="color:#cbd5e1; line-height:1.7;">
            Use the verification code below to confirm your email address
            and continue setting up your WizCare Network account.
          </p>

          <div style="margin:32px 0; padding:24px; background:#020617; border:1px solid #164e63; border-radius:18px; text-align:center;">
            <p style="margin:0 0 10px; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:2px;">
              Verification code
            </p>

            <div style="font-size:38px; font-weight:800; letter-spacing:10px; color:#22d3ee;">
              ${code}
            </div>
          </div>

          <p style="color:#94a3b8; font-size:14px; line-height:1.7;">
            This code will expire in 60 seconds. If you did not create a
            WizCare Network account, you can safely ignore this email.
          </p>

          <p style="margin-top:32px; color:#64748b; font-size:12px;">
            WizCare Network security notification
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(
      error.message || "Verification email could not be sent.",
    );
  }

  console.log("Verification email sent successfully:", data?.id);
}
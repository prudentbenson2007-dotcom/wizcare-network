import { NextResponse } from "next/server";
import { createHash, randomInt } from "crypto";
import { prisma } from "@/app/lib/prisma";
import { sendVerificationEmail } from "@/app/lib/email/sendVerificationEmail";

type ResendRequest = {
  email?: string;
};

function hashVerificationCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

function createVerificationCode() {
  return randomInt(100000, 1000000).toString();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResendRequest;
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "We could not find an account with that email address.",
        },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return NextResponse.json({
        success: true,
        message: "Your email is already verified.",
      });
    }

    const verificationCode = createVerificationCode();
    const verificationCodeHash = hashVerificationCode(verificationCode);

    const verificationExpiresAt = new Date(Date.now() + 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCodeHash,
        verificationExpiresAt,
        verificationAttempts: 0,
      },
    });

    try {
      await sendVerificationEmail({
        email,
        name: user.name?.split(" ")[0] || "there",
        code: verificationCode,
      });
    } catch (emailError) {
      console.error("Verification email error:", emailError);

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not send the new verification email. Please try again.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "A new verification code has been sent to your email.",
      expiresInSeconds: 60,
    });
  } catch (error) {
    console.error("Verification code resend error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send a new verification code right now.",
      },
      { status: 500 },
    );
  }
}
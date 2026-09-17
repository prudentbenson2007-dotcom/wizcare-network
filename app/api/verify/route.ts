import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/app/lib/prisma";

type VerifyRequest = {
  email?: string;
  code?: string;
};

function hashVerificationCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyRequest;

    const email = body.email?.trim().toLowerCase();
    const code = body.code?.trim();

    if (!email || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address and verification code are required.",
        },
        { status: 400 },
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code must contain exactly 6 digits.",
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

    if (
      user.verificationAttempts >= 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many incorrect verification attempts. Please request a new code.",
        },
        { status: 429 },
      );
    }

    if (
      !user.verificationExpiresAt ||
      user.verificationExpiresAt.getTime() < Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This verification code has expired. Please request a new code.",
        },
        { status: 410 },
      );
    }

    if (!user.verificationCodeHash) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No active verification code exists. Please request a new code.",
        },
        { status: 400 },
      );
    }

    const submittedCodeHash = hashVerificationCode(code);

    if (submittedCodeHash !== user.verificationCodeHash) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationAttempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "The verification code is incorrect.",
        },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCodeHash: null,
        verificationExpiresAt: null,
        verificationAttempts: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Email verified successfully. Your WizCare account is now verified.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify your email right now.",
      },
      { status: 500 },
    );
  }
}
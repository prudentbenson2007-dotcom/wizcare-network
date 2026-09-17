import { NextResponse } from "next/server";
import { createHash, randomInt, randomBytes, scryptSync } from "crypto";
import { prisma } from "@/app/lib/prisma";
import { sendVerificationEmail } from "@/app/lib/email/sendVerificationEmail";

type RegisterRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
};

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${derivedKey}`;
}

function hashVerificationCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

function createVerificationCode() {
  return randomInt(100000, 1000000).toString();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequest;

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const password = body.password;

    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All registration fields are required.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must contain at least 8 characters.",
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 },
      );
    }

    const passwordHash = hashPassword(password);
    const verificationCode = createVerificationCode();
    const verificationCodeHash = hashVerificationCode(verificationCode);

    const verificationExpiresAt = new Date(
      Date.now() + 60 * 1000,
    );

    const user = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        phone,
        passwordHash,
        role: "PATIENT",
        isVerified: false,
        isActive: true,
        verificationCodeHash,
        verificationExpiresAt,
        verificationAttempts: 0,
        patient: {
          create: {},
        },
      },
      include: {
        patient: true,
      },
    });

    try {
      await sendVerificationEmail({
        email,
        name: firstName,
        code: verificationCode,
      });
    } catch (emailError) {
      console.error("Verification email error:", emailError);

      await prisma.user.delete({
        where: { id: user.id },
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not send the verification email. Please try again.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created. A verification code has been sent to your email.",
        userId: user.id,
        email,
        requiresEmailVerification: true,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Patient registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create the account right now.",
      },
      { status: 500 },
    );
  }
}
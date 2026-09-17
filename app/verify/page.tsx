"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function VerifyForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");

    if (emailFromUrl) {
      setEmail(emailFromUrl);
      window.localStorage.setItem(
        "wizcare_verification_email",
        emailFromUrl,
      );
      return;
    }

    const savedEmail = window.localStorage.getItem(
      "wizcare_verification_email",
    );

    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [searchParams]);

  useEffect(() => {
    if (verified || secondsRemaining <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [secondsRemaining, verified]);

  function handleCodeChange(value: string) {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);

    setCode(digitsOnly);
    setErrorMessage("");
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setMessage("");

    if (!email.trim()) {
      setErrorMessage(
        "Please enter the email address used to create your account.",
      );
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.message || "We could not verify your email address.",
        );
        return;
      }

      setVerified(true);
      setMessage(
        data.message ||
          "Email verified successfully. Your WizCare account is now verified.",
      );

      window.localStorage.removeItem("wizcare_verification_email");
    } catch (error) {
      console.error("Verification request error:", error);

      setErrorMessage(
        "We could not connect to WizCare Network. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setErrorMessage("");
    setMessage("");

    if (!email.trim()) {
      setErrorMessage(
        "Please enter the email address used to create your account.",
      );
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch("/api/verify/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.message || "We could not send a new verification code.",
        );
        return;
      }

      setCode("");
      setSecondsRemaining(60);
      setMessage(
        data.message || "A new verification code has been sent to your email.",
      );
    } catch (error) {
      console.error("Resend verification request error:", error);

      setErrorMessage(
        "We could not connect to WizCare Network. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  }

  if (verified) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-emerald-400/20 bg-slate-900/80 p-8 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10 text-4xl">
              ✓
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              WizCare Network
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Email verified
            </h1>

            <p className="mx-auto mt-4 max-w-md leading-7 text-slate-300">
              {message}
            </p>

            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex rounded-2xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Continue to WizCare
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl border border-cyan-400/10 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              WizCare Network
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Verify your email
            </h1>

            <p className="mx-auto mt-4 max-w-md leading-7 text-slate-300">
              We sent a 6-digit verification code to the email address you
              used when creating your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrorMessage("");
                  setMessage("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="code"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Verification code
              </label>

              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(event) => handleCodeChange(event.target.value)}
                placeholder="000000"
                autoComplete="one-time-code"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] text-cyan-300 outline-none transition placeholder:text-slate-700 focus:border-cyan-400"
              />

              <p className="mt-2 text-center text-xs text-slate-500">
                Enter the 6 digits exactly as they appear in your email.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-4 text-center">
              {secondsRemaining > 0 ? (
                <>
                  <p className="text-sm text-slate-400">
                    Your verification code expires in
                  </p>

                  <p className="mt-1 text-2xl font-bold text-cyan-300">
                    {secondsRemaining}s
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-amber-300">
                    Your verification code has expired.
                  </p>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="mt-3 rounded-xl border border-cyan-400/30 px-5 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend Code"}
                  </button>
                </>
              )}
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200">
                {errorMessage}
              </div>
            )}

            {message && !verified && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-200">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Verify email"}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-800 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Already verified?
            </p>

            <Link
              href="/"
              className="mt-2 inline-block text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Return to WizCare Network
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
          <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
            <div className="w-full rounded-3xl border border-cyan-400/10 bg-slate-900/80 p-8 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                WizCare Network
              </p>

              <h1 className="mt-4 text-3xl font-bold">
                Loading verification...
              </h1>

              <p className="mt-4 text-slate-400">
                Please wait a moment.
              </p>
            </div>
          </div>
        </main>
      }
    >
      <VerifyForm />
    </Suspense>
  );
}
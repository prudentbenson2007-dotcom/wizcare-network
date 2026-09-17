"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PatientRegistrationPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (!acceptedTerms) {
      setErrorMessage(
        "Please accept the WizCare Network terms before continuing.",
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.message || "We could not create your account.",
        );
        return;
      }

      const registeredEmail = data.email || email.trim().toLowerCase();

      window.localStorage.setItem(
        "wizcare_verification_email",
        registeredEmail,
      );

      router.push(
        `/verify?email=${encodeURIComponent(registeredEmail)}`,
      );
    } catch (error) {
      console.error("Registration request error:", error);

      setErrorMessage(
        "We could not connect to WizCare Network. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <p className="text-2xl font-extrabold">
              WizCare{" "}
              <span className="text-cyan-400">Network</span>
            </p>
          </Link>

          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Intelligent care. Human connection.
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-400/10 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Patient account
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Create your WizCare account
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Create your secure patient account. After registration, we will
              send a verification code to your email address.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="First name"
                value={firstName}
                onChange={setFirstName}
                placeholder="Your first name"
                autoComplete="given-name"
              />

              <Input
                label="Last name"
                value={lastName}
                onChange={setLastName}
                placeholder="Your last name"
                autoComplete="family-name"
              />
            </div>

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <Input
              label="Phone number"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="Your phone number"
              autoComplete="tel"
            />

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-24 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-24 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) =>
                  setAcceptedTerms(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-cyan-400"
              />

              <span className="text-sm leading-6 text-slate-400">
                I agree to the WizCare Network terms, privacy requirements,
                and secure handling of my account information.
              </span>
            </label>

            {errorMessage && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Creating your account..."
                : "Create patient account"}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-800 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have a WizCare account?
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

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
};

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: InputProps) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-slate-200"
      >
        {label}
      </label>

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
      />
    </div>
  );
}
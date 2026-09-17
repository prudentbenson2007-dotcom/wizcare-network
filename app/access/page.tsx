"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AccountType = "patient" | "professional" | "hospital" | null;

const accountTypes = [
  {
    id: "patient" as const,
    icon: "P",
    title: "Patient",
    description:
      "Get support from Wiz, request healthcare assistance, manage appointments and follow your care journey.",
    label: "For people seeking care",
  },
  {
    id: "professional" as const,
    icon: "RN",
    title: "Healthcare Professional",
    description:
      "Build your professional profile, manage availability, receive appropriate patient requests and work with Wiz.",
    label: "For verified professionals",
  },
  {
    id: "hospital" as const,
    icon: "H",
    title: "Hospital / Organization",
    description:
      "Explore verified hospital partnership, organization access and connected healthcare services.",
    label: "For healthcare organizations",
  },
];

export default function AccessPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AccountType>(null);

  function continueToRegistration() {
    if (!selectedType) return;

    if (selectedType === "patient") {
      router.push("/register/patient");
      return;
    }

    if (selectedType === "professional") {
      router.push("/register/professional");
      return;
    }

    router.push("/register/hospital");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">
              W
            </div>

            <div>
              <p className="font-bold tracking-tight">
                WizCare <span className="text-cyan-400">Network</span>
              </p>

              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Intelligent care. Human connection.
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/5 hover:text-white"
          >
            Back
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
            Secure account access
          </div>

          <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            How will you use
            <span className="block bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              WizCare Network?
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Choose the account type that matches your role. You can continue
            once you have selected an option.
          </p>
        </div>

        {/* Account Types */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {accountTypes.map((account) => {
            const selected = selectedType === account.id;

            return (
              <button
                key={account.id}
                type="button"
                onClick={() => setSelectedType(account.id)}
                className={`group relative rounded-[2rem] border p-7 text-left transition duration-300 ${
                  selected
                    ? "border-cyan-400/50 bg-cyan-400/10 shadow-2xl shadow-cyan-500/10"
                    : "border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]"
                }`}
              >
                {selected && (
                  <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-sm font-black text-slate-950">
                    {"\u2713"}
                  </div>
                )}

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black ${
                    selected
                      ? "bg-cyan-400/20 text-cyan-300"
                      : "bg-white/5 text-slate-300"
                  }`}
                >
                  {account.icon}
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  {account.label}
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {account.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {account.description}
                </p>

                <div
                  className={`mt-7 text-sm font-semibold ${
                    selected ? "text-cyan-300" : "text-slate-300"
                  }`}
                >
                  {selected
                    ? `Selected ${"\u2713"}`
                    : `Select this account ${"\u2192"}`}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue */}
        <div className="mx-auto mt-10 max-w-md">
          <button
            type="button"
            onClick={continueToRegistration}
            disabled={!selectedType}
            className={`w-full rounded-2xl px-7 py-4 font-bold transition ${
              selectedType
                ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 shadow-xl shadow-cyan-500/20 hover:-translate-y-1 hover:shadow-cyan-500/30"
                : "cursor-not-allowed bg-white/10 text-slate-500"
            }`}
          >
            {selectedType
              ? `Continue as ${
                  selectedType === "patient"
                    ? "Patient"
                    : selectedType === "professional"
                      ? "Healthcare Professional"
                      : "Hospital / Organization"
                } ${"\u2192"}`
              : "Select an account type"}
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Secure account creation and verification will be required before
            accessing protected WizCare services.
          </p>
        </div>

        {/* Security */}
        <div className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            Secure registration
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            Email verification
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            Protected healthcare access
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs text-slate-600 sm:flex-row sm:text-left">
          <p>
            WizCare Network — Intelligent care. Human connection.
          </p>

          <p>
            Secure healthcare technology platform
          </p>
        </div>
      </footer>
    </main>
  );
}
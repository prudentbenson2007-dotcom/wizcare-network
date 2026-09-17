"use client";

import Link from "next/link";
import { useState } from "react";

type AccountType = "patient" | "professional" | "hospital" | null;

export default function AccessPage() {
  const [selectedType, setSelectedType] = useState<AccountType>(null);

  const accountTypes = [
    {
      id: "patient" as const,
      icon: "🧑‍⚕️",
      title: "Patient",
      description:
        "Get support from Wiz, request healthcare assistance, manage appointments and follow your care journey.",
      label: "For people seeking care",
    },
    {
      id: "professional" as const,
      icon: "👨‍⚕️",
      title: "Healthcare Professional",
      description:
        "Build your professional profile, manage availability, receive appropriate patient requests and work with Wiz.",
      label: "For verified professionals",
    },
    {
      id: "hospital" as const,
      icon: "🏥",
      title: "Hospital / Organization",
      description:
        "Explore verified hospital partnership, organization access and connected healthcare services.",
      label: "For healthcare organizations",
    },
  ];

  function continueToRegistration() {
    if (!selectedType) return;

    if (selectedType === "patient") {
      window.location.href = "/register/patient";
      return;
    }

    if (selectedType === "professional") {
      window.location.href = "/register/professional";
      return;
    }

    window.location.href = "/register/hospital";
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-slate-950/70 px-5 py-4 backdrop-blur-xl md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-cyan-400/20 blur-md" />

              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
                <span className="text-xl">✦</span>
              </div>
            </div>

            <div>
              <p className="font-bold">
                WizCare <span className="text-cyan-400">Network</span>
              </p>

              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Intelligent care. Human connection.
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ← Back
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10 text-3xl shadow-xl shadow-cyan-500/10">
            ❤️
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Welcome to WizCare
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            How can we care for you?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            Choose the account that matches your role. Wiz will help guide you
            through the appropriate next step.
          </p>
        </div>

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
                    ✓
                  </div>
                )}

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition ${
                    selected
                      ? "bg-cyan-400/20"
                      : "bg-white/5 group-hover:bg-cyan-400/10"
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

                <div className="mt-7 text-sm font-semibold text-cyan-300">
                  {selected ? "Selected ✓" : "Select this account →"}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-md">
          <button
            type="button"
            onClick={continueToRegistration}
            disabled={!selectedType}
            className={`w-full rounded-2xl px-7 py-4 font-bold transition ${
              selectedType
                ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 shadow-xl shadow-cyan-500/20 hover:-translate-y-1"
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
                } →`
              : "Select an account type"}
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Secure account creation and verification will be required before
            accessing protected WizCare services.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-emerald-400/10 bg-emerald-400/5 p-6">
          <div className="flex gap-4">
            <div className="text-2xl">🔐</div>

            <div>
              <h3 className="font-bold text-emerald-300">
                Your security matters
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                WizCare will use account verification, access controls and
                protected healthcare workflows. Healthcare professional and
                hospital access will also require appropriate verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 md:flex-row">
          <p>
            WizCare <span className="text-cyan-400">Network</span>
          </p>

          <p>Intelligent care. Human connection.</p>
        </div>
      </footer>
    </main>
  );
}
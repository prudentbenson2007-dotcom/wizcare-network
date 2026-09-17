"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Dialog = "care" | "profile" | "preferences" | "appointment" | "history" | null;
type RequestStatus = "idle" | "matching" | "assigned" | "arriving";
type Message = { author: "wiz" | "patient"; text: string };
type Reminder = { id: number; title: string; detail: string; complete: boolean };

const initialHistory = [
  { date: "12 Aug", title: "Blood pressure check-in", detail: "Care plan reviewed", icon: "♡" },
  { date: "30 Jul", title: "Wiz conversation", detail: "Sleep support guidance", icon: "✦" },
  { date: "18 Jul", title: "General consultation", detail: "Completed securely", icon: "✓" },
];

const initialReminders: Reminder[] = [
  { id: 1, title: "Evening wellness check-in", detail: "Today · 8:00 PM", complete: false },
  { id: 2, title: "Prepare questions for your visit", detail: "Tomorrow · Before 10:30 AM", complete: false },
];

function StatusPill({ status }: { status: RequestStatus }) {
  const text =
    status === "matching"
      ? "Matching a professional"
      : status === "assigned"
        ? "Professional assigned"
        : "Professional arriving";
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
      {text}
    </span>
  );
}

export default function PatientDashboard() {
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [requestReason, setRequestReason] = useState("I need help understanding my symptoms");
  const [requestConsent, setRequestConsent] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { author: "wiz", text: "Hello, Ada. How are you feeling today?" },
  ]);
  const [reminders, setReminders] = useState(initialReminders);
  const [newReminder, setNewReminder] = useState("");
  const [smsUpdates, setSmsUpdates] = useState(true);
  const [caregiverUpdates, setCaregiverUpdates] = useState(false);
  const [appointmentPrepared, setAppointmentPrepared] = useState(false);

  const trackingCopy = {
    idle: {
      eyebrow: "Live care tracking",
      title: "Care comes to you, with clarity.",
      detail: "Request care when you need it and follow your verified professional’s arrival in one place.",
    },
    matching: {
      eyebrow: "Care request received",
      title: "Finding the right professional",
      detail: "We’ll notify you as soon as a verified professional accepts your request.",
    },
    assigned: {
      eyebrow: "Professional assigned",
      title: "Dr. Chiamaka is preparing to leave",
      detail: "Your professional has accepted your request and will update their arrival status here.",
    },
    arriving: {
      eyebrow: "Professional arriving",
      title: "Dr. Chiamaka is on the way",
      detail: "Estimated arrival: 12 minutes. You can follow progress on the private visit map below.",
    },
  }[requestStatus];

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message) return;
    setMessages((current) => [
      ...current,
      { author: "patient", text: message },
      {
        author: "wiz",
        text: "Thank you for sharing that. I can help you think through a safe next step, or help you request a verified healthcare professional.",
      },
    ]);
    setChatInput("");
  }

  function submitRequest() {
    if (!requestConsent) return;
    setRequestStatus("matching");
    setDialog(null);
    setUnread(true);
  }

  function toggleReminder(id: number) {
    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === id ? { ...reminder, complete: !reminder.complete } : reminder,
      ),
    );
  }

  function addReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newReminder.trim();
    if (!title) return;
    setReminders((current) => [
      ...current,
      { id: Date.now(), title, detail: "Personal reminder · Today", complete: false },
    ]);
    setNewReminder("");
  }

  function closeDialog() {
    setDialog(null);
    setRequestConsent(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-44 -top-44 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <header className="relative z-30 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="WizCare Network home">
            <div className="relative flex h-11 w-11 items-center justify-center">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-cyan-400/20 blur-md" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
                <span className="animate-pulse text-lg">♥</span>
              </div>
            </div>
            <div>
              <p className="font-bold">WizCare <span className="text-cyan-400">Network</span></p>
              <p className="hidden text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:block">Intelligent care. Human connection.</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setNotificationsOpen((open) => !open)} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg transition hover:bg-white/10" aria-label="Open notifications" aria-expanded={notificationsOpen}>
              ♢
              {unread && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-400" />}
            </button>
            <button onClick={() => setMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 font-bold text-cyan-300 transition hover:bg-cyan-400/20" aria-label="Open account menu" aria-expanded={menuOpen}>A</button>
          </div>
        </div>

        {notificationsOpen && (
          <div className="absolute right-16 top-16 z-40 w-80 rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl md:right-24">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-sm font-semibold">Notifications</p>
              <button onClick={() => setUnread(false)} className="text-xs font-semibold text-cyan-300 hover:text-cyan-100">Mark all read</button>
            </div>
            <div className="space-y-2">
              <div className="rounded-xl bg-cyan-400/10 px-3 py-3 text-sm text-slate-300"><span className="font-semibold text-cyan-300">Wiz is ready.</span> Start a private check-in whenever you need support.</div>
              {requestStatus !== "idle" && <button onClick={() => { setRequestStatus("arriving"); setNotificationsOpen(false); }} className="w-full rounded-xl bg-white/5 px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-white/10"><span className="font-semibold text-cyan-300">Care request update.</span> Preview the accepted-request status.</button>}
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="absolute right-5 top-16 z-40 w-56 rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl md:right-8">
            <p className="px-3 py-2 text-sm font-semibold">Ada&apos;s account</p>
            <button onClick={() => { setDialog("profile"); setMenuOpen(false); }} className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/5 hover:text-white">Profile &amp; security</button>
            <button onClick={() => { setDialog("preferences"); setMenuOpen(false); }} className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/5 hover:text-white">Care preferences</button>
            <Link href="/" className="block rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">Sign out</Link>
          </div>
        )}
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl md:p-9">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />Wiz is ready for you</div>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">Good morning, Ada.<span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">Your care, all together.</span></h1>
            <p className="mt-5 max-w-2xl leading-7 text-slate-400">Check in with Wiz, arrange care, and keep the details that matter close. Your dashboard keeps the next step clear without replacing clinical or emergency care.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#wiz" className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-3.5 text-center font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-1">Talk to Wiz</a>
              <button onClick={() => setDialog("care")} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 font-bold transition hover:bg-white/10">Request healthcare help</button>
            </div>
          </section>

          <section id="wiz" className="rounded-[2rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 p-6" aria-labelledby="wiz-title">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl shadow-xl shadow-cyan-500/20 animate-pulse">✦</div>
              <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">AI care companion</p><h2 id="wiz-title" className="mt-1 text-xl font-black">Talk to Wiz</h2></div>
            </div>
            <div className="mt-5 h-40 space-y-3 overflow-y-auto pr-1" aria-live="polite">
              {messages.map((message, index) => <p key={`${message.author}-${index}`} className={`w-fit max-w-[92%] rounded-2xl px-4 py-2.5 text-sm leading-5 ${message.author === "patient" ? "ml-auto bg-cyan-400 text-slate-950" : "bg-slate-950/55 text-slate-200"}`}>{message.text}</p>)}
            </div>
            <form onSubmit={sendMessage} className="mt-4 flex gap-2">
              <label className="sr-only" htmlFor="wiz-message">Message Wiz</label>
              <input id="wiz-message" value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Tell Wiz what’s on your mind" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400" />
              <button className="rounded-xl bg-white/10 px-4 text-sm font-bold transition hover:bg-white/20" type="submit">Send</button>
            </form>
          </section>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Quick care actions">
          {[
            { icon: "✦", title: "Talk to Wiz", detail: "A private check-in", action: () => document.getElementById("wiz")?.scrollIntoView({ behavior: "smooth" }) },
            { icon: "!", title: "Immediate care", detail: "Request a professional", action: () => setDialog("care") },
            { icon: "⌖", title: "Track care", detail: "Follow an active visit", action: () => document.getElementById("tracking")?.scrollIntoView({ behavior: "smooth" }) },
            { icon: "□", title: "Appointments", detail: "Prepare for your visit", action: () => setDialog("appointment") },
          ].map((item) => <button key={item.title} onClick={item.action} className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]"><span className="text-2xl text-cyan-300">{item.icon}</span><h2 className="mt-4 font-bold">{item.title}</h2><p className="mt-1 text-sm text-slate-500">{item.detail}</p></button>)}
        </section>

        <section id="tracking" className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl md:p-9" aria-labelledby="tracking-title">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">{trackingCopy.eyebrow}</p><h2 id="tracking-title" className="mt-2 text-2xl font-black md:text-3xl">{trackingCopy.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{trackingCopy.detail}</p></div>
            {requestStatus !== "idle" && <StatusPill status={requestStatus} />}
          </div>
          <div className="relative mt-7 h-60 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#2b3b55_1px,transparent_1px),linear-gradient(90deg,#2b3b55_1px,transparent_1px)] [background-size:32px_32px]" />
            {requestStatus === "idle" || requestStatus === "matching" ? (
              <div className="relative flex h-full items-center justify-center text-center"><div><div className="text-4xl text-slate-500">⌖</div><p className="mt-3 font-semibold text-slate-300">{requestStatus === "matching" ? "Matching you with a verified professional" : "Your live care map will appear here"}</p><p className="mt-1 text-xs text-slate-500">{requestStatus === "matching" ? "We’ll notify you when someone accepts your request." : "Only after a professional accepts your request."}</p></div></div>
            ) : (
              <>
                <div className="absolute left-[14%] top-[63%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_0_8px_rgba(103,232,249,.14)]" />
                <div className="absolute left-[18%] top-[55%] h-[2px] w-[53%] -rotate-[18deg] bg-gradient-to-r from-cyan-300 to-violet-400" />
                <div className="absolute right-[25%] top-[31%] flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-blue-500 shadow-[0_0_0_8px_rgba(59,130,246,.15)]">+</div>
                <div className="absolute bottom-5 left-5 rounded-xl border border-white/10 bg-slate-950/85 px-4 py-3 text-sm"><p className="font-bold">Dr. Chiamaka O.</p><p className="text-xs text-cyan-300">{requestStatus === "arriving" ? "12 min away · Verified clinician" : "Preparing to leave · Verified clinician"}</p></div>
                {requestStatus === "assigned" && <button onClick={() => setRequestStatus("arriving")} className="absolute right-5 top-5 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">Show arrival progress</button>}
              </>
            )}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7" aria-labelledby="appointments-title">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Appointments</p><h2 id="appointments-title" className="mt-2 text-xl font-black">Your upcoming care</h2></div><span className="text-3xl text-cyan-300">□</span></div>
            <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-bold">Care planning check-in</p><p className="mt-1 text-sm text-slate-400">Tuesday, 10:30 AM · Video consultation</p></div><span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-200">Upcoming</span></div><button onClick={() => setDialog("appointment")} className="mt-5 text-sm font-semibold text-cyan-300 hover:text-cyan-200">View appointment details →</button></div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7" aria-labelledby="reminders-title">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Reminders</p><h2 id="reminders-title" className="mt-2 text-xl font-black">Keep your care on track</h2></div><span className="text-3xl text-cyan-300">◌</span></div>
            <div className="mt-5 space-y-2">
              {reminders.map((reminder) => <div key={reminder.id} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${reminder.complete ? "border-emerald-400/20 bg-emerald-400/5" : "border-white/10 bg-slate-950/30"}`}><button onClick={() => toggleReminder(reminder.id)} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${reminder.complete ? "border-emerald-300 bg-emerald-400 text-slate-950" : "border-slate-500"}`} aria-label={`Mark ${reminder.title} ${reminder.complete ? "incomplete" : "complete"}`}>{reminder.complete ? "✓" : ""}</button><div><p className={`text-sm font-bold ${reminder.complete ? "text-slate-500 line-through" : ""}`}>{reminder.title}</p><p className="text-xs text-slate-500">{reminder.detail}</p></div></div>)}
            </div>
            <form onSubmit={addReminder} className="mt-4 flex gap-2"><label className="sr-only" htmlFor="new-reminder">Add a personal reminder</label><input id="new-reminder" value={newReminder} onChange={(event) => setNewReminder(event.target.value)} placeholder="Add a personal reminder" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400" /><button type="submit" className="rounded-xl bg-white/10 px-4 text-sm font-semibold hover:bg-white/15">Add</button></form>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 md:p-9" aria-labelledby="history-title">
          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Care history</p><h2 id="history-title" className="mt-2 text-2xl font-black">Your recent healthcare activity</h2></div><button onClick={() => setDialog("history")} className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">View all</button></div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">{initialHistory.map((item) => <article key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/30 p-5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">{item.icon}</span><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{item.date}</p><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-1 text-sm text-slate-500">{item.detail}</p></article>)}</div>
        </section>

        <aside className="mt-8 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-6"><div className="flex gap-4"><span className="text-2xl text-amber-200">!</span><div><h2 className="font-bold">WizCare safety notice</h2><p className="mt-1 text-sm leading-6 text-slate-400">Wiz supports and guides you; it does not replace emergency services or qualified clinical care. If you think you may have an emergency, contact your local emergency service immediately.</p></div></div></aside>
      </section>

      {dialog && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/75 p-4 backdrop-blur-sm sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">{dialog === "care" ? "Immediate care request" : "Your WizCare space"}</p><h2 id="dialog-title" className="mt-2 text-2xl font-black">{dialog === "care" ? "Tell us what you need" : dialog === "profile" ? "Profile & security" : dialog === "preferences" ? "Care preferences" : dialog === "appointment" ? "Appointment details" : "Care history"}</h2></div>
              <button onClick={closeDialog} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close dialog">×</button>
            </div>

            {dialog === "care" && <div className="mt-6"><label className="block text-sm font-semibold" htmlFor="care-reason">Reason for request</label><select id="care-reason" value={requestReason} onChange={(event) => setRequestReason(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-400"><option>I need help understanding my symptoms</option><option>I need a home visit</option><option>I need urgent but non-emergency advice</option></select><label className="mt-5 flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-5 text-slate-300"><input type="checkbox" checked={requestConsent} onChange={(event) => setRequestConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-cyan-400" />I consent to share this request and relevant care details with a verified professional for the purpose of arranging care.</label><button disabled={!requestConsent} onClick={submitRequest} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-3.5 font-bold text-slate-950 transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40">Send care request</button><p className="mt-4 text-xs leading-5 text-slate-500">This request is not for emergencies. For an emergency, contact your local emergency service now.</p></div>}

            {dialog === "profile" && <div className="mt-6 space-y-4"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account holder</p><p className="mt-1 font-bold">Ada Okafor</p><p className="mt-1 text-sm text-slate-400">ada.okafor@example.com</p></div><div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4"><p className="font-semibold text-emerald-300">Your account is protected</p><p className="mt-1 text-sm leading-6 text-slate-400">Password sign-in and verification are enabled. Security changes will require confirmation when connected to your account.</p></div><p className="text-xs leading-5 text-slate-500">This dashboard has no live identity service yet, so profile details cannot be edited here.</p></div>}

            {dialog === "preferences" && <div className="mt-6 space-y-3"><label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"><span><span className="block font-semibold">SMS care updates</span><span className="mt-1 block text-sm text-slate-400">Receive visit and appointment updates.</span></span><input checked={smsUpdates} onChange={(event) => setSmsUpdates(event.target.checked)} type="checkbox" className="h-5 w-5 accent-cyan-400" /></label><label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"><span><span className="block font-semibold">Caregiver updates</span><span className="mt-1 block text-sm text-slate-400">Share status updates with a trusted caregiver.</span></span><input checked={caregiverUpdates} onChange={(event) => setCaregiverUpdates(event.target.checked)} type="checkbox" className="h-5 w-5 accent-cyan-400" /></label><p className="px-1 text-xs leading-5 text-slate-500">These choices work for this browser session only. They are not yet saved or sent to a care provider.</p></div>}

            {dialog === "appointment" && <div className="mt-6 space-y-4"><div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5"><p className="font-bold">Care planning check-in</p><p className="mt-2 text-sm text-slate-300">Tuesday, 10:30 AM · Video consultation</p><p className="mt-3 text-sm leading-6 text-slate-400">Bring any questions about your current care plan. A secure meeting link will appear here when scheduling is connected.</p></div><label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><input checked={appointmentPrepared} onChange={(event) => setAppointmentPrepared(event.target.checked)} type="checkbox" className="h-5 w-5 accent-cyan-400" /><span><span className="block font-semibold">I&apos;ve prepared my questions</span><span className="mt-1 block text-sm text-slate-400">A simple, session-only preparation checklist.</span></span></label><p className="text-xs leading-5 text-slate-500">Appointment changes are not connected to a scheduling service yet.</p></div>}

            {dialog === "history" && <div className="mt-6 space-y-3">{initialHistory.map((item) => <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.date}</p><p className="mt-1 font-bold">{item.title}</p><p className="mt-1 text-sm text-slate-400">{item.detail}</p></div>)}<p className="text-xs leading-5 text-slate-500">This is example dashboard history. Secure records integration has not been connected.</p></div>}

            {dialog !== "care" && <button onClick={closeDialog} className="mt-6 w-full rounded-2xl bg-white/10 py-3 font-bold transition hover:bg-white/15">Done</button>}
          </div>
        </div>
      )}

      <footer className="relative z-10 mt-8 border-t border-white/10 bg-slate-950 px-5 py-8 md:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm md:flex-row"><p className="font-semibold">WizCare <span className="text-cyan-400">Network</span></p><p className="text-slate-600">Intelligent care. Human connection.</p></div></footer>
    </main>
  );
}

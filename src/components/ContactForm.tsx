import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

interface ContactFormProps {
  formId?: string;
}

export default function ContactForm({ formId }: ContactFormProps) {
  const resolvedId =
    formId ||
    (typeof import.meta !== "undefined"
      ? import.meta.env.PUBLIC_FORMSPREE_ID
      : undefined);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [needPrefill, setNeedPrefill] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tier = params.get("tier");
    if (tier) {
      const label = tier.charAt(0).toUpperCase() + tier.slice(1);
      setNeedPrefill(`Interested in the ${label} package.`);
    }
    const onHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#contact")) {
        const q = hash.includes("?") ? hash.split("?")[1] : "";
        if (q) {
          const hp = new URLSearchParams(q);
          const t = hp.get("tier");
          if (t) {
            const label = t.charAt(0).toUpperCase() + t.slice(1);
            setNeedPrefill(`Interested in the ${label} package.`);
          }
        }
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ tier?: string }>).detail;
      if (detail?.tier) {
        const label =
          detail.tier.charAt(0).toUpperCase() + detail.tier.slice(1);
        setNeedPrefill(`Interested in the ${label} package.`);
      }
    };
    window.addEventListener("pricing-tier", handler as EventListener);
    return () =>
      window.removeEventListener("pricing-tier", handler as EventListener);
  }, []);

  const endpoint = resolvedId
    ? `https://formspree.io/f/${resolvedId}`
    : null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!endpoint) {
      setStatus("error");
      setErrorMessage(
        "Form is not configured yet. Please email me directly instead.",
      );
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("_gotcha")) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        setNeedPrefill("");
      } else {
        const body = await res.json().catch(() => null);
        setStatus("error");
        setErrorMessage(
          body?.errors?.[0]?.message ||
            "Something went wrong. Please try again or email me.",
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "Could not send. Check your connection or email me directly.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-[rgba(28,26,22,0.12)] bg-[var(--paper-raised)] p-6 md:p-8">
        <p className="text-lg font-medium tracking-[-0.01em]">
          Message <span className="serif italic">sent</span>.
        </p>
        <p className="mt-2 text-[14px] text-[var(--ink-mute)] leading-relaxed">
          Thanks - I&rsquo;ll get back to you within a day, usually sooner.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm text-[var(--accent)] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-md border border-[rgba(28,26,22,0.14)] bg-[var(--paper-raised)] px-3.5 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none transition-colors focus:border-[rgba(61,107,140,0.55)] focus:ring-1 focus:ring-[rgba(61,107,140,0.25)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {!endpoint && (
        <p className="text-[13px] text-[var(--ink-mute)] rounded-md border border-[rgba(28,26,22,0.1)] bg-[var(--paper-raised)] px-3 py-2">
          Set <code className="mono text-[12px]">PUBLIC_FORMSPREE_ID</code> to
          enable the form, or use email / phone below.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-faint)]">
            Name
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            className={`mt-1.5 ${fieldClass}`}
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-faint)]">
            Business
          </span>
          <input
            type="text"
            name="business"
            autoComplete="organization"
            className={`mt-1.5 ${fieldClass}`}
            placeholder="Business or project name"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-faint)]">
            Phone
          </span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            className={`mt-1.5 ${fieldClass}`}
            placeholder="Best number to reach you"
          />
        </label>
        <label className="block">
          <span className="mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-faint)]">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={`mt-1.5 ${fieldClass}`}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block">
        <span className="mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-faint)]">
          What you need
        </span>
        <textarea
          name="message"
          required
          rows={4}
          value={needPrefill}
          onChange={(e) => setNeedPrefill(e.target.value)}
          className={`mt-1.5 resize-y min-h-[110px] ${fieldClass}`}
          placeholder="A new site, a rebuild, shop, booking… a sentence or two is fine."
        />
      </label>

      {/* Honeypot */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {status === "error" && (
        <p className="text-[13px] text-red-800/80" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--ink)] text-[var(--paper)] font-medium text-sm hover:bg-[var(--ink-2)] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            Sending
            <Loader2 className="size-4 animate-spin" />
          </>
        ) : (
          <>
            Send message
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[#1c1b18] hover:bg-[var(--color-accent-hover)] font-semibold",
  secondary:
    "bg-[var(--color-surface-2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-accent)]",
  danger: "bg-[var(--color-danger)] text-[#1c1b18] hover:brightness-110 font-semibold",
  ghost: "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`rounded-xl py-3 px-5 text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                  active:scale-[0.98] transition-transform ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-sm text-[var(--color-text-muted)] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] " +
  "py-2.5 px-3 focus:border-[var(--color-accent)] transition-colors";

export function Banner({ kind, children }: { kind: "error" | "info"; children: ReactNode }) {
  const styles =
    kind === "error"
      ? "bg-[var(--color-danger)]/15 border-[var(--color-danger)] text-[#f1ede4]"
      : "bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[#f1ede4]";
  return <div className={`border rounded-lg px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

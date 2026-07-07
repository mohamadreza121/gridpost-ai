import type { ReactNode } from "react";

export function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <div>
          <h2>{title}</h2>
          {hint && <p style={{ margin: "8px 0 0" }}>{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function StatusPill({ status }: { status: "Scheduled" | "Draft" | "Posted" | "Failed" | "Review" }) {
  const className = status === "Scheduled" ? "status-scheduled" : status === "Draft" || status === "Review" ? "status-draft" : status === "Failed" ? "status-failed" : "status-posted";
  return (
    <span className={`status-pill ${className}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

export function PlatformPill({ label }: { label: string }) {
  return <span className="platform-pill">{label}</span>;
}

export function KpiCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-trend">{trend}</div>
    </div>
  );
}

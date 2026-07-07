import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";

const steps = [
  "Open the dashboard overview and review upcoming posts.",
  "Create one post in the universal composer.",
  "Select all social platforms and preview each format.",
  "Schedule it on the calendar.",
  "Check campaigns, media, analytics, and automation rules.",
];

export default function DemoPage() {
  return (
    <SiteChrome>
      <main className="container">
        <section className="page-hero">
          <span className="eyebrow"><span className="eyebrow-dot" /> Demo path</span>
          <h1><span className="gradient-text">Show clients</span> the full flow.</h1>
          <p>This is the simple walkthrough for presenting GridPost AI as a dashboard and agent creation project inside GridSpell Studio.</p>
        </section>
        <section className="section" style={{ paddingTop: 28 }}>
          <div className="panel">
            {steps.map((step, index) => (
              <div className="post-row" key={step}>
                <div>
                  <span className="platform-pill">Step {index + 1}</span>
                  <h3 style={{ margin: "10px 0 0" }}>{step}</h3>
                </div>
                <span style={{ color: "var(--muted)" }}>GridSpell flow</span>
              </div>
            ))}
            <Link className="btn" href="/dashboard" style={{ marginTop: 18 }}>Start dashboard demo</Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

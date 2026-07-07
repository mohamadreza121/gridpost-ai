"use client";

import { useState } from "react";
import { PageTitle, Panel } from "@/components/ui";

const rules = [
  { name: "daily_ai_draft", label: "Daily AI draft", detail: "Create one draft every morning at 8:00 AM Toronto time." },
  { name: "retry_failed_posts", label: "Auto-reschedule failed posts", detail: "Retry failed publishing jobs after 10 minutes." },
  { name: "lead_comment_detection", label: "Lead comment detection", detail: "Flag comments containing price, quote, estimate, cost, or call me." },
  { name: "weekly_report", label: "Weekly performance report", detail: "Prepare a Monday report for reach, clicks, and best content." },
  { name: "content_gap_alert", label: "Content gap alert", detail: "Warn when the calendar has no approved post for the next 48 hours." },
];

export default function AutomationPage() {
  const [enabled, setEnabled] = useState([true, true, true, false, true]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function saveRules() {
    setSaving(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/automation-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules: rules.map((rule, index) => ({ ...rule, enabled: enabled[index] })) }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(result.error ?? "Could not save rules.");
      return;
    }

    setMessage(`Saved ${result.saved} automation rules to Appwrite.`);
  }

  async function sweepDuePosts() {
    setMessage("Inngest route is installed. Use the Inngest Dev Server/Dashboard to trigger the posts/sweep.requested event, or schedule a post from the composer.");
    setError(null);
  }

  async function testEmail() {
    setMessage(null);
    setError(null);

    const response = await fetch("/api/email/test", { method: "POST" });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(result.error ?? "Email test failed.");
      return;
    }

    setMessage("Resend email test sent.");
  }

  return (
    <>
      <PageTitle
        eyebrow="Automation rules"
        title="The agent layer"
        description="Control scheduled publishing, AI drafts, retries, reports, and lead detection rules."
        action={<button className="btn" onClick={saveRules} disabled={saving}>{saving ? "Saving..." : "Save rules"}</button>}
      />
      {message && <p className="form-message success">{message}</p>}
      {error && <p className="form-message error">{error}</p>}
      <div className="dashboard-grid">
        <Panel title="Automation rules" hint="Saved to automation_rules. Scheduled posts dispatch real Inngest events from the composer.">
          {rules.map((rule, index) => (
            <div className="automation-row" key={rule.name}>
              <div>
                <h3 style={{ margin: "0 0 5px" }}>{rule.label}</h3>
                <p style={{ margin: 0, color: "var(--muted)" }}>{rule.detail}</p>
              </div>
              <button
                className={`toggle ${enabled[index] ? "on" : ""}`}
                type="button"
                aria-label={`Toggle ${rule.label}`}
                onClick={() => setEnabled((current) => current.map((value, idx) => idx === index ? !value : value))}
              />
            </div>
          ))}
        </Panel>
        <Panel title="Default posting rhythm" hint="A simple daily schedule model for Phase 1.">
          <div className="field">
            <label htmlFor="daily-time">Daily post time</label>
            <input id="daily-time" className="input" type="time" defaultValue="10:00" />
          </div>
          <div className="field">
            <label htmlFor="draft-time">AI draft time</label>
            <input id="draft-time" className="input" type="time" defaultValue="08:00" />
          </div>
          <div className="field">
            <label htmlFor="approval-mode">Approval mode</label>
            <select id="approval-mode" className="select" defaultValue="Require approval">
              <option>Require approval</option>
              <option>Auto-schedule approved campaigns</option>
              <option>Fully automatic demo mode</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="ghost-btn" type="button" onClick={sweepDuePosts}>Test Inngest sweep</button>
            <button className="ghost-btn" type="button" onClick={testEmail}>Test Resend email</button>
          </div>
        </Panel>
      </div>
    </>
  );
}

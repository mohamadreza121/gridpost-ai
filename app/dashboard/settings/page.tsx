"use client";

import { useState } from "react";
import { PageTitle, Panel } from "@/components/ui";

export default function SettingsPage() {
  const [brandName, setBrandName] = useState("GridSpell Studio");
  const [voice, setVoice] = useState("Premium, structured, clear, confident, modern, not boring, dark studio energy with practical business value.");
  const [audience, setAudience] = useState("Local businesses, service providers, startups, and brands needing premium websites or dashboards.");
  const [hashtags, setHashtags] = useState("#webdesign #webdevelopment #smallbusinesswebsite #branding #seo #gridspellstudio");
  const [cta, setCta] = useState("Start a project with GridSpell Studio.");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function saveSettings() {
    setSaving(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/brand-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandName, voice, audience, defaultHashtags: hashtags, defaultCta: cta }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(result.error ?? "Could not save settings.");
      return;
    }

    setMessage("Brand profile saved to Appwrite.");
  }

  return (
    <>
      <PageTitle
        eyebrow="Workspace settings"
        title="Brand voice and defaults"
        description="Configure the GridSpell-style tone, hashtags, CTA language, workspace details, and platform defaults."
        action={<button className="btn" onClick={saveSettings} disabled={saving}>{saving ? "Saving..." : "Save settings"}</button>}
      />
      {message && <p className="form-message success">{message}</p>}
      {error && <p className="form-message error">{error}</p>}
      <div className="settings-grid">
        <Panel title="Brand profile" hint="Saved into the brand_profiles table and used by AI caption generation.">
          <div className="field">
            <label htmlFor="brand-name">Brand name</label>
            <input className="input" id="brand-name" value={brandName} onChange={(event) => setBrandName(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="voice">Brand voice</label>
            <textarea className="textarea" id="voice" value={voice} onChange={(event) => setVoice(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="audience">Target audience</label>
            <input className="input" id="audience" value={audience} onChange={(event) => setAudience(event.target.value)} />
          </div>
        </Panel>
        <Panel title="Posting defaults" hint="Saved settings that apply to the composer and scheduler. Phase 2 can auto-load these into prompts.">
          <div className="field">
            <label htmlFor="hashtags">Default hashtags</label>
            <textarea className="textarea" id="hashtags" value={hashtags} onChange={(event) => setHashtags(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="cta">Default CTA</label>
            <input className="input" id="cta" value={cta} onChange={(event) => setCta(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="approval">Approval workflow</label>
            <select className="select" id="approval" defaultValue="Draft → Review → Approved → Scheduled → Posted">
              <option>Draft → Review → Approved → Scheduled → Posted</option>
              <option>Draft → Scheduled → Posted</option>
              <option>AI Draft → Owner Review → Scheduled</option>
            </select>
          </div>
        </Panel>
      </div>
    </>
  );
}

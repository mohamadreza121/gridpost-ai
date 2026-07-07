"use client";

import { useMemo, useState } from "react";
import { PageTitle, Panel } from "@/components/ui";
import { platforms } from "@/lib/mock-data";

const starterCaption = "Your website should not just look good — it should guide visitors, build trust, and turn attention into action. GridSpell Studio builds structured digital experiences for businesses ready to look premium online.";

const starterVersions: Record<string, string> = {
  instagram: "Your website is your first impression. Make it sharp, fast, and built to convert. ✦\n\nGridSpell Studio creates premium websites and client portals for businesses that want more than a template.\n\n#webdesign #branddesign #smallbusinesswebsite #gridspellstudio",
  facebook: "A strong website should help people understand your business fast, trust your work, and take the next step. GridSpell Studio builds professional websites, dashboards, and client portals for modern businesses.",
  linkedin: "A business website should be treated like a product, not a brochure. The strongest sites combine clear positioning, fast performance, structured design, and a conversion path that makes the next step obvious.\n\nThat is the GridSpell approach: premium design, practical systems, and business-focused execution.",
  x: "Your website should do more than exist.\n\nIt should explain, build trust, and convert.\n\nGridSpell Studio builds structured digital experiences for businesses that want to look premium online.",
  tiktok: "POV: your business website finally looks as professional as your actual work. GridSpell Studio builds premium websites, dashboards, and portals that feel expensive and perform like products.",
  youtube: "Your website is more than a page — it is your digital sales system. In this short, we show why structure, speed, and clear design matter for local business growth.",
  pinterest: "Premium website design inspiration for modern businesses. Explore structured layouts, dark studio branding, conversion-focused sections, and clean digital systems by GridSpell Studio.",
};

export default function ComposerPage() {
  const [caption, setCaption] = useState(starterCaption);
  const [versions, setVersions] = useState<Record<string, string>>(starterVersions);
  const [selected, setSelected] = useState(platforms.map((p) => p.id));
  const [topic, setTopic] = useState("Website redesign for local businesses");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("10:00");
  const [timezone, setTimezone] = useState("America/Toronto");
  const [repeat, setRepeat] = useState("none");
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function togglePlatform(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  const selectedPlatforms = useMemo(() => platforms.filter((platform) => selected.includes(platform.id)), [selected]);

  async function generateCopy() {
    setLoadingAI(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          baseCaption: caption,
          platforms: selected,
          brandVoice: "GridSpell Studio: dark premium SaaS, structured grid design, confident but clear, helpful for local businesses and creators.",
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "AI generation failed.");

      setVersions((current) => ({ ...current, ...(result.versions ?? {}) }));
      if (result.versions?.linkedin) setCaption(result.versions.linkedin);
      setMessage(result.warning ?? "AI platform versions generated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed.");
    } finally {
      setLoadingAI(false);
    }
  }

  function getScheduledAt() {
    if (!date || !time) return null;
    // Browser creates this in the user's local timezone. The timezone string is saved separately for display/business rules.
    const value = new Date(`${date}T${time}:00`);
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  async function savePost(asScheduled: boolean) {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const scheduledAt = asScheduled ? getScheduledAt() : null;
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: topic,
          baseCaption: caption,
          scheduledAt,
          timezone,
          repeatRule: repeat,
          platforms: selectedPlatforms.map((platform) => ({
            platform: platform.id,
            caption: versions[platform.id] ?? caption,
          })),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save post.");
      setMessage(asScheduled ? "Post scheduled and Inngest publish event queued." : "Draft saved to Appwrite.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="Universal composer"
        title="Create once. Adapt everywhere."
        description="Draft one campaign, use OpenAI for platform-specific versions, save to Appwrite, and queue scheduled publishing with Inngest."
        action={<button className="btn" type="button" onClick={() => savePost(true)} disabled={saving}>{saving ? "Saving..." : "Schedule post"}</button>}
      />

      <div className="composer-grid">
        <div className="stack">
          <Panel title="Post details" hint="OpenAI powers the caption generator when OPENAI_API_KEY is set. Without it, the route returns fallback demo copy.">
            <div className="field">
              <label htmlFor="topic">Topic or prompt</label>
              <input className="input" id="topic" value={topic} onChange={(event) => setTopic(event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="caption">Base caption</label>
              <textarea className="textarea" id="caption" value={caption} onChange={(event) => setCaption(event.target.value)} />
            </div>
            {message && <p className="form-message success">{message}</p>}
            {error && <p className="form-message error">{error}</p>}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn" type="button" onClick={generateCopy} disabled={loadingAI}>{loadingAI ? "Generating..." : "Generate AI draft"}</button>
              <a className="ghost-btn" href="/dashboard/media">Add media</a>
              <button className="ghost-btn" type="button" onClick={() => savePost(false)} disabled={saving}>Save draft</button>
            </div>
          </Panel>

          <Panel title="Choose platforms" hint="Each selected platform gets its own saved caption row in Appwrite.">
            <div className="platform-select-grid">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  className={`platform-option ${selected.includes(platform.id) ? "active" : ""}`}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <span>
                    <strong style={{ display: "block" }}>{platform.label}</strong>
                    <small>{platform.tone}</small>
                  </span>
                  <span>{selected.includes(platform.id) ? "✓" : "+"}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Schedule settings" hint="Saved schedule data creates a publish job and dispatches an Inngest event.">
            <div className="settings-grid">
              <div className="field">
                <label htmlFor="date">Date</label>
                <input className="input" id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="time">Time</label>
                <input className="input" id="time" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="timezone">Timezone</label>
                <select className="select" id="timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                  <option>America/Toronto</option>
                  <option>America/New_York</option>
                  <option>America/Los_Angeles</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="repeat">Repeat</label>
                <select className="select" id="repeat" value={repeat} onChange={(event) => setRepeat(event.target.value)}>
                  <option value="none">No repeat</option>
                  <option value="daily">Every day</option>
                  <option value="mwf">Monday, Wednesday, Friday</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Live previews" hint={`${selectedPlatforms.length} selected platform${selectedPlatforms.length === 1 ? "" : "s"}.`}>
          <div className="preview-stack">
            {selectedPlatforms.map((platform) => (
              <article className="preview-card" key={platform.id}>
                <div className="preview-header">
                  <div className="avatar-row">
                    <div className="avatar">G</div>
                    <div>
                      <strong>{platform.label}</strong>
                      <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>{platform.handle}</p>
                    </div>
                  </div>
                  <span className="platform-pill">Preview</span>
                </div>
                <div className="media-placeholder">Media preview</div>
                <p className="preview-copy">{versions[platform.id] ?? caption}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

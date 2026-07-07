import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";

const features = [
  ["Universal composer", "Write once, preview platform-specific versions for Instagram, Facebook, LinkedIn, X, TikTok, YouTube, and Pinterest."],
  ["AI content system", "Generate captions, hooks, hashtags, campaign ideas, and daily content plans in a GridSpell-approved brand voice."],
  ["Scheduling command center", "Plan posts visually with calendar views, approval statuses, recurring rules, and automation settings."],
  ["Portfolio-ready dashboard", "A polished SaaS interface designed to prove GridSpell can build software, not only marketing websites."],
  ["Analytics mock layer", "Show engagement, reach, clicks, and top-performing content with a premium dashboard presentation."],
  ["API-ready structure", "The demo is prepared for future Appwrite, OpenAI, scheduler, and real social platform integrations."],
];

export default function Home() {
  return (
    <SiteChrome>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow"><span className="eyebrow-dot" /> Phase 1 portfolio SaaS demo</span>
              <h1><span className="gradient-text">One dashboard.</span><br />Every social platform.</h1>
              <p>
                GridPost AI is a premium AI social media command center built for the GridSpell Studio portfolio: create, preview, schedule, and manage content across every major platform from one structured dashboard.
              </p>
              <div className="hero-actions">
                <Link className="btn" href="/dashboard">Open dashboard</Link>
                <Link className="ghost-btn" href="/demo">View demo flow</Link>
              </div>
              <div className="trust-row">
                <span><strong>7</strong> platform previews</span>
                <span><strong>9</strong> dashboard sections</span>
                <span><strong>100%</strong> GridSpell vibe</span>
              </div>
            </div>
            <div className="dashboard-frame" aria-label="Dashboard preview">
              <div className="mock-topbar">
                <div className="window-dots"><span /><span /><span /></div>
                <span>GridPost AI / Control Center</span>
              </div>
              <div className="mock-grid">
                <div className="mock-sidebar">
                  <div className="mock-menu-item active" />
                  <div className="mock-menu-item" />
                  <div className="mock-menu-item" />
                  <div className="mock-menu-item" />
                  <div className="mock-menu-item" />
                </div>
                <div className="mock-main">
                  <div className="mock-hero-line" />
                  <div className="mock-cards">
                    <div className="mock-card"><span /><div className="mock-chart" /></div>
                    <div className="mock-card"><span /><div className="mock-chart" /></div>
                    <div className="mock-card"><span /><div className="mock-chart" /></div>
                    <div className="mock-card"><span /><div className="mock-chart" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="eyebrow"><span className="eyebrow-dot" /> Built on structure</span>
                <h2>Designed like a real product, not a fake template.</h2>
              </div>
              <p className="section-lead" style={{ maxWidth: 430 }}>
                This Phase 1 build gives GridSpell a strong dashboard example for clients who need portals, SaaS products, admin panels, and AI tools.
              </p>
            </div>
            <div className="feature-grid">
              {features.map(([title, copy], index) => (
                <article className="card" key={title}>
                  <div className="card-icon">{String(index + 1).padStart(2, "0")}</div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

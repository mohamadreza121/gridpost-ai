import { SiteChrome } from "@/components/site-chrome";

const groups = [
  ["Create", "Universal composer, AI captions, hashtag groups, CTA selector, media upload, and platform-specific copy."],
  ["Schedule", "Calendar planning, daily posting rules, recurring schedules, approval statuses, and retry-ready job states."],
  ["Manage", "Connected accounts, token health UI, media library, campaigns, settings, and team/client-ready workflows."],
  ["Measure", "Analytics cards, engagement trends, best posts, platform comparison, and report-ready metric blocks."],
  ["Automate", "Daily auto-draft rules, smart content themes, queue mockups, and future worker/scheduler integration."],
  ["Present", "A premium portfolio case study that proves GridSpell can build product-grade dashboards and AI systems."],
];

export default function FeaturesPage() {
  return (
    <SiteChrome>
      <main className="container">
        <section className="page-hero">
          <span className="eyebrow"><span className="eyebrow-dot" /> Feature map</span>
          <h1><span className="gradient-text">The dashboard stack</span> clients want.</h1>
          <p>GridPost AI shows the full Phase 1 experience: content creation, scheduling, campaigns, media management, automation, and analytics.</p>
        </section>
        <section className="section" style={{ paddingTop: 28 }}>
          <div className="feature-grid">
            {groups.map(([title, copy]) => (
              <article className="card" key={title}>
                <div className="card-icon">✦</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

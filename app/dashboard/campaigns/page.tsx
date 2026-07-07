import { PageTitle, Panel } from "@/components/ui";
import { campaigns } from "@/lib/mock-data";

export default function CampaignsPage() {
  return (
    <>
      <PageTitle
        eyebrow="Campaign manager"
        title="Turn content into systems"
        description="Group posts around goals like website leads, local SEO education, case studies, or client portal showcases."
        action={<button className="btn">New campaign</button>}
      />
      <div className="cards-grid">
        {campaigns.map((campaign) => (
          <article className="card" key={campaign.name}>
            <span className="platform-pill">{campaign.status}</span>
            <h3 style={{ fontSize: 27, marginTop: 18 }}>{campaign.name}</h3>
            <p>{campaign.goal}</p>
            <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden", margin: "18px 0" }}>
              <div style={{ width: campaign.progress, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--primary), var(--accent))" }} />
            </div>
            <p style={{ marginBottom: 0 }}>{campaign.posts} posts · {campaign.progress} complete</p>
          </article>
        ))}
      </div>
      <div style={{ marginTop: 18 }}>
        <Panel title="Campaign templates" hint="Quick campaign ideas that fit GridSpell Studio and local business clients.">
          {[
            "30-day website authority sprint",
            "Before/after website redesign carousel series",
            "Client testimonial and Google review repurposing",
            "Local SEO education campaign",
            "New dashboard/product launch sequence",
          ].map((item) => (
            <div className="post-row" key={item}>
              <h3 style={{ margin: 0 }}>{item}</h3>
              <button className="small-btn">Use template</button>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}

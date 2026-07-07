import { KpiCard, PageTitle, Panel, PlatformPill, StatusPill } from "@/components/ui";
import { analyticsBars, campaigns, platforms, upcomingPosts } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <>
      <PageTitle
        eyebrow="Command center"
        title="GridPost AI dashboard"
        description="Create, schedule, preview, and manage social content from one premium GridSpell-style control center."
        action={<span className="status-pill status-posted"><span className="status-dot" />Demo workspace live</span>}
      />

      <div className="kpi-grid">
        <KpiCard label="Scheduled posts" value="34" trend="+12 this week" />
        <KpiCard label="Active campaigns" value="3" trend="2 running now" />
        <KpiCard label="Total reach" value="128k" trend="+18.4%" />
        <KpiCard label="Leads detected" value="27" trend="+9 from comments" />
      </div>

      <div className="dashboard-grid">
        <div className="stack">
          <Panel title="Upcoming content queue" hint="Posts ready for review, scheduling, or publishing.">
            {upcomingPosts.map((post) => (
              <div className="post-row" key={post.title}>
                <div>
                  <h3 style={{ margin: "0 0 8px" }}>{post.title}</h3>
                  <p style={{ margin: 0, color: "var(--muted)" }}>{post.time}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    {post.platforms.map((platform) => <PlatformPill key={platform} label={platform} />)}
                  </div>
                </div>
                <StatusPill status={post.status} />
              </div>
            ))}
          </Panel>

          <Panel title="Performance pulse" hint="Phase 1 mock analytics prepared for real platform metrics later.">
            <div className="bars">
              {analyticsBars.map((height, index) => (
                <div className="bar" key={index} style={{ height: `${height}%` }} aria-label={`Metric ${index + 1}`} />
              ))}
            </div>
          </Panel>
        </div>

        <div className="stack">
          <Panel title="Connected accounts" hint="OAuth-ready account status preview.">
            {platforms.slice(0, 5).map((platform) => (
              <div className="account-row" key={platform.id}>
                <div>
                  <h3 style={{ margin: "0 0 4px" }}>{platform.label}</h3>
                  <p style={{ margin: 0, color: "var(--muted)" }}>{platform.handle}</p>
                </div>
                <span className="platform-pill">{platform.status}</span>
              </div>
            ))}
          </Panel>

          <Panel title="Campaigns in motion">
            {campaigns.map((campaign) => (
              <div className="account-row" key={campaign.name}>
                <div>
                  <h3 style={{ margin: "0 0 5px" }}>{campaign.name}</h3>
                  <p style={{ margin: 0, color: "var(--muted)" }}>{campaign.posts} posts · {campaign.progress} complete</p>
                </div>
                <span className="platform-pill">{campaign.status}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </>
  );
}

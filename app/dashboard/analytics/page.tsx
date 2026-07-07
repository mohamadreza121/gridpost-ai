import { KpiCard, PageTitle, Panel, PlatformPill } from "@/components/ui";
import { analyticsBars } from "@/lib/mock-data";

export default function AnalyticsPage() {
  return (
    <>
      <PageTitle
        eyebrow="Analytics"
        title="Know what works"
        description="A portfolio-ready analytics surface for reach, engagement, clicks, followers, and platform comparison."
        action={<button className="btn">Export report</button>}
      />
      <div className="kpi-grid">
        <KpiCard label="Impressions" value="128k" trend="+18.4%" />
        <KpiCard label="Engagement" value="9.8k" trend="+12.1%" />
        <KpiCard label="Website clicks" value="1,246" trend="+31.6%" />
        <KpiCard label="Followers" value="14.2k" trend="+604" />
      </div>
      <div className="dashboard-grid">
        <Panel title="Engagement trend" hint="Mock data ready to be replaced with real platform analytics.">
          <div className="bars">
            {analyticsBars.map((height, index) => <div className="bar" key={index} style={{ height: `${height}%` }} />)}
          </div>
        </Panel>
        <Panel title="Top platforms">
          {[
            ["LinkedIn", "Best for authority posts", "+24%"],
            ["Instagram", "Best for carousels", "+18%"],
            ["Pinterest", "Best for website traffic", "+15%"],
            ["TikTok", "Best for awareness", "+12%"],
          ].map(([name, detail, trend]) => (
            <div className="account-row" key={name}>
              <div>
                <h3 style={{ margin: "0 0 5px" }}>{name}</h3>
                <p style={{ margin: 0, color: "var(--muted)" }}>{detail}</p>
              </div>
              <PlatformPill label={trend} />
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}

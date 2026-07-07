import { PageTitle, Panel, PlatformPill } from "@/components/ui";
import { platforms } from "@/lib/mock-data";

export default function AccountsPage() {
  return (
    <>
      <PageTitle
        eyebrow="Social accounts"
        title="Connect every platform"
        description="OAuth-ready account cards for Instagram, Facebook, LinkedIn, X, TikTok, YouTube, and Pinterest."
        action={<button className="btn">Connect account</button>}
      />
      <Panel title="Platform connections" hint="Phase 1 is display-only; Phase 5 connects these cards to real OAuth flows.">
        {platforms.map((platform) => (
          <div className="account-row" key={platform.id}>
            <div className="avatar-row">
              <div className="avatar">{platform.label.slice(0, 1)}</div>
              <div>
                <h3 style={{ margin: "0 0 4px" }}>{platform.label}</h3>
                <p style={{ margin: 0, color: "var(--muted)" }}>{platform.handle} · {platform.tone}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <PlatformPill label={platform.status} />
              <button className="small-btn">Manage</button>
            </div>
          </div>
        ))}
      </Panel>
    </>
  );
}

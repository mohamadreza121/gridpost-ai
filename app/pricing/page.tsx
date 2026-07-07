import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";

const plans = [
  { name: "Demo", price: "$0", note: "Portfolio preview", items: ["Dashboard UI", "Mock data", "Platform previews", "Calendar demo"] },
  { name: "Pro Build", price: "$4.5k+", note: "Real client-ready MVP", items: ["Appwrite auth", "AI generation", "Saved posts", "Scheduler worker"] },
  { name: "Scale", price: "Custom", note: "Full platform integrations", items: ["OAuth integrations", "Analytics sync", "Team roles", "Client approvals"] },
];

export default function PricingPage() {
  return (
    <SiteChrome>
      <main className="container">
        <section className="page-hero">
          <span className="eyebrow"><span className="eyebrow-dot" /> Productized service</span>
          <h1><span className="gradient-text">From demo</span> to real SaaS.</h1>
          <p>Use this page to show how GridSpell can start with a portfolio dashboard and turn it into a full business automation product.</p>
        </section>
        <section className="section" style={{ paddingTop: 28 }}>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className="card" key={plan.name}>
                <span className="platform-pill">{plan.note}</span>
                <h3 style={{ fontSize: 28, marginTop: 18 }}>{plan.name}</h3>
                <p style={{ fontSize: 42, color: "white", fontWeight: 900, letterSpacing: "-0.06em", margin: "8px 0 16px" }}>{plan.price}</p>
                {plan.items.map((item) => <p key={item}>✦ {item}</p>)}
                <Link className="btn" href="/dashboard" style={{ width: "100%", marginTop: 14 }}>View dashboard</Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

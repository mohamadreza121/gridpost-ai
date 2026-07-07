import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "./brand-mark";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <div className="bg-grid" />
      <div className="bg-orb" />
      <header className="navbar">
        <div className="nav-inner">
          <BrandMark />
          <nav className="nav-links" aria-label="Primary navigation">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/demo">Demo</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
          <div className="nav-actions">
            <Link className="ghost-btn" href="/login">Login</Link>
            <Link className="btn" href="/dashboard/composer">Create post</Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="footer">
        <div className="container footer-inner">
          <span>GridPost AI — portfolio SaaS demo by GridSpell Studio.</span>
          <span>Built on structure. Powered by automation.</span>
        </div>
      </footer>
    </div>
  );
}

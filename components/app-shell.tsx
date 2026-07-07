"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "./brand-mark";
import { SignOutButton } from "./sign-out-button";

const links = [
  { href: "/dashboard", label: "Overview", icon: "⌘" },
  { href: "/dashboard/composer", label: "Composer", icon: "✦" },
  { href: "/dashboard/calendar", label: "Calendar", icon: "□" },
  { href: "/dashboard/media", label: "Media", icon: "◈" },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: "◎" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "▥" },
  { href: "/dashboard/accounts", label: "Accounts", icon: "◌" },
  { href: "/dashboard/automation", label: "Automation", icon: "⚡" },
  { href: "/dashboard/settings", label: "Settings", icon: "◇" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname.startsWith(href);
}

export function AppShell({ children, userEmail }: { children: ReactNode; userEmail?: string }) {
  const pathname = usePathname();

  return (
    <div className="app-layout">
      <div className="bg-grid" />
      <aside className="sidebar">
        <div className="sidebar-card">
          <BrandMark href="/dashboard" />
          <nav className="sidebar-nav" aria-label="Dashboard navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={isActive(pathname, link.href) ? "active" : ""}>
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="side-footer">
            <p style={{ margin: "0 0 8px", color: "white", fontWeight: 800 }}>Agent mode</p>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 13 }}>
              Appwrite Auth, Storage, Database, OpenAI, Resend, and Inngest hooks are wired for Phase 1.
            </p>
          </div>
        </div>
      </aside>
      <main className="app-main">
        <div className="app-topbar">
          <div className="search-pill">⌕ Search posts, campaigns, accounts...</div>
          <div className="top-actions">
            <Link className="ghost-btn" href="/">View site</Link>
            <span className="user-chip">{userEmail}</span>
            <button className="icon-btn" aria-label="Notifications">✧</button>
            <Link className="btn" href="/dashboard/composer">New post</Link>
            <SignOutButton />
          </div>
        </div>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

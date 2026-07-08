"use client";

import { useEffect, useMemo, useState } from "react";
import { PageTitle, Panel, PlatformPill } from "@/components/ui";
import { SOCIAL_PLATFORMS } from "@/lib/social/platforms";

type Account = {
  id: string;
  platform: string;
  displayName?: string;
  username?: string;
  status: string;
  scopes?: string[];
  tokenExpiresAt?: string;
  connectedAt?: string;
  lastError?: string;
  oauth?: {
    configured: boolean;
    missing: string[];
  };
};

type AccountsResponse = {
  accounts: Account[];
  platformReadiness?: { platform: string; configured: boolean; missing: string[] }[];
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyPlatform, setBusyPlatform] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadAccounts() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/social/accounts", { cache: "no-store" });
      const result = (await response.json()) as AccountsResponse & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not load accounts.");
      setAccounts(result.accounts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load accounts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAccounts();
  }, []);

  const accountsByPlatform = useMemo(() => {
    return new Map(accounts.filter((account) => account.status !== "disconnected").map((account) => [account.platform, account]));
  }, [accounts]);

  async function createDemoConnection(platform: string) {
    setBusyPlatform(platform);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/social/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not connect account.");
      setMessage(result.message ?? "Demo account connected.");
      await loadAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect account.");
    } finally {
      setBusyPlatform(null);
    }
  }

  async function disconnect(accountId: string, platform: string) {
    setBusyPlatform(platform);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/social/accounts/${accountId}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not disconnect account.");
      setMessage("Account disconnected. Tokens were cleared.");
      await loadAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not disconnect account.");
    } finally {
      setBusyPlatform(null);
    }
  }

  async function testOAuthShell(platform: string) {
    setBusyPlatform(platform);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/social/oauth/start?platform=${platform}`);
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.message ?? "OAuth route exists but provider keys are not configured yet.");
        return;
      }
      setMessage(result.message ?? "OAuth shell ready.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not test OAuth shell.");
    } finally {
      setBusyPlatform(null);
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="Social accounts"
        title="API-ready account hub"
        description="OAuth shells, encrypted token storage, reconnect states, and platform adapters are ready for real APIs one by one."
        action={<button className="btn" type="button" onClick={() => void loadAccounts()} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>}
      />

      {message && <p className="form-message success">{message}</p>}
      {error && <p className="form-message error">{error}</p>}

      <Panel title="Connection architecture" hint="Phase 1.5 adds the API foundation before platform-specific OAuth credentials are connected.">
        <div className="account-meta-grid">
          <div className="account-meta-card"><span>Token storage</span>Encrypted server-side fields</div>
          <div className="account-meta-card"><span>Publisher pattern</span>One adapter per platform</div>
          <div className="account-meta-card"><span>Retry path</span>Failed jobs can be queued again</div>
        </div>
      </Panel>

      <Panel title="Platform connections" hint="Use demo connection now; replace each card with real OAuth in Phase 2+.">
        {SOCIAL_PLATFORMS.map((platform) => {
          const account = accountsByPlatform.get(platform.id);
          const isBusy = busyPlatform === platform.id;
          const status = account?.status ?? "not connected";

          return (
            <div className="account-row" key={platform.id}>
              <div>
                <div className="avatar-row">
                  <div className="avatar">{platform.label.slice(0, 1)}</div>
                  <div>
                    <h3 style={{ margin: "0 0 4px" }}>{platform.label}</h3>
                    <p style={{ margin: 0, color: "var(--muted)" }}>
                      {account?.displayName ?? platform.handleLabel} · {platform.tone}
                    </p>
                  </div>
                </div>
                <ul className="api-note-list">
                  {platform.notes.map((note) => <li key={note}>{note}</li>)}
                  {account?.lastError ? <li>{account.lastError}</li> : null}
                </ul>
              </div>
              <div className="account-actions">
                <PlatformPill label={status} />
                <button className="small-btn" type="button" onClick={() => void testOAuthShell(platform.id)} disabled={isBusy}>
                  OAuth shell
                </button>
                {account ? (
                  <button className="small-btn" type="button" onClick={() => void disconnect(account.id, platform.id)} disabled={isBusy}>
                    Disconnect
                  </button>
                ) : (
                  <button className="small-btn" type="button" onClick={() => void createDemoConnection(platform.id)} disabled={isBusy}>
                    Demo connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </Panel>
    </>
  );
}

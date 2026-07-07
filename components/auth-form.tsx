"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState("GridSpell Studio");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, workspaceName: workspace || "GridSpell Studio" }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong. Please try again.");
      }

      setMessage(mode === "login" ? "Logged in with Appwrite." : "Account created in Appwrite.");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {mode === "register" && (
        <div className="field">
          <label htmlFor="workspace">Workspace name</label>
          <input
            className="input"
            id="workspace"
            value={workspace}
            onChange={(event) => setWorkspace(event.target.value)}
            placeholder="GridSpell Studio"
            required
          />
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          className="input"
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@gridspellstudio.com"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          className="input"
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          minLength={8}
          required
        />
      </div>
      {message && <p className="form-message success">{message}</p>}
      {error && <p className="form-message error">{error}</p>}
      <button className="btn" type="submit" disabled={loading} style={{ width: "100%", marginTop: 8 }}>
        {loading ? "Working..." : mode === "login" ? "Open dashboard" : "Create workspace"}
      </button>
      <p style={{ color: "var(--muted)", margin: "18px 0 0" }}>
        {mode === "login" ? "New here? " : "Already have access? "}
        <Link href={mode === "login" ? "/register" : "/login"} className="auth-link">
          {mode === "login" ? "Create an account" : "Login"}
        </Link>
      </p>
    </form>
  );
}

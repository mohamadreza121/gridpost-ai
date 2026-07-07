import { BrandMark } from "@/components/brand-mark";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="auth-wrap">
      <div className="bg-grid" />
      <div className="auth-card">
        <BrandMark />
        <h1>Welcome back.</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
          Log in to your GridPost AI workspace with Appwrite Auth.
        </p>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}

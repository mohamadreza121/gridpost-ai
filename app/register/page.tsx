import { BrandMark } from "@/components/brand-mark";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="auth-wrap">
      <div className="bg-grid" />
      <div className="auth-card">
        <BrandMark />
        <h1>Create workspace.</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
          Create a real Appwrite-authenticated workspace for GridSpell, a business, or a client demo.
        </p>
        <AuthForm mode="register" />
      </div>
    </main>
  );
}

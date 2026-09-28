import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <p className="text-5xl">🔥</p>
        <h1 className="mt-3 font-display text-4xl text-brand-cacao">Welcome Back!</h1>
        <p className="mt-2 text-brand-cacao/70">
          Sign in to track orders, save favorites and reorder your usuals.
        </p>
      </div>
      <LoginForm />
    </section>
  );
}

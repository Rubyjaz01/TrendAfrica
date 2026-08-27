import { useState } from "react";
import { Link } from "react-router-dom";

import AuthBackground from "../components/auth/AuthBackground";
import InteractiveIdentityCard from "../components/auth/InteractiveIdentityCard";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  const [identity, setIdentity] =
    useState("");

  const identityName =
    identity.trim() ||
    "TrendAfrica";

  const identityUsername =
    identity.includes("@")
      ? identity
          .split("@")[0]
          .trim() || "your identity"
      : "your identity";

  return (
    <AuthBackground>
      <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">

          {/* Brand */}

          <div className="mb-8 text-center lg:hidden">
            <Link
              to="/login"
              className="inline-block text-2xl font-black tracking-tight text-white"
            >
              TREND<span className="text-blue-400">AFRICA</span>
            </Link>
          </div>

          {/* Main layout */}

          <div className="grid items-center gap-8 lg:grid-cols-[1fr_460px] lg:gap-14">

            {/* Identity section */}

            <section className="hidden lg:block">
              <div className="mb-6 max-w-md">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
                  Africa's digital community
                </p>

                <h1 className="text-4xl font-black tracking-tight text-white xl:text-5xl">
                  Your identity.
                  <br />
                  Your voice.
                  <br />
                  <span className="text-blue-400">
                    Your Africa.
                  </span>
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
                  Connect with people,
                  discover conversations,
                  and stay close to what
                  Africa is talking about.
                </p>
              </div>

              <InteractiveIdentityCard
                fullName={
                  identityName
                }
                username={
                  identityUsername
                }
              />
            </section>

            {/* Login section */}

            <section className="w-full">
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

                {/* Mobile card */}

                <div className="mb-8 lg:hidden">
                  <InteractiveIdentityCard
                    fullName={
                      identityName
                    }
                    username={
                      identityUsername
                    }
                  />
                </div>

                <LoginForm
                  onIdentityChange={
                    setIdentity
                  }
                />

              </div>
            </section>

          </div>

          {/* Footer */}

          <footer className="mt-8 text-center">
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} TrendAfrica
            </p>
          </footer>

        </div>
      </main>
    </AuthBackground>
  );
}
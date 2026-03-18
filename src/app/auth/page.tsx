"use client";

import Card from "@/components/Card/Card";
import LoginForm from "@/components/Form/LoginForm";
import RegisterForm from "@/components/Form/RegisterForm";
import {useState} from "react";

export default function Page() {
    const [isLogin, setIsLogin] = useState(true);

    const authBenefits = [
        "Track your listening activity in real-time.",
        "See your top artists, songs, and genres.",
        "Share your profile with friends.",
    ];

    return (
        <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:py-12">
            <header className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary">Account</p>
                <h1 className="text-3xl font-semibold">Welcome to PostToP</h1>
                <p className="text-sm text-text-secondary">Sign in or create an account to start tracking your music.</p>
            </header>

            <section className="grid grid-cols-12 gap-6">
                <Card className="col-span-12 md:col-span-5 space-y-5">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-text-primary">Why create an account?</h2>
                        <p className="text-sm text-text-secondary">
                            Your dashboard unlocks richer analytics and a shareable profile page.
                        </p>
                    </div>

                    <ul className="space-y-3">
                        {authBenefits.map(benefit => (
                            <li key={benefit} className="flex items-start gap-3 text-sm text-text-secondary">
                                <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-accent-primary" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card className="col-span-12 md:col-span-7 space-y-5">
                    <div className="inline-flex rounded-lg border border-border bg-surface-secondary p-1">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                isLogin ? "bg-accent-primary text-white" : "text-text-secondary hover:text-text-primary"
                            }`}>
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                !isLogin ? "bg-accent-primary text-white" : "text-text-secondary hover:text-text-primary"
                            }`}>
                            Register
                        </button>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-text-primary">{isLogin ? "Sign in" : "Create account"}</h2>
                        <p className="text-sm text-text-secondary">
                            {isLogin
                                ? "Use your username and password to continue."
                                : "Set up your account in a few seconds."}
                        </p>
                    </div>

                    {isLogin ? <LoginForm /> : <RegisterForm />}
                </Card>
            </section>
        </main>
    );
}

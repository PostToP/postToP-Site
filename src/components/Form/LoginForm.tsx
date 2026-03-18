import {useContext, useState} from "react";
import {AuthContext} from "@/context/AuthContext";

export default function LoginForm() {
    const {login} = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const inputClassName =
        "w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-primary focus:outline-none";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            await login(username, password);
            window.location.href = "/";
        } catch (caughtError) {
            console.error("Login error:", caughtError);
            setErrorMessage(caughtError instanceof Error ? caughtError.message : "Unable to sign in right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} method="post" className="space-y-4">
            <div className="space-y-1.5">
                <label htmlFor="login-username" className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                    Username
                </label>
                <input
                    id="login-username"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                    className={inputClassName}
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                    Password
                </label>
                <input
                    id="login-password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className={inputClassName}
                />
            </div>

            {errorMessage ? (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {errorMessage}
                </p>
            ) : null}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}

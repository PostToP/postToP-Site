import {useContext, useState} from "react";
import {AuthContext} from "@/context/AuthContext";

export default function RegisterForm() {
    const {register} = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const inputClassName =
        "w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-primary focus:outline-none";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const email = formData.get("email") as string;

        try {
            await register(username, password, email);
            event.currentTarget.reset();
            setSuccessMessage("Account created successfully. You can switch to Login now.");
        } catch (caughtError) {
            console.error("Register error:", caughtError);
            setErrorMessage(caughtError instanceof Error ? caughtError.message : "Unable to register right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} method="post" className="space-y-4">
            <div className="space-y-1.5">
                <label
                    htmlFor="register-username"
                    className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                    Username
                </label>
                <input
                    id="register-username"
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    autoComplete="username"
                    required
                    className={inputClassName}
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="register-password"
                    className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                    Password
                </label>
                <input
                    id="register-password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    className={inputClassName}
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="register-email"
                    className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                    Email
                </label>
                <input
                    id="register-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className={inputClassName}
                />
            </div>

            {errorMessage ? (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {errorMessage}
                </p>
            ) : null}
            {successMessage ? (
                <p className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-300">
                    {successMessage}
                </p>
            ) : null}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? "Creating account..." : "Create account"}
            </button>
        </form>
    );
}

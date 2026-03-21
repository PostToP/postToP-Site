"use client";

import {useRouter} from "next/navigation";
import {type FormEvent, useContext, useEffect, useState} from "react";
import Card from "@/components/Card/Card";
import DeleteConfirmationModal from "@/components/Modal/DeleteConfirmationModal";
import {AuthContext} from "@/context/AuthContext";
import UserBackend, {type UserProfile, type UserUpdatePayload} from "@/utils/Backend/UserBackend";

type FormState = {
    email: string;
    displayName: string;
    handle: string;
    currentPassword: string;
    newPassword: string;
};

const emptyForm: FormState = {
    email: "",
    displayName: "",
    handle: "",
    currentPassword: "",
    newPassword: "",
};

export default function SettingsPage() {
    const {user, loading, setUser} = useContext(AuthContext);
    const router = useRouter();

    const [form, setForm] = useState<FormState>(emptyForm);
    const [initialHandle, setInitialHandle] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [status, setStatus] = useState<"idle" | "saving" | "error" | "success">("idle");
    const [error, setError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/auth");
        }
    }, [loading, user, router]);

    useEffect(() => {
        async function loadProfile() {
            if (!user) return;
            setProfileLoading(true);
            const res = await UserBackend.getUserInfo(user.handle);
            if (res.ok) {
                const data: UserProfile = res.data;
                setForm(prev => ({
                    ...prev,
                    handle: data.handle ?? user.handle,
                    displayName: data.displayName ?? data.display_name ?? data.username ?? prev.displayName,
                    email: data.email ?? data.mail ?? "",
                }));
                setInitialHandle(data.handle ?? user.handle);
            } else {
                setError(res.error);
            }
            setProfileLoading(false);
        }

        loadProfile();
    }, [user]);

    const handleChange = (field: keyof FormState, value: string) => {
        setForm(prev => ({...prev, [field]: value}));
    };

    const handleDeleteAccount = () => {
        UserBackend.deleteUserAccount(user!.handle).then(res => {
            if (res.ok) {
                setUser(null);
                router.replace("/auth");
            } else {
                setError(res.error);
            }
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user) return;

        if (form.newPassword && !form.currentPassword) {
            setError("Enter your current password to set a new one.");
            setStatus("error");
            return;
        }

        const payload: UserUpdatePayload = {
            email: form.email.trim() || undefined,
            displayName: form.displayName.trim() || undefined,
            handle: form.handle.trim() || undefined,
            currentPassword: form.newPassword ? form.currentPassword || undefined : undefined,
            newPassword: form.newPassword || undefined,
        };

        setStatus("saving");
        setError(null);

        const res = await UserBackend.updateUserInfo(user.handle, payload);

        if (!res.ok) {
            setStatus("error");
            setError(res.error);
            return;
        }

        if (payload.handle && payload.handle !== user.handle) {
            setUser({...user, handle: payload.handle});
            setInitialHandle(payload.handle);
        }

        setStatus("success");
        setForm(prev => ({...prev, currentPassword: "", newPassword: ""}));
    };

    if (!user && !loading) {
        return null;
    }

    return (
        <div className="p-6">
            <div className="mb-6 space-y-1">
                <h1 className="text-3xl font-semibold">Settings</h1>
                <p className="text-text-secondary">Update your account details and password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Card className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Account</h2>
                        <p className="text-sm text-text-secondary">Public profile details visible to others.</p>
                    </div>

                    {profileLoading ? (
                        <p className="text-text-secondary">Loading your profile...</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
                                Display name
                                <input
                                    type="text"
                                    value={form.displayName}
                                    onChange={event => handleChange("displayName", event.target.value)}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    placeholder="What should we call you?"
                                />
                            </label>

                            <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
                                Handle
                                <input
                                    type="text"
                                    value={form.handle}
                                    onChange={event => handleChange("handle", event.target.value)}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    placeholder="your-handle"
                                />
                                {initialHandle && form.handle !== initialHandle && (
                                    <span className="text-xs text-text-secondary">
                                        Changing your handle will also update your profile URL.
                                    </span>
                                )}
                            </label>

                            <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary md:col-span-2">
                                Email
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={event => handleChange("email", event.target.value)}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    placeholder="you@example.com"
                                />
                            </label>
                        </div>
                    )}
                </Card>

                <Card className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Password</h2>
                        <p className="text-sm text-text-secondary">Update only if you want a new password.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
                            Current password
                            <input
                                type="password"
                                value={form.currentPassword}
                                onChange={event => handleChange("currentPassword", event.target.value)}
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-sm font-medium text-text-secondary">
                            New password
                            <input
                                type="password"
                                value={form.newPassword}
                                onChange={event => handleChange("newPassword", event.target.value)}
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                        </label>
                    </div>

                    <p className="text-xs text-text-secondary">
                        We only change your password when both fields are filled in.
                    </p>
                </Card>

                {error && <p className="text-sm text-red-500">{error}</p>}
                {status === "success" && <p className="text-sm text-green-600">Settings updated.</p>}

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={status === "saving" || profileLoading}
                        className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60">
                        {status === "saving" ? "Saving..." : "Save changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setForm(emptyForm);
                            setStatus("idle");
                            setError(null);
                        }}
                        disabled={status === "saving" || profileLoading}
                        className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-primary shadow-sm transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60">
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="rounded-lg border border-red-600 bg-red-50 px-4 py-2 text-sm text-red-600 shadow-sm transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60">
                        Delete account
                    </button>
                    {status === "saving" && <span className="text-sm text-text-secondary">Updating your profile…</span>}
                </div>
            </form>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        </div>
    );
}

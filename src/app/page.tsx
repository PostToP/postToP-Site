import Link from "next/link";
import Card from "@/components/Card/Card";
import ServerBackend from "@/utils/Backend/ServerBackend";

export let revalidate = 60 * 60 * 1;

export default async function Home() {
    const serverStats = await ServerBackend.getStats();
    if (!serverStats.ok) {
        console.error("Failed to fetch server stats:", serverStats.error);
    }

    return (
        <main className="space-y-4">
            <Card>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0 py-8">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-bold text-text-primary">PostTop</h1>
                        <p className="text-xl text-text-secondary">
                            Track your music listening habits in real-time on YouTube
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/auth"
                            className="px-6 py-2 bg-accent-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-all">
                            Get Started
                        </Link>
                        <Link
                            href="/auth"
                            className="px-6 py-2 bg-background-tertiary text-text-primary font-medium rounded-lg hover:bg-background-secondary transition-all">
                            Sign In
                        </Link>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                    <Card>
                        <div className="space-y-2">
                            <p className="text-text-secondary text-sm">Active Clients</p>
                            <p className="text-3xl font-bold text-text-primary">
                                {serverStats.ok ? serverStats.data.data.activeUsers : "N/A"}
                            </p>
                            <p className="text-xs text-accent-primary">
                                {serverStats.ok ? serverStats.data.data.connectedUsers : "N/A"} actively listening
                            </p>
                        </div>
                    </Card>
                </div>
                <div className="col-span-3">
                    <Card>
                        <div className="space-y-2">
                            <p className="text-text-secondary text-sm">Songs Tracked</p>
                            <p className="text-3xl font-bold text-text-primary">
                                {serverStats.ok ? serverStats.data.data.musicVideos : "N/A"}
                            </p>
                            <p className="text-xs text-text-secondary">Total songs tracked</p>
                        </div>
                    </Card>
                </div>
                <div className="col-span-3">
                    <Card>
                        <div className="space-y-2">
                            <p className="text-text-secondary text-sm">Artists Tracked</p>
                            <p className="text-3xl font-bold text-text-primary">
                                {serverStats.ok ? serverStats.data.data.musicArtists : "N/A"}
                            </p>
                            <p className="text-xs text-text-secondary">All genres</p>
                        </div>
                    </Card>
                </div>
                <div className="col-span-3">
                    <Card>
                        <div className="space-y-2">
                            <p className="text-text-secondary text-sm">Listening Hours</p>
                            <p className="text-3xl font-bold text-text-primary">
                                {serverStats.ok ? Math.round(serverStats.data.data.totalListenedHours) : "N/A"}
                            </p>
                            <p className="text-xs text-text-secondary">Total tracked</p>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4 row-span-2">
                    <Card>
                        <div className="space-y-4 h-full flex flex-col">
                            <div className="w-12 h-12 bg-accent-primary rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <title>Music Sharing Icon</title>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-text-primary">Real-Time Music Sharing</h3>
                            <p className="text-text-secondary">
                                Share what you're listening to in real-time via{" "}
                                <span className="text-accent-primary">Websocket</span> or{" "}
                                <span className="text-accent-primary">Embeds</span>. Keep your followers updated with
                                live progress tracking.
                            </p>
                            <div className="flex-1" />
                            <div className="bg-background-tertiary p-3 rounded-lg">
                                <p className="text-xs text-text-secondary">Live updates instantly</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-span-4 row-span-2">
                    <Card>
                        <div className="space-y-4 h-full flex flex-col">
                            <div className="w-12 h-12 bg-accent-primary rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <title>Analytics Icon</title>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-text-primary">Detailed Analytics</h3>
                            <p className="text-text-secondary">
                                Explore comprehensive statistics about your listening habits. View top artists, favorite
                                genres, and activity patterns with beautiful charts.
                            </p>
                            <div className="flex-1" />
                            <div className="bg-background-tertiary p-3 rounded-lg">
                                <p className="text-xs text-text-secondary">Interactive visualizations</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-span-4 row-span-2">
                    <Card>
                        <div className="space-y-4 h-full flex flex-col">
                            <div className="w-12 h-12 bg-accent-primary rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <title>AI Icon</title>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-text-primary">AI Driven</h3>
                            <p className="text-text-secondary">
                                Leverage AI to filter out videos that aren't music, ensuring accurate tracking of your
                                listening habits. Normalize metadata for better insights.
                            </p>
                            <div className="flex-1" />
                            <div className="bg-background-tertiary p-3 rounded-lg">
                                <p className="text-xs text-text-secondary">AI-enhanced accuracy</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8">
                    <Card>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-medium">How it works</h2>
                            <div className="grid grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <div className="flex gap-3 items-start">
                                        <span className="text-2xl text-accent-primary font-bold">1</span>
                                        <div>
                                            <h4 className="font-medium text-text-primary">Create an Account</h4>
                                            <p className="text-sm text-text-secondary">
                                                Sign up quickly with your email to get started
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-3 items-start">
                                        <span className="text-2xl text-accent-primary font-bold">2</span>
                                        <div>
                                            <h4 className="font-medium text-text-primary">Download the Extension</h4>
                                            <p className="text-sm text-text-secondary">
                                                Install our browser extension to connect with YouTube
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-3 items-start">
                                        <span className="text-2xl text-accent-primary font-bold">3</span>
                                        <div>
                                            <h4 className="font-medium text-text-primary">Listen Normally</h4>
                                            <p className="text-sm text-text-secondary">
                                                Enjoy your music like you always do
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-3 items-start">
                                        <span className="text-2xl text-accent-primary font-bold">4</span>
                                        <div>
                                            <h4 className="font-medium text-text-primary">View Analytics</h4>
                                            <p className="text-sm text-text-secondary">
                                                Explore your stats and listening patterns
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-3 items-start">
                                        <span className="text-2xl text-accent-primary font-bold">5</span>
                                        <div>
                                            <h4 className="font-medium text-text-primary">Share Profile</h4>
                                            <p className="text-sm text-text-secondary">
                                                Let friends see your music taste
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-span-4">
                    <Card>
                        <div className="space-y-4 h-full flex flex-col">
                            <h2 className="text-xl font-medium">Ready to start?</h2>
                            <p className="text-text-secondary text-sm">
                                Join thousands of music lovers tracking their listening journey. Get started in less
                                than a minute.
                            </p>
                            <div className="flex-1" />
                            <Link
                                href="/auth"
                                className="block text-center px-6 py-3 bg-accent-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-all">
                                Create Free Account
                            </Link>
                            <p className="text-xs text-text-secondary text-center">No credit card required</p>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                    <Card>
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-text-primary">What you get</h3>
                            <ul className="space-y-2 text-text-secondary text-sm">
                                <li className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-accent-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <title>Check Icon</title>

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Real-time listening status with progress tracking
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-accent-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <title>Check Icon</title>

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Top artists and songs with customizable date ranges
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-accent-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <title>Check Icon</title>

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Genre distribution with interactive radar charts
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-accent-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <title>Check Icon</title>

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Complete listening history with search and filters
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-accent-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <title>Check Icon</title>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Shareable profile pages for friends
                                </li>
                            </ul>
                        </div>
                    </Card>
                </div>

                <div className="col-span-6">
                    <Card>
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-text-primary">Platform Features</h3>
                            <ul className="space-y-2 text-text-secondary text-sm">
                                <li className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-accent-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <title>Security Icon</title>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    Secure authentication and data encryption
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-accent-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <title>Lightning Icon</title>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                    Fast, responsive interface with live updates
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-accent-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <title>Mobile Icon</title>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Mobile-friendly design for on-the-go access
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-accent-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <title>Chat Icon</title>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                        />
                                    </svg>
                                    Regular updates and new features
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-accent-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <title>Community Icon</title>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    Growing community of music enthusiasts
                                </li>
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}

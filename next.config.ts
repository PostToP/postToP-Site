import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{ hostname: "yt3.ggpht.com" },
			{ hostname: "i.ytimg.com" },
		],
	},
};

export default nextConfig;

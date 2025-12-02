import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Transpila módulos ESM que causan problemas con require()
  transpilePackages: [
    "tokenlens",
    "use-stick-to-bottom",
    "streamdown",
    "@cloudinary/url-gen",
    "nanoid",
  ],
};

export default nextConfig;

import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/discover",
        destination: "/find",
        permanent: true,
      },
      {
        source: "/directory",
        destination: "/find",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "getservihub",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  }
});
EOFcat > next.config.ts << 'EOF'
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/discover",
        destination: "/find",
        permanent: true,
      },
      {
        source: "/directory",
        destination: "/find",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "getservihub",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  }
});

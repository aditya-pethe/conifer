/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : "/api/",
      },
    ];
  },
  images: {
    domains: ['img.youtube.com'],
  },
  experimental: {
    legacyBrowsers: false,
    outputFileTracingIgnores: ['**canvas**','**swc/core**'],
    outputFileTracingExcludes: {
      '*': [
        // prettier-ignore
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },
};

module.exports = nextConfig;

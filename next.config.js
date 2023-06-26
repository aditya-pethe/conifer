/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "https://conifer-c31e80536881.herokuapp.com/api/:path*", // Update with your Heroku server URL
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

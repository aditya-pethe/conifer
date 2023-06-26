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
  }
};

module.exports = nextConfig;

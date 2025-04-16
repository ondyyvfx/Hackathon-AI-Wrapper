const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: "/Hackathon-AI-Wrapper",
};

module.exports = nextConfig;

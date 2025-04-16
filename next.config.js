const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: "/Hackathon-AI-Wrapper",
  ...(isProd && {
  }),
};

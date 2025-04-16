const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/Hackathon-AI-Wrapper' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

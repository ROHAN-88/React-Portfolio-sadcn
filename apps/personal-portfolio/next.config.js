// @ts-check

const { composePlugins, withNx } = require('@nx/next');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disable in dev
});

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  compiler: {
    removeConsole: process.env.APP_ENV === 'production',
  },
  nx: {
    svgr: false,
  },
};

// 👇 Compose both Nx and PWA plugins
const plugins = [
  withNx,
  withPWA, // add this in the list instead of calling separately
];

// 👇 Export combined config
module.exports = composePlugins(...plugins)(nextConfig);

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     swcMinify: true,
//     images: {
//       domains: ['bet-provider.coolify.tgapps.cloud'],
//     },
//     async redirects() {
//       return [
//         {
//           source: '/',
//           destination: '/dashboard',
//           permanent: true,
//         },
//       ];
//     },
//   }
  
//   module.exports = nextConfig
// next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'https://bet-provider.coolify.tgapps.cloud/api/:path*',
//       },
//     ];
//   },
// };

// module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://bet-provider.coolify.tgapps.cloud/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
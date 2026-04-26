import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  async redirects() {
    return [
      {
        source: '/go/tax-plan',
        destination: 'https://www.finnomena.com/tax-saving-fund/',
        permanent: false,
      },
      {
        source: '/go/tax-plan-high',
        destination: 'https://www.rd.go.th',
        permanent: false,
      },
      {
        source: '/go/thai-esg',
        destination: 'https://www.thaiesg.com',
        permanent: false,
      },
      {
        source: '/go/refinance',
        destination: 'https://www.bot.or.th',
        permanent: false,
      },
      {
        source: '/go/refinance-premium',
        destination: 'https://www.bot.or.th',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        turbo: {
            resolveAlias: {
                '@': './',
            },
        },
    },
    i18n: {
        locales: ['en', 'si', 'ta'],
        defaultLocale: 'en',
    },
}

module.exports = nextConfig

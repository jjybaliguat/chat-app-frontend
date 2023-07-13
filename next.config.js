/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        nodeEnv: 'development',
        DEV_APP_API: 'http://localhost:5000',
        PRODUCTION_APP_API: 'https://api.rdnaksnds.com',
        DEV_APP_URL: 'http://localhost:3000',
        // APP_URL: 'https://rdnaksnds.com',
    }
}

module.exports = nextConfig

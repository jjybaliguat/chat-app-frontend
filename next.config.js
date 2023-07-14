/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        nodeEnv: 'production',
        DEV_APP_API: 'http://localhost:5000',
        PRODUCTION_APP_API: 'https://chat.rdnaksnds.com/',
        DEV_APP_URL: 'http://localhost:3000',
        // APP_URL: 'https://rdnaksnds.com',
    }
}

module.exports = nextConfig

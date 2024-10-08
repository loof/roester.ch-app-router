/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/roasts/next",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;

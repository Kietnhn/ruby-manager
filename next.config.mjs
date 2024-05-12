/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com"],
    },
    // webpack: (config) => {
    //     config.externals = [...config.externals, "bcrypt"];
    //     return config;
    // },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/dashboard",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;

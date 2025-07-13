import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"cendekia-lms.fly.storage.tigris.dev",
      }
    ]
  }
};

export default nextConfig;

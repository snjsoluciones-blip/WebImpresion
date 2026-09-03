import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Calidades usadas por la web pública (galería 80, renders técnicos 70).
    qualities: [70, 75, 80],
  },
};

export default nextConfig;

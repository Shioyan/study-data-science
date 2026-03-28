import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  outputFileTracingIncludes: {
    "/grade/[grade]": ["./src/content/**/*", "./src/quizzes/**/*"],
    "/grade/[grade]/quiz": ["./src/content/**/*", "./src/quizzes/**/*"],
  },
};

export default nextConfig;

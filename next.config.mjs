/** @type {import('next').NextConfig} */
const patterns = [
  {
    protocol: "https",
    hostname: "placehold.co",
    pathname: "/**",
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    const host = new URL(supabaseUrl).hostname;
    patterns.push({
      protocol: "https",
      hostname: host,
      pathname: "/storage/v1/object/public/**",
    });
  } catch {
    /* ignore invalid env during config load */
  }
}

const nextConfig = {
  images: {
    remotePatterns: patterns,
  },
};

export default nextConfig;

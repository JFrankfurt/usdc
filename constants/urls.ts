export const CLOUDFARE_IPFS_PROXY = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
  ? `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}`
  : "https://cloudflare-ipfs.com";

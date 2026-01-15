export CLOUDFLARE_API_TOKEN=qLCjEBds5p0fWw24lIJ0kQ620t0ceXWz_VdHXo03
export CLOUDFLARE_ACCOUNT_ID=07857abaded9baf4472ebf60580e593f

pnpm install
pnpm build

pnpm wrangler pages deploy --branch="main"
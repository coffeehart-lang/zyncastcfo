# Deploy Zyncast CFO to Cloudflare Workers

This guide walks you through deploying the Zyncast CFO forecasting app to Cloudflare Workers.

## Prerequisites

1. **Node.js** installed
2. **Cloudflare Account** (free tier works)
3. **Gemini API Key** from [Google AI Studio](https://ai.studio)

## Step-by-Step Deployment

### 1. Install Dependencies

```bash
cd "C:\Users\coffe\Downloads\zyncastcfo"
npm install
```

### 2. Set Up Cloudflare CLI

```bash
# Install/login to Cloudflare Wrangler
npx wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### 3. Configure Your API Key

Store your Gemini API key as a Cloudflare secret:

```bash
npx wrangler secret put GEMINI_API_KEY
```

When prompted, paste your Gemini API key and press Enter.

### 4. Build the Project

```bash
npm run build
```

This will:
- Build the React frontend with Vite
- Bundle the Worker handler (ESM format)

### 5. Deploy to Cloudflare Workers

```bash
npm run deploy
```

Or directly:

```bash
npx wrangler deploy
```

### 6. Get Your Live URL

After deployment, you'll see output like:

```
✨ Uploaded zyncastcfo to Cloudflare Workers
🌍 Your Worker is published and running at:
   https://zyncastcfo.[your-account].workers.dev
```

## Testing Your Deployment

### Check Health Endpoint

```bash
curl https://zyncastcfo.[your-account].workers.dev/api/health
```

Expected response:
```json
{"status":"ok","time":"2026-07-10T..."}
```

### Test CFO Advisor

```bash
curl -X POST https://zyncastcfo.[your-account].workers.dev/api/advisor/summary \
  -H "Content-Type: application/json" \
  -d '{
    "transactions": [
      {"date": "2024-01-01", "amount": 5000, "category": "Revenue"},
      {"date": "2024-01-02", "amount": -1200, "category": "Expenses"}
    ],
    "customPrompt": "What should I focus on for Q1?"
  }'
```

## Troubleshooting

### Secret Not Found Error
```bash
# Re-add the secret
npx wrangler secret put GEMINI_API_KEY
```

### Deployment Fails
```bash
# Clean build and try again
npm run clean
npm run build
npm run deploy
```

### Check Logs
```bash
npx wrangler tail
```

## Environment Variables

These are configured in `wrangler.toml`:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key (set via `wrangler secret put`) |

## Updating Code

After making changes:

```bash
npm run build
npm run deploy
```

## Rollback

To view previous deployments:

```bash
npx wrangler deployments list
```

To rollback to a previous version, redeploy or contact Cloudflare support.

## Cost

- **Free tier**: 100,000 requests/day
- **Paid**: $0.50 per million requests beyond free tier

Gemini API costs apply separately based on token usage.

---

Need help? Check the [Cloudflare Workers docs](https://developers.cloudflare.com/workers/) or [Wrangler CLI docs](https://developers.cloudflare.com/workers/wrangler/).

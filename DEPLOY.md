# 🚀 One-Click Deployment

Deploy REI Voice Pro to production with a single click using these buttons.

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Frei-voice-pro&env=VITE_GEMINI_API_KEY&envDescription=Gemini%20API%20Key%20from%20Google%20AI%20Studio&envLink=https%3A%2F%2Faistudio.google.com%2Fapikey&project-name=rei-voice-pro&repository-name=rei-voice-pro)

**What happens:**
1. Forks the repository to your GitHub account
2. Creates a new Vercel project
3. Prompts you to enter your `VITE_GEMINI_API_KEY`
4. Deploys automatically

**After deployment:**
- Your app will be live at `https://your-project.vercel.app`
- Every push to `main` branch auto-deploys
- Free SSL certificate included
- Global CDN enabled

---

## Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/rei-voice-pro)

**What happens:**
1. Connects to your GitHub account
2. Creates a new Netlify site
3. Configures build settings automatically
4. Deploys your app

**After deployment:**
1. Go to **Site Settings** → **Environment Variables**
2. Add `VITE_GEMINI_API_KEY` with your API key
3. Trigger a redeploy from **Deploys** tab

---

## Deploy to Cloudflare Pages

**Steps:**
1. Push code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Navigate to **Workers & Pages** → **Create application** → **Pages**
4. Connect your GitHub repository
5. Configure:
   - **Build command**: `npm run build`
   - **Build output**: `dist`
6. Add environment variable `VITE_GEMINI_API_KEY`
7. Deploy

---

## Manual Deployment

If you prefer manual deployment, see the [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## Environment Variables

All deployment platforms require this environment variable:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_GEMINI_API_KEY` | Your Gemini API key | [Google AI Studio](https://aistudio.google.com/apikey) |

---

## Post-Deployment Security

After deploying, secure your API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your API key
4. Add **Application restrictions** → **HTTP referrers**
5. Add your production domain: `https://your-app.vercel.app/*`
6. Save changes

This prevents unauthorized use of your API key.

---

## Need Help?

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify Documentation**: [docs.netlify.com](https://docs.netlify.com)
- **Cloudflare Pages**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)

---

**Ready to deploy? Click one of the buttons above!**

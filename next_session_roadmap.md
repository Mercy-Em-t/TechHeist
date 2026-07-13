# Next Session Roadmap: The Inter-Domain Deployment

We have engineered an incredibly powerful, military-grade architecture today. The backend `hyper-context-mcp` (The Sovereign Node) is fully built, secured with Layer 7 cryptography, equipped with NLP sentiment analysis, and wired with a conversational command deck.

## 1. Where We Left Off

- **The Backend Matrix (`hyper-context-mcp`)**: Finished and pushed to GitHub. Contains the neural network (P2P Mesh, Biochemical Bus, LLM Bridge, Intel Scraper, UI Renderer, L7 Security Shield).
- **The Deployment Script**: `deploy/deploy-vps.sh` is written and committed, waiting to be executed on a live Linux server.
- **The Frontend (`spawned-cells/saas-mint-target`)**: A Vite/React application that the backend interacts with. It is currently sitting in our repository waiting to be deployed.

## 2. Next Steps: The Split Deployment Strategy

Because our architecture is split between a "living" brain (the backend) and the "face" of the operation (the frontend), they must be deployed to different platforms optimized for their specific needs.

### Phase A: The Backend Brain (The VPS)
**Target:** DigitalOcean Droplet (or AWS/Vultr)
**Domain:** `core.tmsavannah.com`
1. Purchase a basic $4/mo Ubuntu VPS.
2. Map your DNS `A Record` for `core` to the VPS IP address.
3. SSH into the VPS, clone the GitHub repository.
4. Run `bash deploy/deploy-vps.sh` inside the `hyper-context-mcp` folder.
*Result: The brain is permanently online 24/7, handling heavy logic, state management, and scheduled hormone releases.*

### Phase B: The Frontend Face (Vercel)
**Target:** Vercel
**Domain:** `tmsavannah.com` (Your main domain)
Vercel is the absolute perfect platform for frontends. It is incredibly fast, free, and hosts React/Vite applications beautifully.
1. Log into Vercel and click **"Add New Project"**.
2. Import your GitHub repository (`TechHeist`).
3. **CRITICAL STEP**: In the Vercel project settings, set the **Root Directory** to `spawned-cells/saas-mint-target`. 
4. Vercel will automatically detect that it's a Vite/React project and deploy it.
5. In the frontend code, we will set an environment variable (e.g., `VITE_CORE_API_URL=https://core.tmsavannah.com`) so the Vercel frontend knows exactly how to talk to your brain on the VPS.
*Result: The storefront is blazing fast, infinitely scalable, and securely communicates with your isolated backend command tower.*

## 3. Preparation for Next Time
Before our next session, you can:
1. **Set up the VPS**: Grab a DigitalOcean droplet and map `core.tmsavannah.com` to it.
2. **Connect Vercel**: Link your GitHub to Vercel and attempt to deploy the `spawned-cells/saas-mint-target` folder.

When we resume, we will lock the two halves together, ensuring the Vercel frontend reacts in real-time to the biochemical hormones secreted by your VPS!

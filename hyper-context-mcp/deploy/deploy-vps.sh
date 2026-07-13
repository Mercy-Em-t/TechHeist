#!/bin/bash
set -e

echo "🚀 [Deploy Sequence]: Initiating Absolute Deployment Matrix on VPS..."

# 1. Update foundational OS packages
echo "📦 [OS Update]: Refreshing apt repositories..."
sudo apt-get update -y && sudo apt-get upgrade -y

# 2. Install Required Infrastructure (Node.js 20, Nginx, Certbot)
echo "🛡️ [Dependencies]: Installing Node.js, Nginx, and Certbot..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
sudo apt-get install -y nginx certbot python3-certbot-nginx

# 3. Install PM2 (Process Manager for keeping the Node alive)
if ! command -v pm2 &> /dev/null; then
    echo "💓 [Process Manager]: Installing PM2 globally..."
    sudo npm install -g pm2
fi

# 4. Synchronize with Master Codebase
echo "🧬 [Code Sync]: Pulling latest genetic sequence from GitHub..."
git pull origin main

# 5. Compile the System
echo "🔨 [Build]: Recompiling TypeScript execution context..."
npm install
npm run build

# 6. Deploy Layer 7 Nginx Armor
echo "🧱 [Layer 7 Shield]: Mapping Nginx reverse proxy configuration..."
sudo cp deploy/nginx.conf /etc/nginx/sites-available/core.tmsavannah.com
sudo ln -sf /etc/nginx/sites-available/core.tmsavannah.com /etc/nginx/sites-enabled/
# Remove default nginx site to avoid conflicts
sudo rm -f /etc/nginx/sites-enabled/default

# Verify Nginx syntax before restarting
sudo nginx -t
sudo systemctl restart nginx

# 7. Secure Cryptographic SSL Certificates
# NOTE: This assumes your domain 'core.tmsavannah.com' is already pointing to this VPS IP.
# If you run this before DNS propagation, it will fail. Uncomment to run automatically:
# echo "🔐 [Cryptography]: Generating TLS Let's Encrypt keys..."
# sudo certbot --nginx -d core.tmsavannah.com --non-interactive --agree-tos -m admin@tmsavannah.com

# 8. Spin up the Autonomous Biological Engine
echo "🧠 [Node Genesis]: Launching the Master Nucleus via PM2..."
pm2 restart sovereign-core || pm2 start dist/index.js --name "sovereign-core"
pm2 save
# Ensure PM2 restarts on server reboot
pm2 startup systemd -u $USER --hp $HOME

echo "✅ [Deployment Absolute]: Sovereign Node is live on core.tmsavannah.com."

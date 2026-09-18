# Relax Therapy — Medical Booking Frontend

This is the production React/TypeScript frontend web application built with Vite and TailwindCSS for the Relax Therapy medical booking platform. It features full dual-language support (English/Arabic), real-time scheduling slots, a patient dashboard, a doctor dashboard, and an admin management interface.

---

## Production VPS Deployment Guide

Follow these steps to build and serve the frontend on your target Virtual Private Server (VPS).

### Step 1: Install Nginx
Nginx is highly recommended for serving compiled static frontend assets:
```bash
sudo apt-get update
sudo apt-get install -y nginx nodejs build-essential
```

### Step 2: Build and Compile the Frontend
```bash
# Clone the repository
git clone https://github.com/vrdq/MedicalBookingHub.git
cd MedicalBookingHub/MedicalBookingFrontend

# Install dependencies
npm install

# Set Vite's base API path to route through the Nginx proxy
echo "VITE_API_URL=/api" > .env.production

# Build static assets (produces static files inside the dist/ folder)
npm run build

# Copy build assets to Nginx web directory
sudo mkdir -p /var/www/medical-frontend
sudo cp -r dist/* /var/www/medical-frontend/
```

### Step 3: Configure Nginx Site Proxy
Create a configuration file at `/etc/nginx/sites-available/medical-booking`:
```nginx
server {
    listen 80;
    server_name your_domain.com; # Replace with your domain or VPS IP address

    # Serve static frontend assets
    location / {
        root /var/www/medical-frontend;
        try_files $uri $uri/ /index.html;
        gzip_static on;
    }

    # Reverse Proxy to node/express backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 2M; # Aligns with the 2MB upload limit
    }
}
```
Enable the site configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/medical-booking /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

# Relax Therapy — Medical Booking Backend

This is the production Node.js/Express server for the Relax Therapy medical booking platform. It connects to a PostgreSQL database, handles user authentication, doctor applications, slot management, appointment bookings, and payment status updates.

---

## Production VPS Deployment Guide

Follow these steps to deploy the backend on your target Virtual Private Server (VPS).

### Step 1: Install System Prerequisites
Log in to your VPS and install Node.js (v20+), PostgreSQL, and PM2 (process manager):
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

# Install PM2 globally to keep the server running
sudo npm install -y pm2 -g

# Install PostgreSQL database server
sudo apt-get install -y postgresql postgresql-contrib
```

### Step 2: Configure the Database
Create the PostgreSQL database and configure an application user:
```bash
# Create database
sudo -u postgres psql -c "CREATE DATABASE medical_booking;"

# Create database user with a secure password
sudo -u postgres psql -c "CREATE USER medical_user WITH PASSWORD 'your_secure_password';"

# Grant permissions
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE medical_booking TO medical_user;"
```

### Step 3: Clone, Configure, and Run the Backend
```bash
# Clone the repository
git clone https://github.com/vrdq/MedicalBookingHub.git
cd MedicalBookingHub/MedicalBookingBackend

# Install dependencies
npm install

# Create a production environment config (.env)
cat <<EOT >> .env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://medical_user:your_secure_password@127.0.0.1:5432/medical_booking
JWT_SECRET=YOUR_RANDOM_JWT_SECRET_STRING_HERE
EOT

# Apply the database schema migrations
DATABASE_URL=postgresql://medical_user:your_secure_password@127.0.0.1:5432/medical_booking npm run push

# Build the production backend bundle
npm run build

# Start the server using PM2
pm2 start ./dist/index.mjs --name medical-backend
pm2 save
pm2 startup
```

### Step 4: Configure Nginx Reverse Proxy
To serve requests securely and forward frontend requests to the backend, install Nginx:
```bash
sudo apt-get install -y nginx
```
Create a site configuration file at `/etc/nginx/sites-available/medical-booking`:
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

    # Reverse Proxy to Node/Express backend
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

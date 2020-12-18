
## Configuration

Make sure to add your own configurations in `./config.js`.


## Development Mode

```javascript
// Install dependencies for server & client
npm install && npm run client-install

// Run client & server with concurrently
npm run dev

// Server runs on http://localhost:5000 and client on http://localhost:3000
```


## Production Mode

### Clone repository
```sh
cd ~ && git clone https://gitlab.com/crossoft-miller/service-controller
```

### Install PM2 and run backend
```sh
# Install PM2 using NPM
npm install pm2 -g
# Run backend
cd ~/service-controller && npm install && sudo pm2 start server.js
```

### Install NGINX and Configure
```sh
# Install NGINX using apt-get
sudo apt-get update && sudo apt-get install nginx
# Configure NGINX
sudo rm /etc/nginx/sites-available/default
sudo nano /etc/nginx/sites-available/default
```
```sh
# Paste in the following config
server {
  listen 80 default_server;
  server_name _;

  location / {
    root ~/service-controller/client/build;
    try_files $uri /index.html;
  }

  location /api/ {
    proxy_pass http://localhost:5000/;
}
```
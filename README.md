## Configuration
Copy `./config.js.example` to `./config.js` and update with your own configurations.

## Update
### Pull repository
```sh
cd /opt/service-controller && sudo git pull origin master
```
### Restart backend
```sh
sudo pm2 kill && cd /opt/service-controller && sudo pm2 start server.js
```
### Restart NGINX
```sh
sudo service nginx restart
```


## Development Mode
### Clone repository
```sh
cd ~ && git clone https://gitlab.com/crossoft-miller/service-controller
```
### PreConfig bit.dev login and register
```sh
# To configure the registry manually, use the npm config command.
npm config set @bit:registry https://node.bit.dev
# To install private components use npm login. Use your Bit credentials to login.
npm login --registry=https://node.bit.dev --scope=@bit
```
### Install dependencies and run
```sh
# Install dependencies for server & client
npm install && npm run client-install
# Run client & server with concurrently
npm run dev
# Server runs on http://localhost:5000 and client on http://localhost:3000
```

## Production Mode
### Clone repository
```sh
cd /opt && sudo git clone https://gitlab.com/crossoft-miller/service-controller
```
### Install PM2 and run backend
```sh
# Install PM2 using NPM
sudo npm install pm2 -g
# Run backend
cd /opt/service-controller && sudo npm install && sudo pm2 start server.js
```
### Install NGINX and Configure
```sh
# Install NGINX using apt-get
sudo apt-get update && sudo apt-get install nginx
# Configure NGINX
sudo rm /etc/nginx/sites-available/default
sudo nano /etc/nginx/sites-available/default
```
Paste in the following config
```sh
server {
  listen 80 default_server;
  server_name _;

  location / {
    root /opt/service-controller/client/build;
    try_files $uri /index.html;
  }

  location /api/ {
    proxy_pass http://localhost:5000/;
  }

  location /ws {
    proxy_pass http://localhost:8000;
    # this magic is needed for WebSocket
    proxy_http_version  1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Run on web browser
Open http://localhost or http://ipaddress on web browser

## WebSocket Server
WebSocket server is running on ws://localhost/ws or ws://ipaddress/ws

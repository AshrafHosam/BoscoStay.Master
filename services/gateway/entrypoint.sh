#!/bin/sh

cat > /etc/nginx/nginx.conf <<EOF
events { }

http {
    server {
        listen 80;

        location /booking/ {
            proxy_pass http://booking-node:3000/;
        }

        location /apartments/ {
            proxy_pass http://apartments-dotnet:8080/;
        }

        location /search/ {
            proxy_pass http://java-service:8080/;
        }
    }
}
EOF

# Start nginx in foreground
nginx -g "daemon off;"
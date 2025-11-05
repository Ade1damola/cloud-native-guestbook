# Start with Nginx (web server)
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy website files
COPY *.html *.css *.js /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Nginx starts automatically
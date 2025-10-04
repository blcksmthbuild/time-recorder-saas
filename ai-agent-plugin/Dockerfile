FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vite build a static files generation
RUN npm run build 

# NGINX a static files fast serving
FROM nginx:alpine

# Copy the built files to the NGINX root directory
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html/dist

# NGINX default port
EXPOSE 80
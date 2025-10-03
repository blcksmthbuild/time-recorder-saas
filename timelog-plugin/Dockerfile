FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vite build a statikus fájlok generálásához
RUN npm run build 

# NGINX a statikus fájlok gyors kiszolgálásához
FROM nginx:alpine

# Másoljuk át a buildelt fájlokat az NGINX root könyvtárba
COPY --from=builder /app/dist /usr/share/nginx/html

# NGINX alapértelmezett port
EXPOSE 80
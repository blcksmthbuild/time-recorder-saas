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
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html/dist

# NGINX alapértelmezett port
EXPOSE 80
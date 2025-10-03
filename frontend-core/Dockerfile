# frontend-core/Dockerfile

# 1. BUILD STAGE:
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 💡 JAVÍTOTT RÉSZ: Csak a változó deklarációja
ARG VITE_FASTIFY_API_URL 
ENV VITE_FASTIFY_API_URL $VITE_FASTIFY_API_URL
RUN npm run build 

# 2. PRODUCTION STAGE:
FROM nginx:alpine
# Másoljuk át a buildelt fájlokat
COPY --from=builder /app/dist /usr/share/nginx/html

# A Core Shell-t egy másik porton futtatjuk (pl. 81)
EXPOSE 80
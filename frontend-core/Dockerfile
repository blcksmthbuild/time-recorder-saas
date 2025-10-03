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
ARG VITE_TIMELOG_ENTRY
ENV VITE_TIMELOG_ENTRY $VITE_TIMELOG_ENTRY
RUN npm run build 

# 2. PRODUCTION STAGE:
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# A Core Shell-t egy másik porton futtatjuk (pl. 81)
EXPOSE 80
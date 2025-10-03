# frontend-core/Dockerfile

# 1. BUILD STAGE:
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_FASTIFY_API_URL 
ENV VITE_FASTIFY_API_URL $VITE_FASTIFY_API_URL
ARG VITE_TIMELOG_ENTRY
ENV VITE_TIMELOG_ENTRY $VITE_TIMELOG_ENTRY
ARG VITE_AI_AGENT_ENTRY
ENV VITE_AI_AGENT_ENTRY $VITE_AI_AGENT_ENTRY
RUN npm run build 

# 2. PRODUCTION STAGE:
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
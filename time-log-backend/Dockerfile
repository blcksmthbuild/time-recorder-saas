# -----------------------------------------------------------------------
# 1. BUILD STAGE: Függőségek telepítése és a TypeScript/Kód buildelése
# -----------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Másoljuk a csomagfájlokat és telepítsük a függőségeket
# Ezt külön másoljuk, hogy kihasználjuk a Docker cache-t
COPY package*.json ./
RUN npm install

# Másoljuk a teljes forráskódot
COPY . .

RUN npx prisma generate

# Futtassuk a build parancsot (pl. tsc, vite build, stb.)
# 💡 Kérjük, győződj meg róla, hogy az "npm run build" létezik a package.json-ban,
#    és a végén az app kódja a /dist mappába kerül!
RUN npm run build 


# -----------------------------------------------------------------------
# 2. PRODUCTION STAGE: A futtató környezet (kisebb és biztonságosabb)
# -----------------------------------------------------------------------
FROM node:20-alpine

WORKDIR /app

# Másoljuk a package.json és a production függőségeket a builder stage-ből
COPY package*.json ./
# 💡 CSAK a production függőségeket telepítjük
RUN npm install --production

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client /app/node_modules/@prisma/client

COPY --from=builder /app/dist ./dist 

EXPOSE 3000

CMD ["node", "dist/server.js"] 
# 💡 Fontos: Frissítsd ezt a parancsot a valós indító fájlnevedre!
#    Ha a package.json-ban van egy "start" script, ami a production kódot indítja, akkor:
# CMD ["npm", "start"]
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE 2567

CMD ["node", "server.js"]
ARG NODE_VERSION=24.10.0
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN ls -la dist/ && echo "BUILD SUCCESS" || echo "BUILD FAILED - dist is empty"

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS final
ENV NODE_ENV=production

COPY package.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=build /usr/src/app/prisma ./prisma

USER node
EXPOSE 3000


CMD ["node", "dist/src/main"]
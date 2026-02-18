FROM node:20-alpine AS builder

WORKDIR /app

ARG PUBLIC_API_URL
ARG PUBLIC_IMAGE_URL
ARG PUBLIC_SITE_URL

ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_IMAGE_URL=$PUBLIC_IMAGE_URL
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

RUN addgroup -g 1001 -S nodejs && adduser -S astro -u 1001

WORKDIR /app

COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/package.json ./

USER astro

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
FROM node:20-alpine AS builder

RUN apk update && apk add --no-cache \
  build-base \
  gcc \
  autoconf \
  automake \
  zlib-dev \
  libpng-dev \
  nasm \
  bash \
  vips-dev \
  git \
  python3

WORKDIR /opt

COPY package*.json ./
RUN npm ci

WORKDIR /opt/app
COPY . .

RUN npm run build

FROM node:20-alpine AS runtime

RUN apk add --no-cache vips

RUN addgroup -g 1001 -S nodejs && adduser -S strapi -u 1001

WORKDIR /opt/app

COPY --from=builder --chown=strapi:nodejs /opt/node_modules ./node_modules
COPY --from=builder --chown=strapi:nodejs /opt/app/dist ./dist
COPY --from=builder --chown=strapi:nodejs /opt/app/public ./public
COPY --from=builder --chown=strapi:nodejs /opt/app/config ./config
COPY --from=builder --chown=strapi:nodejs /opt/app/src ./src
COPY --from=builder --chown=strapi:nodejs /opt/app/package.json ./
COPY --from=builder --chown=strapi:nodejs /opt/app/favicon.png ./

RUN mkdir -p /opt/app/public/uploads && chown -R strapi:nodejs /opt/app/public/uploads

USER strapi

ENV NODE_ENV=production
ENV PATH=/opt/app/node_modules/.bin:$PATH

EXPOSE 1337

CMD ["npm", "start"]
# Use a Node.js image with Alpine for a smaller footprint
FROM node:20.15.1-alpine

# Install required packages for building native dependencies
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
  python3 \
  py3-pip

# Set environment variables
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV PATH /opt/node_modules/.bin:$PATH

# Set working directory and copy package files
WORKDIR /opt/
COPY package.json package-lock.json ./

# Install global dependencies
RUN npm install -g node-gyp

# Install local dependencies
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install

# Set working directory for the application
WORKDIR /opt/app
COPY . .

# Fix file permissions and run build
RUN chown -R node:node /opt/app
USER node
RUN npm run build

# Expose the port and define the start command
EXPOSE 1337
CMD ["npm", "run", "develop"]

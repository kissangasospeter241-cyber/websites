# Use official Node.js LTS image
FROM node:18-alpine AS base
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source
COPY . .

# Build
RUN npm run build

# Production image
FROM node:18-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]

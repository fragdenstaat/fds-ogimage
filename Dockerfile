FROM zenika/alpine-chrome:89-with-node-14 AS deps
WORKDIR /app
COPY package.json yarn.lock ./
USER root
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM zenika/alpine-chrome:89-with-node-14 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
USER root
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

# Production image, copy all the files and run next
FROM zenika/alpine-chrome:89-with-node-14 AS runner
WORKDIR /app

ENV NODE_ENV production
USER root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node_modules/.bin/next", "start"]
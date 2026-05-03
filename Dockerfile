FROM node:20.11.1-alpine

# Set a working directory
WORKDIR /usr/src/app

# Install tzdata for proper timezone handling and clean up afterwards
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata

# Install jemalloc and preload it for better memory management
RUN apk --no-cache add jemalloc
ENV LD_PRELOAD=/usr/lib/libjemalloc.so.2

# Copy application source code
COPY . .

# Enable corepack and install dependencies using pnpm
RUN corepack enable pnpm
RUN pnpm install
RUN pnpm build

# Ensure the application files are owned by the non‑root user that will run the container
# The official Node image provides a "node" user (UID 1000) with a matching group.
RUN chown -R node:node /usr/src/app

# Expose the application port
ENV PORT 8000
EXPOSE 8000

# Switch to the non‑root user before defining the entrypoint
USER node

ENTRYPOINT ["pnpm"]
CMD ["start"]

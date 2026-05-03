FROM node:20.11.1-alpine

# ---------------------------------------------------------------------------
# Create a non‑root user and group (UID/GID 1001) for running the application.
# Using ARG allows overriding the IDs at build time if needed.
# ---------------------------------------------------------------------------
ARG USER_ID=1001
ARG GROUP_ID=1001
RUN addgroup -g ${GROUP_ID} appgroup && \
    adduser -D -u ${USER_ID} -G appgroup appuser

WORKDIR /usr/src/app

# ---------------------------------------------------------------------------
# Set timezone to Asia/Tokyo (adjust as required).
# ---------------------------------------------------------------------------
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata

# ---------------------------------------------------------------------------
# Install jemalloc for better memory handling and expose it via LD_PRELOAD.
# ---------------------------------------------------------------------------
RUN apk --no-cache add jemalloc
ENV LD_PRELOAD=/usr/lib/libjemalloc.so.2

# ---------------------------------------------------------------------------
# Copy source code and adjust ownership so the non‑root user can read/write.
# ---------------------------------------------------------------------------
COPY . .
RUN chown -R appuser:appgroup /usr/src/app

# ---------------------------------------------------------------------------
# Install dependencies and build the application.
# These steps run as root (the default during build) which is safe.
# ---------------------------------------------------------------------------
RUN corepack enable pnpm
RUN pnpm install
RUN pnpm build

ENV PORT=8000
EXPOSE 8000

# ---------------------------------------------------------------------------
# Switch to the non‑root user for the final container runtime.
# ---------------------------------------------------------------------------
USER appuser

ENTRYPOINT ["pnpm"]
CMD ["start"]

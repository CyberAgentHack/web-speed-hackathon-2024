FROM node:20.11.1-alpine

WORKDIR /usr/src/app

RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata

RUN apk --no-cache add jemalloc
ENV LD_PRELOAD=/usr/lib/libjemalloc.so.2

COPY . .
RUN corepack enable pnpm
RUN pnpm install
RUN pnpm build

ENV PORT 8000
EXPOSE 8000

ENTRYPOINT ["pnpm"]
CMD ["start"]

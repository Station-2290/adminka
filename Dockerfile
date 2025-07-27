# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Fetch all dependencies to the store (cached layer)
RUN pnpm fetch

# Copy OpenAPI schema for type generation (before install to ensure it's available)
COPY __schemas__ ./__schemas__

# Install all dependencies from store (including dev deps for build)
RUN pnpm install -r --offline --frozen-lockfile

# Copy source code
COPY . .

# Explicitly generate API types (ensures they're created with dev dependencies available)
RUN pnpm run gen:api

# Build Vite application
RUN pnpm run build

# Verify build was created
RUN ls -la dist/ || (echo "Build failed" && exit 1)

# Production stage
FROM nginx:alpine AS runner

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install wget for health checks
RUN apk add --no-cache wget

# Create nginx user directories
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to nginx user
USER nginx

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
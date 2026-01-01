# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package.json ./

RUN npm install --include=dev

# Copy application code
COPY --link . .

RUN npm run compile:tailwind

# === IPFS / Reown ===
ARG VITE_REOWN_PROJECT_ID
ARG VITE_JWT_IPFS
ARG VITE_API_KEY_IPFS
ARG VITE_API_SECRET_IPFS

ENV VITE_REOWN_PROJECT_ID=$VITE_REOWN_PROJECT_ID
ENV VITE_JWT_IPFS=$VITE_JWT_IPFS
ENV VITE_API_KEY_IPFS=$VITE_API_KEY_IPFS
ENV VITE_API_SECRET_IPFS=$VITE_API_SECRET_IPFS

# === Protocol / Chain ===
ARG VITE_PROTOCOL_REGISTRY_ADDRESS
ARG VITE_VAULT_FACTORY_ADDRESS
ARG VITE_RISK_ORACLE_ADDRESS
ARG VITE_USDC_ADDRESS
ARG VITE_RPC_URL
ARG VITE_MANTLE_RPC_URL

ENV VITE_PROTOCOL_REGISTRY_ADDRESS=$VITE_PROTOCOL_REGISTRY_ADDRESS
ENV VITE_VAULT_FACTORY_ADDRESS=$VITE_VAULT_FACTORY_ADDRESS
ENV VITE_RISK_ORACLE_ADDRESS=$VITE_RISK_ORACLE_ADDRESS
ENV VITE_USDC_ADDRESS=$VITE_USDC_ADDRESS
ENV VITE_RPC_URL=$VITE_RPC_URL
ENV VITE_MANTLE_RPC_URL=$VITE_MANTLE_RPC_URL

# === Supabase ===
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=$VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

# === Reclaim (INI YANG KELEWAT) ===
ARG VITE_RECLAIM_APP_ID
ARG VITE_RECLAIM_APP_SECRET
ARG VITE_RECLAIM_PROVIDER_ID

ENV VITE_RECLAIM_APP_ID=$VITE_RECLAIM_APP_ID
ENV VITE_RECLAIM_APP_SECRET=$VITE_RECLAIM_APP_SECRET
ENV VITE_RECLAIM_PROVIDER_ID=$VITE_RECLAIM_PROVIDER_ID

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM nginx

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]

FROM node:20-alpine
WORKDIR /app

# Install only production deps for the example service
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm ci

# Copy service launcher and domain code from the monorepo (adjust as needed)
COPY ../../src ./src
COPY index.js .
COPY .env.example .env.example

ENV NODE_ENV=production
EXPOSE 4001
CMD ["node", "index.js"]

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Use npm ci for reproducible installs now that package-lock.json is committed
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 8080
RUN chmod +x ./bin/start.sh || true
CMD ["sh","./bin/start.sh"]

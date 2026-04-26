FROM node:20-alpine

WORKDIR /app

# Copy only package files first (for caching)
COPY package.json package-lock.json ./

# Install dependencies inside the container
RUN npm ci

# Copy application files
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
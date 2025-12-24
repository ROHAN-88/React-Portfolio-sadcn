# Simple Nx + Next.js runtime image for the personal-portfolio app
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the repo
COPY . .

# Run the Next.js app via Nx in production mode on port 80
ENV NODE_ENV=production

EXPOSE 80

CMD ["npx", "nx", "serve", "personal-portfolio", "--configuration=production", "--port=80", "--hostname=0.0.0.0"]

FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

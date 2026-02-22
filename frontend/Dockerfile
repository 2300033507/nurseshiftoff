# Use Node image
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port 5173
EXPOSE 5173

# IMPORTANT: The --host flag allows external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
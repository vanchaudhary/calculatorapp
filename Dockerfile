# Use official Node.js image as base
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy rest of the app code
COPY . .

# Expose port 3000 for the app
EXPOSE 3000

# Command to run your app
CMD ["node", "app.js"]

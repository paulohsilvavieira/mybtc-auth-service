FROM node:18.16-alpine as build

# Create a working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18.16-alpine

# Create a working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the application from the build stage
COPY --from=build /app/dist .

# Expose the port on which the application will run
EXPOSE 3000

ENV REDIS NODE_ENV PG_HOST PG_DATABASE PG_PORT PG_USERNAME PG_PASSWORD SECRET_JWT
# Start the application
CMD ["node", "main"]
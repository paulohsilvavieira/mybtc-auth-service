FROM node:20.10-alpine as build

# Create a working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

COPY . .

# Install dependencies
RUN npm ci --legacy-peer-deps --ignore-scripts --silent\
    && npm run build

# Production stage
FROM node:20.10-alpine

# Create a working directory inside the container
WORKDIR /usr/src/app
# Copy the package.json and package-lock.json files to the working directory

# Copy the application from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

RUN npm ci --legacy-peer-deps --ignore-scripts --omit=dev --silent

RUN npm rebuild bcrypt 
# Expose the port on which the application will run
EXPOSE 3000

ENV AMQP_URI_CONNECTION EXCHANGE_NAME_MAILER_SERVICE ROUTING_KEY_MAILER_SERVICE NODE_ENV PG_HOST PG_DATABASE PG_PORT PG_USERNAME PG_PASSWORD SECRET_JWT
# Start the application
CMD ["npm", "run","start:prod"]
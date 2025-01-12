# Step 1: Build the React application
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire React app to the working directory
COPY . .

# Build the React app for production
# RUN npm run build

# Install the serve package globally
RUN npm install -g serve

# Set the working directory in the container
WORKDIR /app

# Copy the React build files from the \
# Expose the port to access the application
EXPOSE 3000

# Start the application using the serve package
ENTRYPOINT ["serve", "-s", ".", "-l", "3000"]

# Step 2: Serve the React app with Nginx
# FROM nginx:alpine

# Copy the React build files to Nginx's default web dir
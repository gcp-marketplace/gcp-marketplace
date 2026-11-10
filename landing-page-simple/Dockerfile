# Use the official, lightweight Node.js 20 image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and install production dependencies only
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of your application code
COPY . .

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the server
CMD [ "node", "index.js" ]

# Use the official Node.js 16 image as a parent image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install all dependencies (including TypeScript compiler)
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build TypeScript files to JavaScript (assumes tsconfig.json is configured correctly)
RUN npm run build

# Remove development dependencies if needed, to reduce image size
RUN npm prune --production

# Your app binds to port 3000, so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]
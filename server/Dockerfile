FROM node:alpine AS build
WORKDIR /builder
RUN npm install -g typescript
COPY package.json .
RUN npm install
COPY . .
RUN tsc

FROM node:alpine
WORKDIR /server

# (Install OS dependencies; just libraries.)

# Install the Javascript dependencies, only runtime libraries.
COPY package.json .
RUN npm install
# Copy the dist tree from the first stage.
COPY --from=build /builder/dist dist

# Run the built application when the container starts.
CMD ["node", "dist/js/server.js"]
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

# Environment Variables
ENV MONGO_SERVER=54.237.49.99
ENV PORT=4000
ENV DB=roomie-prod
ENV ACCESS_TOKEN_KEY=9e2eab5be139ef3627ddad3794e50cdc77a6fb6185e32412a0c4a5b79d344aw20695e57ee41b97ca37e7177da86b63f90fc2464fbf5d8bec39663c633b480976
ENV REFRESH_TOKEN_KEY=ba16d5edc9d5644e05edb1db9a02a125d5277e3659c877939946a9efa50c8ed694fc7ddccec30e4451d03e93ff639ec576ba5574f62d62b5657a2fa1f4af8a27

# Copy the dist tree from the first stage.
COPY --from=build /builder/dist dist



# Run the built application when the container starts.
CMD ["node", "dist/js/server.js"]
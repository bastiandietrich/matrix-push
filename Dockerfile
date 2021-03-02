FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --prod

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "node", "server.js" ]
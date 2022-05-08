FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN apt-get update && apt-get install -y vim
#for editing the image when container running

# Bundle app source
COPY . .

EXPOSE 9090
CMD [ "node", "app.js" ]
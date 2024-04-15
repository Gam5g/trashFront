FROM node:16.20.2-alpine

WORKDIR /src

COPY package.json .

RUN npm install -g npm@8.19.4 && npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

FROM node:16.20.0-alpine

WORKDIR /src

COPY package.json .

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
FROM node:16.20.2-slim

WORKDIR /src

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

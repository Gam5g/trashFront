FROM node:16.20.2

WORKDIR /src

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

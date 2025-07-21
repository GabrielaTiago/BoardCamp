FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x ./database-boardcamp/create-database

EXPOSE 4000

CMD ["npm", "run", "dev"]

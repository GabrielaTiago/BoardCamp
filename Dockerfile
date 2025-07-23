FROM node:18

ARG PORT=4000

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# RUN chmod +x ./database-boardcamp/create-database

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]

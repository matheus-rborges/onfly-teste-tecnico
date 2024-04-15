
FROM node:19.6

EXPOSE 8080:8080

RUN npm install -g npm@9.4.0

WORKDIR /

COPY . .

RUN npm install

RUN npx prisma generate

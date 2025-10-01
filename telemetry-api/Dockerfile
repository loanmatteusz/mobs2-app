FROM node:20-alpine

RUN apk add --no-cache bash postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

EXPOSE 3000

CMD sh -c "\
    until pg_isready -h \"$DB_HOST\" -p \"$DB_PORT\"; do \
    echo '⏳ Aguardando o banco de dados...'; \
    sleep 2; \
    done; \
    echo '✅ Banco de dados pronto!'; \
    npm run migration:run; \
    npm run start:prod"

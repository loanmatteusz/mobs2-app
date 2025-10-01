FROM node:20 AS build
WORKDIR /app

ARG VITE_GOOGLE_MAPS_KEY
ARG VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .

RUN VITE_GOOGLE_MAPS_KEY=$VITE_GOOGLE_MAPS_KEY \
    VITE_API_URL=$VITE_API_URL npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

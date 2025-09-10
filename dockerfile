# Stage 1: build de Angular
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Stage 2: servir con Nginx
FROM nginx:alpine

# Copiamos el build de Angular a Nginx
COPY --from=build /app/dist/tp-dsw-frontend /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


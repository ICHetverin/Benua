FROM node:20-alpine AS public-build
WORKDIR /pub
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS admin-build
WORKDIR /admin
COPY frontend-admin/package.json ./
RUN npm install
COPY frontend-admin/ ./
ARG VITE_API_URL
ARG VITE_YANDEX_MAPS_API_KEY
ENV VITE_API_URL=$VITE_API_URL VITE_YANDEX_MAPS_API_KEY=$VITE_YANDEX_MAPS_API_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=public-build /pub/build /usr/share/nginx/html
COPY --from=admin-build /admin/dist /usr/share/nginx/html/admin
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Build Stage
FROM node:24-alpine AS Builder
WORKDIR /app

COPY package.json package-lock.json ./
# Run npm ci if you have package-lock.json
RUN npm ci 

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
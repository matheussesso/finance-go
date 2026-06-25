# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Instala as dependências primeiro (aproveita o cache do Docker)
COPY package*.json ./
RUN npm install

# Copia o resto do código fonte e faz o build do Vite
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove a configuração padrão do NGINX
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa configuração para dar suporte ao React Router
COPY nginx.conf /etc/nginx/conf.d

# Copia os arquivos gerados pelo Vite (dist)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

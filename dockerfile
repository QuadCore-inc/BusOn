# Etapa 1: Build (baseada no Debian para evitar problemas)
FROM node:18-bullseye AS builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências da aplicação
RUN npm install --production

# Copiar o restante do código
COPY . .

# Corrigir problema com OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider

# Construir a aplicação Next.js
RUN npm run build

# Etapa 2: Runtime (baseada no Alpine para ser leve)
FROM node:18-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários do build
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js next.config.js

EXPOSE 3000

CMD ["npm", "run", "start"]
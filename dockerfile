# Etapa 1: Build (baseada no Debian para compatibilidade)
FROM node:18-bullseye AS builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar TODAS as dependências (incluindo devDependencies)
RUN npm install 

# Copiar o restante do código
COPY . .

# Corrigir problema com OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider

# Construir a aplicação Next.js
RUN npm run build

# Etapa 2: Runtime (baseada no Alpine para ser leve)
FROM node:18-alpine

WORKDIR /app

# Instalar apenas as dependências necessárias em produção
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/node_modules node_modules

# Copiar os arquivos do build do Next.js
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js next.config.js

# Expor a porta da aplicação
EXPOSE 3000
 
# Iniciar o servidor
CMD ["npm", "start"]

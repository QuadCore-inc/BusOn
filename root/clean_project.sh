#!/bin/bash

echo "🧹 Limpando arquivos de build e dependências..."

# Remover pastas de build e arquivos temporários
echo "🗑️ Removendo node_modules, package-lock.json, yarn.lock e arquivos de build..."

rm -rf node_modules package-lock.json yarn.lock
rm -rf android/.gradle android/app/build

# Limpar cache do npm
echo "🧹 Limpando cache do npm..."
npm cache clean --force

# Reinstalar dependências
echo "📦 Instalando dependências novamente..."
npm install

# Limpar build do Android
echo "🚀 Executando Gradle clean..."
cd android && ./gradlew clean

echo "✅ Limpeza concluída com sucesso!"

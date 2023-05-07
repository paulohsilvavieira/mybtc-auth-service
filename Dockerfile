# Define a imagem base que será usada
FROM node:18.16-alpine AS base

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos necessários para dentro do container
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install --only=production

# Copia os arquivos de produção para dentro do container
COPY --from=base /app/node_modules ./node_modules

# Copia todos os arquivos de produção do diretório atual para dentro do container
COPY --from=base /app/dist ./dist

# Define a porta em que a aplicação irá rodar
EXPOSE 3000

# Inicia a aplicação
CMD ["node", "dist/main"]
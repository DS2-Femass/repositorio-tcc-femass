# Baixa uma versão estável do node
FROM node:23-slim

# Seleciona o diretorio que esta o app
WORKDIR /app

# Copia dependencias para o container
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Roda o app
CMD ["npm", "start"]

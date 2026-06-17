FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

# Apenas desenvolvimento local — no Render use Static Site ou Dockerfile.prod
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

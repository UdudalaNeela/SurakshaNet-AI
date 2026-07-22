FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Since we're not running a build step for the hackathon (to keep it simple and avoid build errors on missing types), we'll run it in dev mode.
EXPOSE 3000

CMD ["npm", "run", "dev"]

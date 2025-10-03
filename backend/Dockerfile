FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4545
CMD ["node", "index.js"]


# docker build -t apartment-backend .
# docker run -d \
#   --name backend \
#   -p 5000:4545 \
#   -e DATABASE_HOST=db \
#   -e DATABASE_PORT=5432 \
#   -e DATABASE_NAME=apartment_management \
#   -e DATABASE_USER=postgres \
#   -e DATABASE_PASSWORD=nishant2308 \
#   --link db:db \
#   apartment-backend

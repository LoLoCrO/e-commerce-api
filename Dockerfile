FROM node:20
WORKDIR /app/backend
COPY package.json .
COPY yarn.lock .
COPY . .
RUN yarn
RUN yarn prisma generate
EXPOSE 3000
CMD ["yarn", "start:dev"]

FROM node:20
WORKDIR /app/backend
COPY start.sh /usr/src/app/start.sh
COPY package.json .
COPY yarn.lock .
COPY . .
RUN chmod +x /usr/src/app/start.sh
ENTRYPOINT ["/usr/src/app/start.sh"]
EXPOSE 3000

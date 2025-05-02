FROM node:20.19.0
WORKDIR /app
COPY . .
RUN npm i
# ENV NODE_OPTIONS="--max-old-space-size=3072"
EXPOSE 8080
ENTRYPOINT ["node", "index.js"]
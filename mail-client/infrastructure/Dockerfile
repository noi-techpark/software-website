FROM node:12.14.1-slim as base

FROM base as dev
RUN apt-get update && apt-get install -y jq
WORKDIR /

FROM base as build
COPY . .
RUN npm install
CMD ["npm", "start"]

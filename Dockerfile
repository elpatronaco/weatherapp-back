FROM node:15.8.0-alpine3.10

WORKDIR /usr/src/app

COPY package.json .

RUN apk update && \
    apk upgrade && \
    npm i --g npm && \
    npm i

ADD . /usr/src/app

RUN npm run build && \
    rm -r /usr/src/app/node_modules/ && \
    rm -r /usr/src/app/src/ && \
    npm i --only=production

EXPOSE 4000

CMD ["npm", "start"]
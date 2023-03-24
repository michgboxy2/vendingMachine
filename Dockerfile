FROM node:16.15.0

WORKDIR /usr/src/vending_machine

COPY ./ ./

RUN node -v

RUN rm -rf node_modules

RUN npm install

RUN npm uninstall bcrypt

RUN npm install bcrypt

RUN npm rebuild bcrypt --build-from-source

CMD ["/bin/bash"]
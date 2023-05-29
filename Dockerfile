FROM node:16.15.0

WORKDIR /usr/src/vending_machine

COPY ./ ./

RUN rm -rf node_modules

RUN npm install

CMD ["/bin/bash"]
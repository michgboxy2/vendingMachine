FROM node:16.15.0

WORKDIR /usr/src/vending_machine

COPY ./ ./

RUN npm install


CMD ["/bin/bash"]
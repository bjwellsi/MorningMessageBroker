From node

RUN mkdir /home/node/src

WORKDIR /home/node/src

COPY src/ .

USER node

#RUN npm install

EXPOSE 8080 

CMD [ "node", "MorningMessageBroker.js" ]


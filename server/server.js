const express = require('express');
const cors = require('cors');
const bps = require('body-parser');

const api = require('../api/api');
const { client} = require('../api/v1/utils/redis');

const { randomBytes } = require('crypto');
const { natsWrapper } = require('../api/v1/utils/natsWrapper');

const nats = require('node-nats-streaming');

const depositListener = require('../api/v1/utils/deposit-listener');
const purchaseListener = require('../api/v1/utils/purchase-listener');

const { CLUSTER_ID, natHost } = process.env;

require('../models/index');


const start = async () => {
    try {
        const stan = nats.connect(CLUSTER_ID, randomBytes(4).toString('hex'), { url: natHost});

        depositListener(stan);
        purchaseListener(stan);
        
        await natsWrapper.connect(CLUSTER_ID, 'abcd', natHost);

        natsWrapper.client.on('close', () => { console.log('NATS connection closed!'); process.exit(); });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());
        
    } catch (error) {
        console.log(error);
    }
}



const app = express();

app.use(cors());
app.use(bps.json());
app.use(bps.urlencoded({ extended: true}));

app.use("/api/v1", api);

client.connect();
start();

app.use((err, req, res) => {
    return res.status(500).send(err);
});


module.exports = app;
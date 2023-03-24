require('dotenv').config();
const app = require('./server/server');
const { randomBytes } = require('crypto');
const { natsWrapper } = require('./api/v1/utils/natsWrapper');

const nats = require('node-nats-streaming');

const depositListener = require('./api/v1/utils/deposit-listener');
const purchaseListener = require('./api/v1/utils/purchase-listener');

const { PORT, CLUSTER_ID, natHost } = process.env;

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

    app.listen(PORT, async () => {
        // await client.connect();
        console.log(`server started on port ${PORT}`);
    });
}


start();


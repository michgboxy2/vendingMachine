


const nats = require('node-nats-streaming');

class NatsWrapper {
     _client;

    get client() {
        if (!this._client) {
            throw new Error('cannot access NATS client before connecting');
        }

        return this._client;
    }


    connect(clusterId, clientId, url) {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise((resolve, reject) => {
            this._client.on('connect', () => {
                console.log('connected to NATS');
                resolve();
            });

            this._client?.on('error', (err) => {
                reject(err);
            })
        });
    }
}

const natsWrapper = new NatsWrapper();

module.exports = { natsWrapper };

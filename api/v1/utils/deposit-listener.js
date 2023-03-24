
const { subject, queueGroupName, DurableName } = require('./deposit-constants');
const db = require('../db');
const listen = (stan) => {
    stan.on('connect', () => {
        console.log('deposit listener connected to NATS');

    const subscriptionOptions = stan
              .subscriptionOptions()
              .setManualAckMode(true)
              .setDeliverAllAvailable()
              .setDurableName(DurableName)
              .setAckWait(5 * 1000);
          

          const subscription = stan.subscribe(subject, queueGroupName, subscriptionOptions);

          subscription.on('message', async (msg) => {
              try {
                const data = JSON.parse(msg.getData());
                await db.deposit.create(JSON.parse(data));
                msg.ack();
              
            
            } catch (error) {
                  console.log(error);
              }
          });
    
        stan.on('close', () => {
            console.log('Deposit NATS connection closed!');
            process.exit();
        });
    
    });
        

};


module.exports = listen;
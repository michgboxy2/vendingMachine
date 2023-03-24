class Publisher {
    client;
  
    constructor(client) {
      this.client = client;
    }
  
    publish(subject, data) {
      return new Promise((resolve, reject) => {
        this.client.publish(subject, JSON.stringify(data), (err) => {
          if (err) {
            return reject(err);
          }
          console.log("Event published to subject", subject);
          resolve();
        });
      });
    }
  }
  
  module.exports = { Publisher };
  
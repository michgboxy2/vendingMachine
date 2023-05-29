const redis =  require("redis");

const RedisHost = process.env.RedisHost;
const RedisPort = process.env.RedisPort;
console.log(process.env.REDIS_PORT, process.env.REDIS_HOST);
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

client.on("connect", function (error) {
  console.log("redis connected");
});

client.on("error", function (error) {
    client.disconnect();
    console.log(error);
});

client.on("end", function (error) {
    client.disconnect();
    console.log("redis disconnected");
});

module.exports = { client };
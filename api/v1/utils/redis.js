const redis =  require("redis");

const RedisHost = process.env.RedisHost || "127.0.0.1";
const RedisPort = Number(process.env.RedisPort) || 6379;

const client = redis.createClient(RedisPort, RedisHost);

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
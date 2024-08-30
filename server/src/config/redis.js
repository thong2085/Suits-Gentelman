// config/redis.js
const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

module.exports = client;

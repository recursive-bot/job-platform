require("dotenv").config();
const { createClient } =
require("redis");

const client = createClient({
    url: process.env.REDIS_URL
});
async function connectRedis() {

  await client.connect();

}

module.exports = {
  connectRedis,
  client
};
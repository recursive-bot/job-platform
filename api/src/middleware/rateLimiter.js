const {
  client
} =
require("../config/redis");

module.exports =
async (req, res, next) => {

  const key =
    `rate:${req.ip}`;

  const count =
    await client.incr(key);

  if (count === 1) {

    await client.expire(
      key,
      60
    );

  }

  if (count > 1000) {

    return res.status(429).json({
      message:
      "Too many requests"
    });

  }

  next();

};
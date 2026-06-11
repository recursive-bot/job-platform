const router = require("express").Router();

const auth = require("../middleware/auth");

const User = require("../models/User");

const {
  client
} = require("../config/redis");

router.get("/me", auth, async (req, res) => {

  const cacheKey =
    `user:${req.user.id}`;

  const cached =
    await client.get(cacheKey);

  if (cached) {

    return res.json({
      source: "redis",
      data: JSON.parse(cached)
    });

  }

  const user =
    await User.findByPk(req.user.id);

  await client.set(
    cacheKey,
    JSON.stringify(user),
    {
      EX: 3600
    }
  );

  return res.json({
    source: "postgres",
    data: user
  });

});

module.exports = router;
const router =
require("express").Router();

const auth =
require("../middleware/auth");

const {
  client
} =
require("../config/redis");

router.get(
  "/:id",
  auth,
  async (req, res) => {

    const progress =
      await client.get(
        `job:${req.params.id}:progress`
      );

    return res.json({
      progress:
      Number(progress) || 0
    });

  }
);

module.exports = router;
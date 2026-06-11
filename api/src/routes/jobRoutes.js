const router =
require("express").Router();

const auth =
require("../middleware/auth");

const jobController =
require(
  "../controllers/jobController"
);

router.post(
  "/",
  auth,
  jobController.createJob
);

router.get(
  "/:id",
  auth,
  jobController.getJob
);

module.exports = router;
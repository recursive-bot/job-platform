const router =
require("express").Router();

router.get("/", async (req, res) => {

    return res.json({
        status: "UP",
        service: "job-platform-api",
        timestamp: new Date()
    });

});

module.exports = router;
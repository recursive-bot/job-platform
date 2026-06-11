module.exports =
(err, req, res, next) => {

    req.log.error(err);

    return res.status(500).json({

        message:
            "Internal Server Error"

    });

};
const {
    httpRequestDuration
} = require(
    "../config/metrics"
);

module.exports = (
    req,
    res,
    next
) => {

    const end =
        httpRequestDuration.startTimer();

    res.on(
        "finish",
        () => {

            end({

                method:
                    req.method,

                route:
                    req.route?.path ||
                    req.path,

                status:
                    res.statusCode

            });

        }
    );

    next();
};
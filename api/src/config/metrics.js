const client = require("prom-client");

client.collectDefaultMetrics();

const httpRequestDuration =
    new client.Histogram({

        name: "http_request_duration_seconds",

        help: "Duration of HTTP requests",

        labelNames: [
            "method",
            "route",
            "status"
        ],

        buckets: [
            0.1,
            0.5,
            1,
            2,
            5
        ]
    });

module.exports = {
    client,
    httpRequestDuration
};
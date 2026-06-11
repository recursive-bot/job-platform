const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");

const errorHandler = require("./middleware/errorHandler");
const logger = require("./config/logger");
const rateLimiter = require("./middleware/rateLimiter");
const metricsMiddleware =
require(
    "./middleware/metrics"
);
const app = express();

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

// Logging middleware (should be first)
app.use(
    pinoHttp({
        logger
    })
);

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Rate Limiting
app.use(rateLimiter);

app.use(
    metricsMiddleware
);

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/users",
    require("./routes/userRoutes")
);

app.use(
    "/api/jobs",
    require("./routes/jobRoutes")
);

app.use(
    "/api/progress",
    require("./routes/progressRoutes")
);

app.use(
    "/health",
    require("./routes/healthRoutes")
);

app.use(
    "/metrics",
    require(
        "./routes/metricsRoutes"
    )
);
/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

module.exports = app;
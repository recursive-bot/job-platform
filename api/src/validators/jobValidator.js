const Joi = require("joi");

module.exports = Joi.object({

    type: Joi.string()
        .valid(
            "REPORT",
            "EMAIL",
            "EXPORT"
        )
        .required()

});
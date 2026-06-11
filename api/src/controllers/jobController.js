const Job =
require("../models/Job");
const {
  client
} =
require("../config/redis");
const schema =
require(
    "../validators/jobValidator"
);
const {
  getChannel
} =
require("../config/rabbitmq");

exports.createJob =
async (req, res) => {

  try {
    const { error } =
schema.validate(req.body);
    const { type } = req.body;
    if (error) {

    return res.status(400).json({
        message:
        error.details[0].message
    });

}
    const job =
      await Job.create({
        type
      });

    const channel =
      getChannel();

    channel.sendToQueue(
      "jobs",
      Buffer.from(
        JSON.stringify({
          jobId: job.id
        })
      )
    );

    return res.status(201).json({
      id: job.id,
      status: job.status
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      message: "Error"
    });

  }

};

exports.getJob =
async (req, res) => {

  const cacheKey =
`job:${req.params.id}`;

const cached =
await client.get(cacheKey);

if (cached) {

  return res.json({
    source: "redis",
    data: JSON.parse(cached)
  });

}

const job =
await Job.findByPk(req.params.id);

if (!job) {

  return res.status(404).json({
    message: "Not Found"
  });

}

await client.set(
  cacheKey,
  JSON.stringify(job),
  {
    EX: 300
  }
);
  if (!job) {

    return res.status(404).json({
      message: "Not Found"
    });

  }

return res.json({
  source: "postgres",
  data: job
});



};
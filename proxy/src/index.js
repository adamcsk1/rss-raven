module.exports = () => {
  const express = require("express");
  const bodyParser = require("body-parser");
  const dotenv = require("dotenv");
  const helmet = require("helmet");
  const cors = require("cors");

  dotenv.config({ path: process.argv[2] });

  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (process.env.ORIGINS.split(",").includes(origin))
          callback(null, true);
        else callback("Not allowed by CORS");
      },
    }),
  );
  app.use(bodyParser.json({ limit: "2mb" }));

  require("./middlewares/token.middleware")(app);
  require("./apis/status.api")(app);
  require("./apis/fetch-feed.api")(app);

  app.listen(process.env.SERVER_PORT, () => {
    console.log("Rss Raven backend started\n");
  });
};

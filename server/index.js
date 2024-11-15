const express = require("express");
const bodyParser = require("body-parser");
const router = require("./router/router");
require("dotenv").config();
const sequelize = require("./db");
const path = require("path");

const app = express();
const cors = require("cors");

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", router);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};
start();

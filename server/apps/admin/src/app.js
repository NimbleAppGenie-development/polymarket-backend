

const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const routes = require("./routes/routes");
const { errorHandler, notFound } = require("./middleware/basic.middleware");
// const logRequestBody = require("./reqBodylogger");

const app = express();

// middlewares && parsers
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// app.use(logRequestBody);

app.use("/public", express.static(path.join(__dirname, "public")));

routes(app);

app.use((req, res) => {
    res.status(404).json({ status: false, message: "Route not found" });
});

app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(errorHandler);
app.use(notFound);

module.exports = app;

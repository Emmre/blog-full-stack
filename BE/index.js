const cors = require("cors");
const express = require("express");
const routes = require("./src/routes");
const path = require("path");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization, userId",
};

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

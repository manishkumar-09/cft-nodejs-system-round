require("dotenv").config();
require("./config/db");
const express = require("express");
const router = require("./routes/userRoutes");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/api", router);
app.get("/", (req, res) => {
  res.send("Home Page ");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

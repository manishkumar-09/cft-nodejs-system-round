const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("mongoose is connected to db");
});

mongoose.connection.on("error", (err) => {
  console.error("mongoose error", err);
});

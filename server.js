const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

//Config

const dbUri = process.env.DATABASE_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
const port = process.env.PORT || 6000;

//Database Connection
mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
    //Server setup
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`Not connected ${err.message}`);
  });

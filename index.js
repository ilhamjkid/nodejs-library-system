const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const rootDir = require("./helpers/rootDir");

const server = express();
const PORT = process.env.PORT || 5000;
const { NODE_ENV, MONGO_URI } = process.env;

server.set("view engine", "ejs");
server.set("views", path.join(rootDir, "views"));
server.use(express.static(path.join(rootDir, "public")));
server.use(express.static(path.join(rootDir, "uploads")));
server.use(express.urlencoded({ extended: true }));
server.use(require("express-ejs-layouts"));
server.use(require("cookie-parser")());
server.use(require("connect-flash")());
server.use(require("./middleware/setupSession"));
server.use(require("./middleware/setupAdmin"));
server.use(require("./middleware/setupUser"));
server.use(require("./middleware/setupMethod"));
server.use(require("csurf")());
server.use(require("./middleware/resLocals"));

server.use("/", require("./routes/homeRouter"));
server.use("/admin", require("./routes/adminRouter"));
server.use("/auth", require("./routes/authRouter"));

server.use(require("./controllers/errorController").get404);
server.use(require("./controllers/errorController").get500);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database mongoDB connected");
    server.listen(PORT, () => {
      console.log("Server is running");
      if (NODE_ENV !== "production") {
        console.log(`Link: http://localhost:${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });

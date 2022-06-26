const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

module.exports = session({
  secret: "my secret",
  resave: false,
  saveUninitialized: false,
  store: new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  }),
});

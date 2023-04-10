const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/18-NoSQL-Social-Network-API', {
//useFindAndModify: false,
//useNewUrlParser: true,
//useUnifiedTopology: true
//});

//mongoose.set('debug', true);
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
  });
});

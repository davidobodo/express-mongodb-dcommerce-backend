const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());
app.use("/api/users", usersRoutes);

app.listen(5000, () => console.log("app running on localhost 5000"));

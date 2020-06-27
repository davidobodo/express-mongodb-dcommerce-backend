const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use("/api/users", usersRoutes);

//---------------------------------------------------------------
//handles unknown routes
//---------------------------------------------------------------
app.use((req, res, next) => {
    const error = new HttpError("Could not find this route", 404);
    throw error;
});

//---------------------------------------------------------------
//handles all errors thown in app
//---------------------------------------------------------------
app.use((error, req, res, next) => {
    res.status(error.code || 500).json({
        message: error.message || "An unknown error occurred",
    });
});

mongoose
    .set("useUnifiedTopology", true)
    .connect(
        `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0-lxnuh.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true }
    )
    .then(() => {
        app.listen(5000, () => console.log("app running on localhost 5000"));
    })
    .catch((err) => {
        console.log(err);
    });

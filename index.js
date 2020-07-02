const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const cors = require("cors");

const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const isDevEnv = process.env.NODE_ENV !== "production";

dotenv.config();
const { PORT = 5000 } = process.env;
const app = express();
// isDevEnv && app.use(cors({ origin: true }));

app.use(bodyParser.json());

//---------------------------------------------------------------
//Solve cors issue
//---------------------------------------------------------------
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

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
        app.listen(PORT, () => console.log("app running on localhost 5000"));
    })
    .catch((err) => {
        console.log(err);
    });

const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
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

app.listen(5000, () => console.log("app running on localhost 5000"));

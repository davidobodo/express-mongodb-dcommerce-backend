const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())

app.listen(5000, () => console.log("app running on localhost 5000"))

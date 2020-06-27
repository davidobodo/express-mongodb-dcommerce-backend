const express = require("express");
const { check } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.post(
    "/signup",
    [
        check("name").notEmpty().withMessage("name should not be empty"),
        check("email")
            .normalizeEmail()
            .isEmail()
            .withMessage("email is invalid"),
        check("password")
            .isLength({ min: 6 })
            .withMessage("must be at least 6 chars long"),
    ],
    usersControllers.signup
);
module.exports = router;

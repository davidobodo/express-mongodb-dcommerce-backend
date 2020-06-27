const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const signup = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new HttpError(result.errors[0].msg, 422));
    }
    const { name, email, password } = req.body;

    const createUser = {
        id: uuid(),
        name,
        email,
        password,
    };

    res.status(201).json({ user: createUser });
};

exports.signup = signup;

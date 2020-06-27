const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return next(new HttpError(result.errors[0].msg, 422));
    }

    const { firstName, lastName, email, password } = req.body;

    const createduser = new User({
        firstName,
        lastName,
        email,
        password,
    });

    //------------------------------------------------------------------------
    //check if a user with the same email exists before signing up
    //------------------------------------------------------------------------
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError("Signing up failed, please try again", 500));
    }

    if (existingUser) {
        console.log(existingUser);
        return next(
            new HttpError("User exists already, please login instead", 422)
        );
    }

    //------------------------------------------------------------------------
    //create user on database
    //------------------------------------------------------------------------
    try {
        const result = await createduser.save();
        console.log(result);
    } catch (err) {
        return next(new HttpError("Signing up failed, please try again", 500));
    }

    res.status(201).json({ user: createdUser });
};

exports.signup = signup;

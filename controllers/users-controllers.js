const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    //------------------------------------------------------------------------
    //Express validation checker
    //------------------------------------------------------------------------
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new HttpError(result.errors[0].msg, 422));
    }

    //------------------------------------------------------------------------
    //Check if a user with the same email exists before signing up
    //------------------------------------------------------------------------
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError("Signing up failed, please try again", 500));
    }
    if (existingUser) {
        console.log(existingUser, "existing user");
        return next(
            new HttpError("User exists already, please login instead", 422)
        );
    }

    //------------------------------------------------------------------------
    //Hash users password before storing in database
    //------------------------------------------------------------------------
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new HttpError("Signing up failed, please try again", 500));
    }

    const createdUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    //------------------------------------------------------------------------
    //Create user on database
    //------------------------------------------------------------------------
    try {
        const result = await createdUser.save();
        console.log(result, "result");
    } catch (err) {
        return next(new HttpError("Signing up failed, please try again", 500));
    }

    res.status(201).json({ user: createdUser });
};

exports.signup = signup;

const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        return next(
            new HttpError(
                "Signing up failed (user exists), please try again",
                500
            )
        );
    }
    if (existingUser) {
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
        return next(
            new HttpError("Signing up failed (password), please try again", 500)
        );
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
        await createdUser.save();
    } catch (err) {
        return next(
            new HttpError("Signing up failed (database), please try again", 500)
        );
    }

    //------------------------------------------------------------------------
    //Create token for signed up user
    //------------------------------------------------------------------------
    let token;
    try {
        token = jwt.sign(
            {
                userId: createdUser.id,
                email: createdUser.email,
                firstName: createdUser.firstName,
            },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "1h" }
        );
    } catch (err) {
        return next(
            new HttpError("Signing up failed (token), please try again", 500)
        );
    }

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        token: token,
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    //------------------------------------------------------------------------
    //Check if a user with this email exists before loging in
    //------------------------------------------------------------------------
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError("Signing up failed, please try again", 500));
    }
    if (!existingUser) {
        return next(
            new HttpError("Invalid credentials, could not log you in", 403)
        );
    }

    //------------------------------------------------------------------------
    //Check if a user with this password exists before loging in
    //------------------------------------------------------------------------
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        return next(
            new HttpError("Invalid credentials, could not log you in", 403)
        );
    }
    if (!isValidPassword) {
        return next(
            new HttpError("Invalid credentials, could not log you in", 403)
        );
    }

    //------------------------------------------------------------------------
    //Create token for logged in user
    //------------------------------------------------------------------------
    let token;
    try {
        token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email,
                firstName: existingUser.firstName,
            },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "1h" }
        );
    } catch (err) {
        return next(new HttpError("Signing up failed, please try again", 500));
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        token: token,
    });
};

exports.signup = signup;
exports.login = login;

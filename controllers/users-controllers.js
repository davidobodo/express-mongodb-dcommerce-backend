const { uuid } = require("uuidv4");

const signup = async (req, res, next) => {
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

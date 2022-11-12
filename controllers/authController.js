require('dotenv').config()
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const User  =  require('../models/user')
const { ACCESS_TOKEN_SECRET } = process.env

const register = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });


    const passwordCorrect = async (user) => {
        if (user) {
            return await bcrypt.compare(password, user.passwordHash)
        }
    }

    if (!(user && passwordCorrect)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: 'Credentials do not match',
        });
    }

    const userForToken = {
        id: user._id,
        username: user.username,
        email: user.email,
    };


    const token = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn:'7d'});

    return res
        .status(StatusCodes.OK)
        .send({
            token, email: user.email, username: user.username,
        });

}

module.exports = { register }
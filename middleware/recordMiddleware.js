const { StatusCodes } = require('http-status-codes')

const checkUsername = (req, res, next) => {
    const queryParam = req.query

    if (!queryParam.hasOwnProperty('user')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized no userame given" })
    }

    next()
}

module.exports = checkUsername
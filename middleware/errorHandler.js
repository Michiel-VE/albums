const { StatusCodes } = require('http-status-codes')
const { APIError } = require('../customErrors/custom')

const errorHandler = (error, req, res, next) => {
    if (error instanceof APIError) {
        return res.status(error.statusCode).json({ msg: error.message })
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'There was an internal server error, please try again later' })
}

module.exports = errorHandler
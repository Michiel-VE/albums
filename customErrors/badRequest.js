const { StatusCodes } = require('http-status-codes')
const { APIError } = require('./custom')

class BadRequest extends APIError {
    constructor() {
        super('The required values are missing', StatusCodes.BAD_REQUEST)
    }
}

const badRequestError = () => new BadRequest()

module.exports = { BadRequest, badRequestError }
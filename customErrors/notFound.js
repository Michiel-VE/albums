const { StatusCodes } = require('http-status-codes')
const { APIError } = require('./custom')

class NotFound extends APIError {
    constructor(id) {
        super(`Couldn't find album with id ${id}`, StatusCodes.NOT_FOUND)
    }
}

const notFoundError = (id) => new NotFound(id)

module.exports = { NotFound, notFoundError }
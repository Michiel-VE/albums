class APIError extends Error {
    constructor(msg, statusCode){
        super(msg)
        this.statusCode = statusCode
    }
}

const createAPIError = (msg, statusCode) => new APIError(msg, statusCode)

module.exports = {APIError, createAPIError}
const { StatusCodes } = require('http-status-codes');
const { APIError } = require('../customErrors/custom');
const asyncWrapper = require('./asyncErrors');


const authenticateUser = asyncWrapper(
  async (req, res, next) => {
    if (!req.user) {
      throw new APIError('Currently not logged in', StatusCodes.UNAUTHORIZED);
    }
    next();
  },
);

const authenticatePerms = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new APIError('Unauthorized to access this route', StatusCodes.FORBIDDEN);
  }
  next();
};

module.exports = { authenticateUser, authenticatePerms };

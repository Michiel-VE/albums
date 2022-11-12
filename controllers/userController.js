const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const { APIError } = require('../customErrors/custom');
const asyncWrapper = require('../middleware/asyncErrors');

const validEmailCheck = (email) => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  const getUser = asyncWrapper(
    async (req, res, next) => {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return new APIError('User not found', StatusCodes.NOT_FOUND);
      }
      return res.status(StatusCodes.OK).json({ user });
    },
  );
  

const registerUser = asyncWrapper(
  async (req, res) => {
    const {username, email, role, password, passwordConf} = req.body;
    const hash = 15;

    if (!(username && email && password && passwordConf)) {
      throw new APIError('Required fields missing', StatusCodes.BAD_REQUEST);
    }

    if(!validEmailCheck(email)){
       throw new APIError('This is not valid email address', StatusCodes.BAD_REQUEST)
    }

    if (password !== passwordConf) {
      throw new APIError('Your passwords do not match, check the spelling', StatusCodes.EXPECTATION_FAILED);
    }

    const userExists = await User.findOne({ email });
    
    if (userExists) {
      throw new APIError(`Email: ${email} is already used, please change this`, StatusCodes.CONFLICT);
    }

    
    const passwordHash = await bcrypt.hash(password, hash);

    const user = new User({
      username,
      email,
      role,
      passwordHash
    });

    await user.save();
    res.status(StatusCodes.CREATED).json({ user });
  },
);

module.exports = { getUser, registerUser };


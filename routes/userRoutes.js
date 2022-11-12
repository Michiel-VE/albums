const express = require('express');

const userRouter = express.Router();
const { authUser, authPerms } = require('../middleware/auth');
const {getUser } = require('../controllers/userController');

router.get('/:id', [authUser, authPerms('admin')], getUser);

module.exports = userRouter;

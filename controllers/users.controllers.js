const Users = require('../models/users.model');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await Users.findAll({
    where: {
      status: 'available',
    },
  });
  appSuccess(res, 200, 'Users obteined', { users });
});

exports.getUserById = catchAsync(async (req, res) => {
  const { user } = req;
  appSuccess(res, 200, 'User obtained', { user });
});

exports.createUser = catchAsync(async (req, res) => {
  const { name, email, password, role = 'client' } = req.body;

  const newUser = await Users.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role: role.toLowerCase(),
  });
  appSuccess(res, 201, 'User created', { newUser });
});

exports.updateUserById = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const { user } = req;
  const userUpdated = await user.update({
    name,
    email,
  });
  appSuccess(res, 200, 'User updated', { userUpdated });
});

exports.deleteUserById = catchAsync(async (req, res) => {
  const { user } = req;
  await user.update({
    status: 'unavailable',
  });
  appSuccess(res, 200, 'User has been deleted');
});

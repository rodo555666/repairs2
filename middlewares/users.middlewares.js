const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');

const getId = req => {
  let { id } = req.params;

  if (!id) {
    const { userId } = req.body;
    return userId;
  }
  return id;
};

exports.validUserExists = catchAsync(async (req, res, next) => {
  const id = getId(req);
  const user = await Users.findOne({
    where: {
      id,
      status: 'available',
    },
  });
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  req.user = user;
  next();
});

exports.validUserByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findOne({
    where: {
      email,
    },
  });
  if (user && user.status === 'unavailable') {
    await user.update({ status: 'available' });
    const message =
      'Existing user but disabled, their permissions have been re-enabled';
    return appSuccess(res, 200, message);
  }
  if (user) {
    return next(
      new AppError(
        `The user email already exists`,
        400
      )
    );
  }
  next();
});

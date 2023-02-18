const Repairs = require('../models/repairs.model');
const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');

exports.getMotoPendingList = catchAsync(async (req, res, next) => {
  const repairs = await Repairs.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
    where: {
      status: 'pending',
    },
    include: [
      {
        model: Users,
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
      },
    ],
  });
  appSuccess(res, 200, 'Accepted repairs', { repairs });
});

exports.getPendingById = catchAsync(async (req, res, next) => {
  const { repair } = req;
  appSuccess(res, 200, 'Repair obtained successfully', { repair });
});

exports.Appointment = catchAsync(async (req, res, next) => {
  const { date, userId, motorsNumber, description } = req.body;
  const { user } = req;
  const newRepair = await Repairs.create({
    date,
    userId,
    motorsNumber,
    description,
  });
  const message = `Your appointment has been successfully created by`;
  appSuccess(res, 201, message, { newRepair });
});

exports.StatusRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;
  const updatedRepair = await repair.update({ status: 'completed' });
  const message = 'The repair has been completed';
  appSuccess(res, 200, message, updatedRepair);
});

exports.cancelRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;
  await repair.update({ status: 'cancelled' });
  const message = 'The repair has been cancelled';
  appSuccess(res, 200, message);
});

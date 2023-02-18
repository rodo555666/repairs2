const AppError = require('../utils/appError');
const FalseErrors = (err, statusCode) => {
  return new AppError(err.message, statusCode);
};

const ErrorDev = (err, res) => {
  const { statusCode, status, message, stack } = err;
  res.status(statusCode).json({
    status,
    message,
    error: err,
    stack,
  });
};

const ErrorProdc = (err, res) => {
  const { isOperational, statusCode, status, message } = err;
  if (isOperational) {
    res.status(statusCode).json({
      status,
      message,
      ...err.extraInfo,
    });
  } else {
    res.status(statusCode).json({
      status,
      message: 'Server Error',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  if (process.env.NODE_ENV === 'development') {
    ErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    if (err.parent?.code === '22P02') err = FalseErrors(err, 400);
    if (err.parent?.code === '22007') err = FalseErrors(err, 400);

    ErrorProdc(err, res);
  }
};

module.exports = { globalErrorHandler };

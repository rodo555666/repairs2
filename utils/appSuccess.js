exports.appSuccess = (res, statusCode, message, extras = {}) => {
  const CDT1 = typeof message === 'string' || message === undefined;
  const CDT2= !Array.isArray(extras) && typeof extras === 'object';
  const CDT3 = typeof statusCode === 'number';
  if (CDT1 && CDT2 && CDT3) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      ...extras,
    });
  }
  throw new Error(
    `You have sent the arguments of the function`
  );
};

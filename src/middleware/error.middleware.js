const errorHandler = (err, req, res, next) => {
  if (!err.statusCode) {
    const key = Date.now() + '_' + Math.floor(Math.random() * 500);
    console.log(err, key);
    res.status(500).json({
      meta: {
        type: 'error',
      },
      data: {
        message: 'There as an error please contact support',
        code: key,
      },
    });
    return;
  }
  next(err, req, res);
};

module.exports = errorHandler;

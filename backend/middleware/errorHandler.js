const errorHandler = (err, req, res, next) => {
  const status = res.statusCode ? res.statusCode : 500; // server error

  res.status(status);

  res.json({ error: err.message, isError: true });
};

module.exports = errorHandler;

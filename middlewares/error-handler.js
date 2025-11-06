const errorHandler = (err, req, res, next) => {
  // Log the error to the console
  console.error(err);

  // Check if the error has a status code, otherwise default to 500
  const status = err.statusCode || 500;

  // Check if the error has a message, otherwise provide a default message
  const message = err.message || "An error occurred on the server";

  // Send the error response
  res.status(status).send({ message });
};

module.exports = errorHandler;

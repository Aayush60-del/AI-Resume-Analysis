const sendError = (res, error, fallbackStatus = 500) => {
  const status = Number(error.statusCode) || fallbackStatus;
  const message =
    status >= 500
      ? "Something went wrong. Please try again."
      : error.message || "Request failed";

  if (status >= 500) {
    console.error("[API Error]", error);
  }

  return res.status(status).json({ message });
};

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { sendError, createError };

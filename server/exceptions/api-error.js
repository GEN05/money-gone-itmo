module.exports = class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Unauthorized access, need to log in");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
};

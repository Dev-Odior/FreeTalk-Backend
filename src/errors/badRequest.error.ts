import SystemError from "./system.error";

export default class BadRequestError extends SystemError {
  // The message contract is to add custom message
  constructor(message?: string) {
    // All the argument i pass into the super is the parameter of the main class
    super(400, message || "Bad Request");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

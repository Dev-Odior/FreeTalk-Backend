import SystemError from "./system.error";

export default class NotFoundError extends SystemError {
  constructor(message?: string) {
    super(404, message || "Resources could not be found");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

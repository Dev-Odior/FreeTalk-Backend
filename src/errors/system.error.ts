class SystemError extends Error {
  // so we want to create instances of the systemError and then pass in the arguments we need
  constructor(
    private _code: number,
    public message: string,
    private _errors?: unknown[]
  ) {
    // This is to take the message from the error class
    super(message);

    // This is to set the values from the contractor
    this.message = message || "An error occurred";
    this._code = _code || 500;
    this._errors = _errors || [];

    // This is to ensure that all the instances of the systemError takes the prototype (properties and methods) of the system Error class
    Object.setPrototypeOf(this, SystemError.prototype);
  }

  // This is used to retrieve private values passed into the new instance from the contractors
  get code(): number {
    return this._code;
  }

  get errors(): unknown[] | undefined {
    return this._errors;
  }
}

export default SystemError;

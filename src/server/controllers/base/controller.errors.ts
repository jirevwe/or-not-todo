import HttpStatus, { NOT_FOUND } from 'http-status-codes';

export class ControllerError extends Error {
  code: number;
  error_code: number;
  constructor(message: string, code?: number, error_code?: number) {
    super(message);
    this.code = code || 400;
    error_code = error_code || 0;
  }
}

export class UserNotFoundError extends ControllerError {
  constructor(message: string) {
    const errorMessage = `Account: (${message}) not found`;
    super(errorMessage);

    this.code = HttpStatus.NOT_FOUND;
    this.error_code = 300;
  }
}

/**
 * Sets the HTTP status code to 404 `Not Found` when a queried item is not found.
 *
 */
export class NotFoundError extends ControllerError {
  constructor(message: string) {
    super(message, NOT_FOUND);
  }
}

export class UserExistsError extends ControllerError {
  constructor() {
    const errorMessage = 'User already exists';
    super(errorMessage);

    this.code = HttpStatus.BAD_REQUEST;
    this.error_code = 301;
  }
}

export class InvalidBVNError extends ControllerError {
  constructor() {
    const errorMessage =
      'We were not able to verify the BVN details with your profile, please contact support';
    super(errorMessage);

    this.code = HttpStatus.BAD_REQUEST;
    this.error_code = 302;
  }
}

export class BVNNotSetError extends ControllerError {
  constructor() {
    const errorMessage = 'Your BVN is not set. Please set your BVN first';
    super(errorMessage);

    this.code = HttpStatus.BAD_REQUEST;
    this.error_code = 303;
  }
}

export class ActionNotAllowedError extends ControllerError {
  constructor(message: string) {
    super(message);
    this.code = HttpStatus.BAD_REQUEST;
  }
}

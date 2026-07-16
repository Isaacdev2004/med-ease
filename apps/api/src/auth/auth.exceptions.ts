import { HttpException, HttpStatus } from '@nestjs/common';

import { AUTH_ERROR_CODES, type AuthErrorCode } from '@medease/auth';

export class AuthHttpException extends HttpException {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
    status: HttpStatus = HttpStatus.UNAUTHORIZED,
  ) {
    super({ code, message, statusCode: status }, status);
  }

  static invalidCredentials() {
    return new AuthHttpException(
      AUTH_ERROR_CODES.invalid_credentials,
      'The email or password you entered is incorrect.',
    );
  }

  static accountDisabled() {
    return new AuthHttpException(
      AUTH_ERROR_CODES.account_disabled,
      'Your account has been disabled. Contact your administrator.',
      HttpStatus.FORBIDDEN,
    );
  }

  static accountLocked() {
    return new AuthHttpException(
      AUTH_ERROR_CODES.account_locked,
      'Your account is temporarily locked due to too many failed login attempts.',
      HttpStatus.FORBIDDEN,
    );
  }

  static sessionExpired() {
    return new AuthHttpException(
      AUTH_ERROR_CODES.session_expired,
      'Your session has expired. Please sign in again.',
    );
  }
}

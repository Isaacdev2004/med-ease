import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthorizationHttpException extends HttpException {
  constructor(message = 'You do not have permission to perform this action.') {
    super(
      {
        code: 'forbidden',
        message,
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class AuthenticationRequiredException extends HttpException {
  constructor(message = 'Authentication is required.') {
    super(
      {
        code: 'unauthorized',
        message,
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

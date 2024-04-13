import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super('E-mail já está sendo usado', HttpStatus.BAD_REQUEST);
  }
}

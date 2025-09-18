import { SignInDto } from '@app/common';

export class SignInCommand {
  constructor(public readonly signInDto: SignInDto) {}
}

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export class AuthUserDto {
  readonly email: string;
  readonly password: string;
}

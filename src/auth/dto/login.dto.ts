import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'O campo email não pode estar vazio' })
  @IsEmail({}, { message: 'Por favor, entre com um e-mail válido' })
  readonly email: string;

  @IsNotEmpty({ message: 'O campo password não pode estar vazio' })
  @IsString()
  @Length(6, 100, { message: 'A senha deve ter entre 6 e 100 caracteres' })
  readonly password: string;
}

import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'O campo name não pode estar vazio' })
  @IsString()
  @Length(3, 100, { message: 'O nome deve ter entre 3 e 100 caracteres' })
  readonly name: string;

  @IsNotEmpty({ message: 'O campo email não pode estar vazio' })
  @IsEmail({}, { message: 'Por favor, entre com um e-mail válido' })
  readonly email: string;
}

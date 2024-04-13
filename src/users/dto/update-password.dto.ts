import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'O campo previousPassword não pode estar vazio' })
  @IsString()
  @Length(6, 100, {
    message: 'A antiga senha deve ter entre 6 e 100 caracteres',
  })
  readonly previousPassword: string;

  @IsNotEmpty({ message: 'O campo newPassword não pode estar vazio' })
  @IsString()
  @Length(6, 100, {
    message: 'A antiga senha deve ter entre 6 e 100 caracteres',
  })
  readonly newPassword: string;
}

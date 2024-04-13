import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { EmailAlreadyExistsException } from 'src/exceptions/email-already-exists.exception';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ token: string; user: UserDto }> {
    const { name, email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });
      const token = this.jwtService.sign({ id: user._id });
      const userDto: UserDto = {
        id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
      };
      return { token, user: userDto };
    } catch (err) {
      console.log(err.message);
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: UserDto }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.jwtService.sign({ id: user._id });
    const userDto: UserDto = {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    };

    return {
      token,
      user: userDto,
    };
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
      runValidators: true,
    });
  }
}

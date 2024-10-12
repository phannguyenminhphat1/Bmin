import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { users } from '@prisma/client';
import { USERS_MESSAGES } from 'src/constants/messages';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/constants/enum';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<users> {
    const [checkUsernameExist, checkExistEmail] = await Promise.all([
      this.prismaService.users.findUnique({
        where: { username: registerDto.username },
      }),
      this.prismaService.users.findUnique({
        where: { email: registerDto.email },
      }),
    ]);
    if (checkUsernameExist) {
      throw new UnprocessableEntityException({
        message: USERS_MESSAGES.VALIDATION_ERROR,
        data: {
          username: USERS_MESSAGES.USERNAME_EXISTED,
        },
      });
    }
    if (checkExistEmail)
      throw new UnprocessableEntityException({
        message: USERS_MESSAGES.VALIDATION_ERROR,
        data: {
          email: USERS_MESSAGES.EMAIL_ALREADY_EXISTS,
        },
      });
    if (registerDto.password !== registerDto.confirm_password)
      throw new UnprocessableEntityException(
        USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD,
      );
    const passwordHash = await this.hashPassword(registerDto.password);
    const newUser = await this.prismaService.users.create({
      data: {
        email: registerDto.email,
        password: passwordHash,
        username: registerDto.username,
        // address: registerDto.address,
        role: UserRole.USER,
        full_name: registerDto.full_name,
        phone_number: registerDto.phone_number,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    return newUser;
  }

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.users.findUnique({
      where: { username: loginDto.username },
    });
    if (!user) {
      throw new UnprocessableEntityException({
        message: USERS_MESSAGES.VALIDATION_ERROR,
        data: {
          username: USERS_MESSAGES.USERNAME_NOT_FOUND,
        },
      });
    }
    const checkPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!checkPassword) {
      throw new UnprocessableEntityException({
        message: USERS_MESSAGES.VALIDATION_ERROR,
        data: {
          password: USERS_MESSAGES.PASSWORD_IS_INCORRECT,
        },
      });
    }

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  signToken(user: Partial<users>) {
    const token = this.jwtService.sign({
      user_id: user.user_id,
      email: user.email,
      username: user.username,
    });
    return token;
  }
}

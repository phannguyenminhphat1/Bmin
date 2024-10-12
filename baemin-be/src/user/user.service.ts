import { Injectable, NotFoundException } from '@nestjs/common';
import { users } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { USERS_MESSAGES } from 'src/constants/messages';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findUserByEmail(email: string): Promise<users> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException(USERS_MESSAGES.USER_NOT_FOUND);
    return user;
  }
}

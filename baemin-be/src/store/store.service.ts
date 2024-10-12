import { Injectable, NotFoundException } from '@nestjs/common';
import { stores } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private prismaService: PrismaService) {}

  async getStoreById(store_id: number): Promise<stores> {
    const store = await this.prismaService.stores.findUnique({
      where: { store_id },
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }
}

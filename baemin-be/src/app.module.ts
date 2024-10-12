import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FoodModule } from './food/food.module';
import { CategoryModule } from './category/category.module';
import { PaymentModule } from './payment/payment.module';
import { JwtModule } from '@nestjs/jwt';
import { StoreModule } from './store/store.module';
import { CartModule } from './cart/cart.module';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    FoodModule,
    CategoryModule,
    PaymentModule,
    StoreModule,
    CartModule,
    PurchaseModule,
  ],
  providers: [AppService],
})
export class AppModule {}

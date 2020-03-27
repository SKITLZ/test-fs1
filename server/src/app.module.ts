import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { ShopsModule } from './shops/shop.module';

@Module({
  imports: [
    UsersModule,
    ShopsModule,
    MongooseModule.forRoot('mongodb+srv://Oleg:e6TJ3KuLP8WYUhYZ@cluster0-hq2cr.mongodb.net/test-playground?retryWrites=true&w=majority'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

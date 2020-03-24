import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRoot('mongodb+srv://Oleg:e6TJ3KuLP8WYUhYZ@cluster0-hq2cr.mongodb.net/test-playground?retryWrites=true&w=majority'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

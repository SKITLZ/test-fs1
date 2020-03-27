import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ShopsController } from './shop.controller';
import { ShopsService } from './shop.service';
import { ShopSchema } from './shop.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Shop', schema: ShopSchema}])],
  controllers: [ShopsController],
  providers: [ShopsService],
})
export class ShopsModule {}

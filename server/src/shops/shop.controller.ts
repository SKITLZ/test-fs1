import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';

import { ShopsService } from './shop.service';
import { Shop } from './shop.model'
import { AddShopDto } from './shop.dto';
import { AuthGuard } from 'src/shared/auth.guard';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @UseGuards(new AuthGuard())
  addShop(
    @Req() req: { user: { userId: string } },
    @Body() addShopDto: AddShopDto,
  ): Promise<Shop> {
    return this.shopsService.addShop(req.user.userId, addShopDto);
  }

  @Get()
  getAllShops(): Promise<Shop[]> {
    return this.shopsService.getAllShops();
  }

  @Get(':id')
  getShop(@Param('id') shopId: string): Promise<Shop> {
    return this.shopsService.getShop(shopId);
  }

  @Patch(':id')
  updateShop(
    @Param('id') shopId: string,
    @Body() updateShopDto: AddShopDto,
  ): Promise<Shop> {
    return this.shopsService.updateShop(shopId, updateShopDto);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  async removeShop(
    @Req() req: { user: { userId: string } },
    @Param('id') shopId: string,
  ): Promise<string> {
    await this.shopsService.deleteShop(req.user.userId, shopId);
    throw new HttpException('', HttpStatus.NO_CONTENT);
  }
}

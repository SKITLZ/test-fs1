import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';

import { ShopsService } from './shop.service';
import { Shop } from './shop.model'
import { AuthGuard } from 'src/shared/auth.guard';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @UseGuards(new AuthGuard())
  addShop(
    @Req() req: { user: { userId: string } },
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ): Promise<Shop> {
    return this.shopsService.addShop(req.user.userId, prodTitle, prodDesc, prodPrice);
  }

  @Get()
  @UseGuards(new AuthGuard())
  getAllShops(): Promise<Shop[]> {
    return this.shopsService.getAllShops();
  }

  @Get(':id')
  getShop(@Param('id') prodId: string): Promise<Shop> {
    return this.shopsService.getShop(prodId);
  }

  @Patch(':id')
  updateShop(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ): Promise<Shop> {
    return this.shopsService.updateShop(prodId, prodTitle, prodDesc, prodPrice);
  }

  @Delete(':id')
  async removeShop(@Param('id') prodId: string): Promise<string> {
    await this.shopsService.deleteShop(prodId);
    return `Shop with id: ${prodId} has been successfuly deleted`;
  }
}

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
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('address') address: string,
    @Body('isClosed') isClosed: boolean,
    @Body('schedule') schedule: [],
  ): Promise<Shop> {
    return this.shopsService.addShop(req.user.userId, name, description, address, isClosed, schedule);
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
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('address') address: string,
    @Body('isClosed') isClosed: boolean,
    @Body('schedule') schedule: [],
  ): Promise<Shop> {
    return this.shopsService.updateShop(shopId, name, description, address, isClosed, schedule);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  async removeShop(
    @Req() req: { user: { userId: string } },
    @Param('id') shopId: string,
  ): Promise<string> {
    await this.shopsService.deleteShop(req.user.userId, shopId);
    return `Shop with id: ${shopId} has been successfuly deleted`;
  }
}

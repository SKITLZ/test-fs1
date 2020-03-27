import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';

import { ProductsService } from './products.service';
import { Product } from './product.model'
import { AuthGuard } from 'src/shared/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(new AuthGuard())
  addProduct(
    @Req() req: { user: { userId: string } },
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ): Promise<Product> {
    return this.productsService.insertProduct(req.user.userId, prodTitle, prodDesc, prodPrice);
  }

  @Get()
  @UseGuards(new AuthGuard())
  getAllProducts(): Promise<Product[]> {
    return this.productsService.getProducts();
  }

  @Get(':id')
  getProduct(@Param('id') prodId: string): Promise<Product> {
    return this.productsService.getSingleProduct(prodId);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ): Promise<Product> {
    return this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
  }

  @Delete(':id')
  async removeProduct(@Param('id') prodId: string): Promise<string> {
    await this.productsService.deleteProduct(prodId);
    return `Product with id: ${prodId} has been successfuly deleted`;
  }
}

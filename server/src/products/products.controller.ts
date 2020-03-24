import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';

import { ProductsService } from './products.service';
import { Product } from './product.model'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ): Promise<Product> {
    return this.productsService.insertProduct(prodTitle, prodDesc, prodPrice);
  }

  @Get()
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

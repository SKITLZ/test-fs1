import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './product.model'

@Injectable()
export class ProductsService {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });
    return await newProduct.save(); // because mongoose created model :11 new this.productModel, it also has 'magic' methods like .save();
  }

  async getProducts(): Promise<Product[]> {
    return await this.productModel.find(); // find() only returns real promise if .exec() called after it
  }

  async getSingleProduct(productId: string) {
    return await this.findProduct(productId);
  }

  async deleteProduct(productId: string) {
    const result = await this.productModel.deleteOne({_id: productId}).exec();
    if (result.n === 0) throw new NotFoundException('Could not find product');
    // return await this.productModel.findByIdAndRemove(productId)
  }

  async updateProduct(productId: string, title: string, description: string, price: number) {
    const updateProduct = await this.findProduct(productId);
    if (title) updateProduct.title = title;
    if (description) updateProduct.description = description;
    if (price) updateProduct.price = price;
    return await updateProduct.save();
    // return await this.productModel.findByIdAndUpdate(
    //   productId,
    //   { title, description, price },
    //   { omitUndefined: true, new: true},
    // );
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id).exec(); // or .findOne({_id: productId})
    } catch (error) {
      throw new NotFoundException('Could not find product');
    }
    if (!product) {
      throw new NotFoundException('Could not find product');
    }
    return product;
  }
}

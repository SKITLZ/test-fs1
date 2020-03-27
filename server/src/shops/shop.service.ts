import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Shop } from './shop.model'

@Injectable()
export class ShopsService {
  constructor(@InjectModel('Shop') private readonly shopModel: Model<Shop>) {}

  async addShop(user: string, title: string, desc: string, price: number) {
    const newShop = new this.shopModel({
      title,
      description: desc,
      price,
      user,
    });
    return await newShop.save(); // because mongoose created model :11 new this.shopModel, it also has 'magic' methods like .save();
  }

  async getAllShops(): Promise<Shop[]> {
    return await this.shopModel.find(); // find() only returns real promise if .exec() called after it
  }

  async getShop(shopId: string) {
    return await this.findShop(shopId);
  }

  async deleteShop(shopId: string) {
    const result = await this.shopModel.deleteOne({_id: shopId}).exec();
    if (result.n === 0) throw new NotFoundException('Could not find shop');
    // return await this.shopModel.findByIdAndRemove(shopId)
  }

  async updateShop(shopId: string, title: string, description: string, price: number) {
    const updateShop = await this.findShop(shopId);
    if (title) updateShop.title = title;
    if (description) updateShop.description = description;
    if (price) updateShop.price = price;
    return await updateShop.save();
    // return await this.shopModel.findByIdAndUpdate(
    //   shopId,
    //   { title, description, price },
    //   { omitUndefined: true, new: true},
    // );
  }

  private async findShop(id: string): Promise<Shop> {
    let shop;
    try {
      shop = await this.shopModel.findById(id).exec(); // or .findOne({_id: shopId})
    } catch (error) {
      throw new NotFoundException('Could not find shop');
    }
    if (!shop) {
      throw new NotFoundException('Could not find shop');
    }
    return shop;
  }
}

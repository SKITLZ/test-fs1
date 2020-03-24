import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true }, // can also define just as title: String
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

// extends with the help of @types/mongoose package
// but Traversy Media doesn't create this class at all
// export class Product {
//   constructor(
//     public id: string,
//     public title: string,
//     public description: string,
//     public price: number,
//   ) {}

export interface Product extends mongoose.Document { // uses @types/mongoose for .Document extends
  id: string; // technically will be stored as _id
  title: string;
  description: string;
  price: number;
}

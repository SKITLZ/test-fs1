import * as mongoose from 'mongoose';

export const ShopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  address: { type: String, required: false },
  isClosed: { type: Boolean, required: false },
  schedule: { type: Array, required: true },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }
});

export interface Shop extends mongoose.Document { // uses @types/mongoose for .Document extends
  id: string;
  name: string;
  description: string;
  address: string;
  schedule: [];
  isClosed: boolean,
  user: string;
}

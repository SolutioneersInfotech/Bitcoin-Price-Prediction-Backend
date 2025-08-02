import mongoose, { Schema, Document } from "mongoose";

export interface IBitcoinPrice extends Document {
  date: Date;
  price: number;
}

const BitcoinPriceSchema: Schema = new Schema({
  date: { type: Date, required: true },
  price: { type: Number, required: true }
});

export default mongoose.model<IBitcoinPrice>("BitcoinPrice", BitcoinPriceSchema);

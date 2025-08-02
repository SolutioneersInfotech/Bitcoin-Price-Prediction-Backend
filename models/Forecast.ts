import mongoose, { Schema, Document } from "mongoose";

export interface IForecast extends Document {
    date: Date;
    predictedPrice: number;
}

const ForecastSchema: Schema = new Schema({
    date: { type: Date, required: true },
    predictedPrice: { type: Number, required: true }
});

export default mongoose.model<IForecast>("Forecast", ForecastSchema);

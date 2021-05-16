import { Document, model, Model, Schema } from "mongoose";

export interface Item {
    url: string;
    price: number;
}

export interface ItemDocument extends Item, Document {
    // declare any instance methods here
}

type ItemModel = Model<ItemDocument>;

const itemSchema = new Schema<ItemDocument, ItemModel>(
    {
        url: String,
        price: Number,
    },
    { timestamps: true }
);

export const Item = model<ItemDocument, ItemModel>("Item", itemSchema);

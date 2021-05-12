import { Document, model, Model } from "mongoose";

export interface User {
    username: string;
}

export interface UserDocument extends User, Document {
    // declare any instance methods here
}

type UserModel = Model<UserDocument>;

export const User = model<UserDocument, UserModel>("User");

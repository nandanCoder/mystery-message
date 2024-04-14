import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  // typescript type safty
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface Iuser extends Document {
  // typescript type safty
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  varifyCode: string;
  varifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<Iuser> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/gim, "email is not valid"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: [true, "isVerified is required"],
  },
  varifyCode: {
    type: String,
    required: [true, "varifyCode is required"],
  },
  varifyCodeExpiry: {
    type: Date,
    required: [true, "varifyCodeExpiry is required"],
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema], // custom data type
});

const UserModel = // type safty
  (mongoose.models.User as mongoose.Model<Iuser>) ||
  mongoose.model<Iuser>("User", UserSchema);

export default UserModel;

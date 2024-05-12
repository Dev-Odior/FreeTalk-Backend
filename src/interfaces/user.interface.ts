import { PostDoc } from "./post.interface";
import { Document, Model } from "mongoose";

export interface UserAttributeI extends Document {
  name: string;
  email: string;
  password: string;
  post?: Array<PostDoc>;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UserModel extends Model<UserAttributeI> {
  build(CreateUserDto: CreateUserDto): UserAttributeI;
}

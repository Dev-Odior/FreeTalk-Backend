import mongoose, { Schema, Model } from "mongoose";

import {
  UserAttributeI,
  CreateUserDto,
  UserModel,
} from "@src/interfaces/user.interface";

import { genSalt, hash } from "bcryptjs";
import { authConfig } from "@src/configs";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

UserSchema.pre("save", async function () {
  const salt = await genSalt(authConfig.BCRYPT_SALT_ROUND);
  const password = this.get("password");
  const hashedPassword = await hash(password, salt);
  this.password = hashedPassword;
});

UserSchema.statics.build = (user: CreateUserDto) => {
  return new User(user);
};

export const User = mongoose.model<UserAttributeI, UserModel>(
  "User",
  UserSchema
);

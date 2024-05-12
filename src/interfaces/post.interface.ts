import { CommentDoc } from "./comment.interface";
import { Document } from "mongoose";

export interface PostDoc extends Document {
  title: string;
  desc: string;
  images: Array<{ src: string }>;
  comment: Array<CommentDoc>;
}

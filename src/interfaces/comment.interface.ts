import { Document } from "mongoose";

export interface CommentDoc extends Document {
  userName: string;
  content: string;
}

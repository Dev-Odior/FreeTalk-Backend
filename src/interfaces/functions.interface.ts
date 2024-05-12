import { Request } from "express";
import { ValidationResult } from "joi";

//We want to attach this options to our request object
export interface QueryOptions {
  limit: number;
  offset: number;
  search: string | undefined;
}

export type RequestValidator = (req: Request) => ValidationResult;

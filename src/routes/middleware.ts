import { implement } from "@orpc/server";
import type { Request } from "express";
import { contract } from "../contract";

export interface User {
  id: string;
}

export interface BaseContext {
  headers: Request["headers"]
}

export interface AuthedContext extends BaseContext {
  user: User
}

export interface OptionalAuthContext extends BaseContext {
  user: User | null
}

function parseToken(authorization: string | string[] | undefined): User | null {
  if(!authorization) return null;
  const value = Array.isArray(authorization) ? authorization[0] : authorization;
  const token = value?.split(" ")[1];
  if(!token) return null;
  return { id: token }
}

const os = implement(contract);

export const authMiddleware = os
  .$context<BaseContext>()
  .middleware(async ({ context, next, errors }) => {
    const user = parseToken(context.headers.authorization);
    if(!user) {
      throw errors.UNAUTHORIZED();
    }
    return next({ context: { user }})
  })

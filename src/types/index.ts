import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export type ExtendedReq = Request & { userId?: string; email?: string };

export type ExtendedPayload =
	| (string & { userId: string; email: string })
	| (JwtPayload & { userId: string; email: string });

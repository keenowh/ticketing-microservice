import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// defines what to assign to the req currentUser object
interface UserPayload {
   id: string;
   email: string;
}

// Adds the currentUser property to be optional in the "req" object
declare global {
   namespace Express {
      interface Request {
         currentUser?: UserPayload;
      }
   }
}

export const currentUser = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   if (!req.session?.jwt) {
      return next();
   }

   try {
      const payload = jwt.verify(
         req.session.jwt,
         process.env.JWT_KEY!
      ) as UserPayload;
      req.currentUser = payload;
   } catch (err) {}
   next();
};

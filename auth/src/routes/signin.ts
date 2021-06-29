import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@sgtickets/common";
import { User } from "../models/user";
import { Password } from "../services/password";
const router = express.Router();

router.post(
   "/api/users/signin",
   [
      body("email").isEmail().withMessage("Email must be valid"),
      body("password")
         .trim()
         .notEmpty()
         .withMessage("You must apply a password"),
   ],
   validateRequest,
   async (req: Request, res: Response) => {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
         throw new BadRequestError("Invalid Credentials");
      }

      const passwordsMatch = await Password.compare(
         existingUser.password,
         password
      );

      if (!passwordsMatch) {
         throw new BadRequestError("Invalid credentials");
      }

      const userJwt = jwt.sign(
         { id: existingUser.id, email: existingUser.email },
         process.env.JWT_KEY!
      );

      // store it in session

      req.session = { jwt: userJwt };

      res.status(200).send(existingUser);
   }
);

export { router as signInRouter };

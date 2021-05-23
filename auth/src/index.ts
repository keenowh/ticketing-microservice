import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import { currentUserRouter } from "./routes/currentuser";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
   cookieSession({
      signed: false,
      secure: true,
   })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.all("*", async (req, res) => {
   throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
   try {
      if (!process.env.JWT_KEY) {
         throw new Error("JWT Key must be defined");
      }
      await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true,
      });
      console.log("Connected to MongoDB");
   } catch (err) {
      console.log(err);
   }

   app.listen(3000, () => {
      console.log("Listening on port 3000!!!!!!!!");
   });
};

start();

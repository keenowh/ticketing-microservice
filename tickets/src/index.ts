import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
   try {
      await natsWrapper.connect('ticketing','asdasdad', 'http://nats-srv:4222')
      natsWrapper.client.on('close', () => {
console.log('NATS Connection Closed!')
         process.exit()
     })

     process.on('SIGINT', ()  => natsWrapper.client.close())
     process.on('SIGTERM', () => natsWrapper.client.close())
      
      if (!process.env.JWT_KEY) {
         throw new Error("JWT Key must be defined");
      }
      if (!process.env.MONGO_URI) {
         throw new Error("MONGOURI must be defined");
      }

      await mongoose.connect(process.env.MONGO_URI, {
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

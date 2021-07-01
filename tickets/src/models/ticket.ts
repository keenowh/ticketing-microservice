import mongoose from "mongoose";

//An interface that describes properties that are required to create a new user
interface TicketAttrs {
   title: string;
   price: number;
   userId: string;
}

// interface that decscibes the properties
// that User model has
interface TicketModel extends mongoose.Model<TicketDoc> {
   build(attrs: TicketAttrs): TicketDoc;
}

// Interface properties that a User Document has
interface TicketDoc extends mongoose.Document {
   title: string;
   price: number;
   userId: string;
}

const ticketSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      price: {
         type: Number,
         required: true,
      },
      userId: {
         type: String,
         required: true,
      },
   },
   {
      toJSON: {
         transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
         },
      },
   }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
   return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

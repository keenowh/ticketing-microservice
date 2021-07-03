import { NotFoundError } from "@sgtickets/common";
import express, { Request, Response } from "express";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/ticket/:id", async (req: Request, res: Response) => {
   const ticket = Ticket.findById(req.params.id);

   if (!ticket) {
      return new NotFoundError();
   }

   res.send(ticket);
});

export { router as showTicketRouter };

import {
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
} from "@sgtickets/common";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/order-cancelled-publisher";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
    "/api/orders/:orderId",
    requireAuth,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId).populate(
            "ticket"
        );

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        // publish an event
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id,
            },
        });

        res.status(204).send(order);
    }
);

export { router as deleteOrderRouter };

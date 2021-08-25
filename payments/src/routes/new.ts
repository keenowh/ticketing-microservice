import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
} from "@sgtickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../model/order";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
    "/api/payments",
    requireAuth,
    [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Cannot pay for an cancelled order");
        }

        await stripe.charges.create({
            currency: "usd",
            amount: order.price * 100,
            source: token,
        });
    }
);

export { router as createChargeRouter };

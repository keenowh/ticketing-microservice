import {
    OrderCancelledEvent,
    OrderCreatedEvent,
    OrderStatus,
} from "@sgtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    // create an instanc eof the listener

    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = await Ticket.build({
        title: "concert",
        price: 99,
        userId: "aslkdjalsdkj",
    });
    ticket.set({ orderId });

    await ticket.save();

    // create a fake data event
    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, ticket, data, orderId, msg };
};

it("updates the ticket, publishes an event and acks it", async () => {
    const { listener, data, ticket, orderId, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();

    // -----------------------
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

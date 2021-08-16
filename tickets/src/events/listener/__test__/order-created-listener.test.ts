import { OrderCreatedEvent, OrderStatus } from "@sgtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
    // create an instanc eof the listener

    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = await Ticket.build({
        title: "concert",
        price: 99,
        userId: "aslkdjalsdkj",
    });

    await ticket.save();

    // create a fake data event
    const data: OrderCreatedEvent["data"] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: "asdasda",
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    };
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
    // call the onMessage function with the data object + message objects
    const { listener, data, ticket, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
});
it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function with the data object + messafe objects
    await listener.onMessage(data, msg);

    // write assertions to make sure a message ack is called
    expect(msg.ack).toHaveBeenCalled();
});

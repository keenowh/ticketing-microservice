import { TicketCreatedEvent, TicketUpdatedEvent } from "@sgtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
const setup = async () => {
    // create an instanc eof the listener

    const listener = new TicketCreatedListener(natsWrapper.client);
    // create and save a ticket
    const ticket = await Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 10,
        title: "concert",
    });

    await ticket.save();
    // create a fake data object

    const data: TicketUpdatedEvent["data"] = {
        id: ticket.id,
        version: ticket.version + 1,
        price: 999,
        title: "new concert",
        userId: "asasdasd",
    };
    // Create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    //return all
    return { listener, data, ticket, msg };
};

it("finds, updates, and saves a ticket"),
    async () => {
        const { listener, data, msg, ticket } = await setup();
        // call the onMessage function with the data object + message objects

        await listener.onMessage(data, msg);
        const updatedTicket = await Ticket.findById(ticket.id);

        expect(updatedTicket!.title).toEqual(data.title);
        expect(updatedTicket!.price).toEqual(data.price);
        expect(updatedTicket!.version).toEqual(data.version);
    };

it("it acks the message", async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage function with the data object + messafe objects
    await listener.onMessage(data, msg);

    // write assertions to make sure a message ack is called
    expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack of the event has a skipped version number", async () => {
    const { msg, data, listener, ticket } = await setup();

    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
});

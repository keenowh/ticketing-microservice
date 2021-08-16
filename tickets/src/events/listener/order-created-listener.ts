import { Listener, OrderCreatedEvent, Subjects } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // Find the ticket thtat the order is reserving

        const ticket = await Ticket.findById(data.ticket.id);

        // If no ticket, throw error
        if (!ticket) {
            throw new Error("Ticket Not Found");
        }
        // Mark the ticket as reserved by setting the orderId property
        ticket.set({ orderId: data.id });

        await ticket.save();
        // ack the message
        msg.ack();
    }
}

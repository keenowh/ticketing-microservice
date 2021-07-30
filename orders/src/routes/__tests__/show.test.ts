import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
    // Create a ticket

    const ticket = Ticket.build({
        title: "concert",
        price: 20,
    });

    await ticket.save();
    const user = global.signin();
    // Make a request to build an order with this ticket

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to fecth an order
    const { body: fetchOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200);

    expect(fetchOrder.id).toEqual(order.id);
});

it("return an error if it fetches the order of another user", async () => {
    // Create a ticket

    const ticket = Ticket.build({
        title: "concert",
        price: 20,
    });

    await ticket.save();
    const user = global.signin();
    // Make a request to build an order with this ticket

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to fecth an order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", global.signin())
        .send()
        .expect(401);
});

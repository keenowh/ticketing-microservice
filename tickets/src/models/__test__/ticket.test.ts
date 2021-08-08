import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async (done) => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 5,
        userId: "123",
    });

    // Save the ticket to the database
    await ticket.save();
    // Fetch the ticket twice
    const firstTicket = await Ticket.findById(ticket.id);
    const secondTicket = await Ticket.findById(ticket.id);

    // Make two separate changes to the tickets fetched
    firstTicket!.set({ price: 10 });
    secondTicket!.set({ price: 15 });

    // Save the first fetched ticket
    await firstTicket!.save();
    // Save the second fethced ticket
    try {
        await secondTicket!.save();
    } catch (err) {
        return done();
    }

    throw new Error("Should not reach this point");
});

it("implements optimistic concurrency control", async () => {
    const ticket = Ticket.build({
        title: "concert",
        price: 5,
        userId: "123",
    });

    await ticket.save();

    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
});

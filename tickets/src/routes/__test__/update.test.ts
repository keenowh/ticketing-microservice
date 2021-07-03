import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns a 404 if id is not existing", async () => {
   const id = new mongoose.Types.ObjectId().toHexString;
   await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", global.signin())
      .send({ title: "asdasdasd", price: 20 })
      .expect(404);
});
it("returns a 401 if the user is not authenticated", async () => {
   const id = new mongoose.Types.ObjectId().toHexString;
   await request(app)
      .put(`/api/tickets/${id}`)
      .send({ title: "asdasdasd", price: 20 })
      .expect(404);
});
it("returns a 404 if the user does not own the ticket", async () => {
   const response = await request(app)
      .post(`/api/tickets`)
      .set("Cookie", global.signin())
      .send({ title: "asdasdasd", price: 20 });

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", global.signin())
      .send({ title: "asa", price: 10000 })
      .expect(401);
});

it("returns a 404 if the user provides an invalid title or price", async () => {
   const cookie = global.signin();

   const response = await request(app)
      .post(`/api/tickets`)
      .set("Cookie", cookie)
      .send({ title: "asdasdasd", price: 20 });

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "", price: 20 })
      .expect(400);

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "asasdad", price: -20 })
      .expect(400);
});
it("updates ticket if valid inputs", async () => {
   const cookie = global.signin();

   const response = await request(app)
      .post(`/api/tickets`)
      .set("Cookie", cookie)
      .send({ title: "asdasdasd", price: 20 });

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "Naneun", price: 30 })
      .expect(200);

   const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send({});

   expect(ticketResponse.body.title).toEqual("Naneun");
   expect(ticketResponse.body.price).toEqual(30);
});

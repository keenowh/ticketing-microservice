import request from "supertest";
import { app } from "../../app";

it("has a route handler listening to /api/tickets for post requests", async () => {
   const response = await request(app).post("/api/tickets").send({});

   expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
   const response = await request(app)
      .post("/api/tickets")
      .send({})
      .expect(401);
});

it("returns status other than 401 if the user is signed in", async () => {
   const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({});

   expect(response.status).not.toEqual(404);
});

it("returns an error if an invalid title is provided", async () => {
   await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
         title: "",
         price: 10,
      })
      .expect(400);

   await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
         price: 10,
      })
      .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
   await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
         title: "asdjalskdj",
         price: -10,
      })
      .expect(400);
   await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
         title: "asdjalskdj",
      })
      .expect(400);
});

it("creates a ticket with valid inputs", async () => {
   // Add a checker if a ticket was actually saved

   await request(app)
      .post("/api/tickets")
      .send({
         title: "askajsdh",
         price: 20,
      })
      .expect(201);
});

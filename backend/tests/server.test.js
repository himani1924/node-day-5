import { app, server } from "../index.js"; 
import request from "supertest";


describe(" To-Do test", () => {
    it("/todos should return an array", async () => {
        const res = await request(app).get("/todos");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("/todos should add a new todo", async () => {
        const res = await request(app).post("/todos").send({ task: "dummy" }).set("Content-Type", "application/json");
        expect(res.statusCode).toBe(200);
        expect(res.body.task).toBe("dummy");
    });

});
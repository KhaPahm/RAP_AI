import { query } from "../models/index.models.js";

export async function test(req, res, next) {
    await query("Select * from Menu");
    res.json("Wath log message")
}
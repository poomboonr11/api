import { test } from "node:test";
import clientPromise from "../../lib/mongodb"
import bcrypt from "bcryptjs";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("account");
        const { Email, password: pass } = req.body;
        const userRole ='Unknown';

        const checkUsername = await db.collection("posts").findOne({Email:Email});
        if (!checkUsername) {
            const message = "User not found";
            res.json({ error: message });
            return; // Exit the function
        }

        const match = await bcrypt.compare(pass, checkUsername.password);
        if (match) {
            const message = { "status": "ok", "user": checkUsername }
            res.json(message)
        }
        else {
            const message = { "status": "error" }
            res.json(message)
        }

    } catch (e) {
        console.error(e);
        throw new Error(e).message;
    }
}

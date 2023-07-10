import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("account");
        const { Fname, Lname, Email, password: pass  } = req.body;
        const userRole = "unknown";

        const isExisting = await db.collection("posts").findOne({ Email })

        if (isExisting) {
            const message = "User already exists";
            res.json({ error: message });
            return; // Exit the function
        }

        const hashedPassword = await bcrypt.hash(pass, 10)

        const post = await db.collection("posts").insertOne({
            Fname,
            Lname,
            Email,
            password: hashedPassword,
            userRole
        });
        const message = " ลงทะเบียนสำเร็จ "
        res.json(message);
    } catch (e) {
        console.error(e);
        throw new Error(e).message;
    }
}
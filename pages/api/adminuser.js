import { test } from "node:test";
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("account");
    const { Email, password: pass } = req.body;

    const checkUsername = await db.collection("posts").findOne({ Email: Email });
    if (!checkUsername) {
      const message = "User not found";
      res.json({ error: message });
      return; // Exit the function
    }

    const match = await bcrypt.compare(pass, checkUsername.password);
    if (match) {
      const userRole = checkUsername.role; // ตัวอย่างเท่านั้น ต้องใช้ข้อมูลจากฐานข้อมูล
      if (userRole === "user") {
        // การจัดการ API สำหรับผู้ใช้งาน
        // ...
        const message = { "status": "ok", "user": checkUsername };
        res.json(message);
      } else if (userRole === "admin") {
        // การจัดการ API สำหรับผู้ดูแลระบบ
        // ...
        const message = { "status": "ok", "admin": checkUsername };
        res.json(message);
      }
    } else {
      const message = { "status": "error" };
      res.json(message);
    }
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};

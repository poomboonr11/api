import { clientPromise } from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { CA, HB_rate } = req.body;

  if (req.method === 'PUT') {
    try {
      const client = await clientPromise;
      const db = client.db("EVCharger");

      // อัปเดตค่า HB_rate ในฐานข้อมูล
      await db.collection("posts").updateOne(
        { CA },
        { $set: { HB_rate } }
      );

      res.status(200).json({ message: "HB_rate updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while updating HB_rate" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

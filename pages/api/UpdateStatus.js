import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("EVCharger");
    const { CA, status } = req.body;

    const result = await db.collection("posts").updateOne({ CA }, { $set: { status } });

    if (result.modifiedCount === 0) {
      res.status(404).json({ error: "Not Found" });
    } else {
      res.json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
};

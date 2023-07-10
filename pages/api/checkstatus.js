import { createStandaloneToast } from "@chakra-ui/react";
import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("EVCharger");
    const { CA } = req.query;

    const post = await db.collection("posts").findOne({ CA });

    if (!post) {
      res.status(404).json({ error: "Not Found" });
    } else {
      const { status } = post;
      res.json({ CA, status });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
};

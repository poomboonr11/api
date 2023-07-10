import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('EVCharger');
    const { id } = req.query;

    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'No charger found with the provided ID.' });
    } else {
      res.json({ message: 'Charger deleted successfully.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

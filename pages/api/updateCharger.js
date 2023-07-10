import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('EVCharger');
    const { CA, Fname, Lname, Location_detail_long, Location_detail_lat, Location_province, Location_amphure, Location_tambon,HB_rate } = req.body;

    const result = await db.collection('posts').updateOne(
      { CA: CA },
      {
        $set: {
          Fname: Fname,
          Lname: Lname,
          Location_detail_long: Location_detail_long,
          Location_detail_lat: Location_detail_lat,
          Location_province: Location_province,
          Location_amphure: Location_amphure,
          Location_tambon: Location_tambon,
          HB_rate: HB_rate,
        },
      }
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({ error: 'No charger found with the provided ID.' });
    } else {
      res.json({ message: 'Charger updated successfully.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

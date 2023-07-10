import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('EVCharger');

    const chargers = await db
      .collection('posts')
      .find({}, { CA: 1, Fname: 1, Lname: 1, Location_detail_long: 1, Location_detail_lat: 1, Location_province: 1, Location_amphure: 1, Location_tambon: 1 })
      .toArray();

    res.status(200).json(chargers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

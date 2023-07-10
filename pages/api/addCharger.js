import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('EVCharger');
    const {
      Fname,
      Lname,
      Email,
      Location_detail_long,
      Location_detail_lat,
      Location_province,
      Location_amphure,
      Location_tambon,
      CA,
    } = req.body;

    const HB_rate = 300;
    const status = 'Unknown';
    const userRole ='Unknown';
    const post = {
      Fname,
      Lname,
      Location_detail_lat,
      Location_detail_long,
      Location_province,
      Location_amphure,
      Location_tambon,
      CA,
      HB_rate,
      status,
    };

    const result = await db.collection('posts').insertOne(post);

    if (result.insertedCount === 1) {
      res.status(201).json({ message: 'Charger added successfully.' });
    } else {
      res.status(500).json({ error: 'Failed to add charger.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

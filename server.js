const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT,() => console.log(`Server running in mode on port ${PORT}`))

app.get('/api/login', async (req, res) => {
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
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

app.get('/api/auth/register', async (req,res) => {
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
});

app.get('/api/Search/[CA]', async(req,res) => {
    try {
        const client = await clientPromise;
        const db = client.db("EVCharger");
        const { CA } = req.body;
    
        const post = await db.collection("posts").findOne({ CA });
    
        if (!post) {
          res.status(404).json({ error: "Not Found" });
        } else {
          res.json(post);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing the request." });
      }
})

app.get('/api/Search/map', async(req,res) => {
    try {
        const client = await clientPromise;
        const db = client.db("EVCharger");
    
        const posts = await db.collection("posts").find().toArray();
    
        res.json(posts);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing the request." });
      }
})

app.get('/api/Search/STATUS', async(req,res) => {
    try {
        const client = await clientPromise;
        const db = client.db("EVCharger");
        const { CA } = req.body;
    
        const post = await db.collection("posts").findOne({ CA });
    
        if (!post) {
          res.status(404).json({ error: "Not Found" });
        } else {
          res.json(post);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing the request." });
      }
})
app.get('/api/addcharger', async(req,res) => {
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
})
app.get('/api/checkstatus', async(req,res) => {
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
})
app.get('/api/deleteCharger', async(req,res) => {
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
})
app.get('/api/getCharger', async(req,res) => {
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
})
app.get('/api/updateCharger', async(req,res) => {
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
})

app.get('/api/updateHB', async(req,res) => {
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
})

app.get('/api/UpdateStatus', async(req,res) => {
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
})
module.exports =app;
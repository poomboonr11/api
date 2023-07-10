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


module.exports =app;
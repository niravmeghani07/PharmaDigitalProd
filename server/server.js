const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const { Try } = require('@mui/icons-material');

app.use(cors());
app.use(express.json());

// MongoDB Atlas connection URI
const uri = 'mongodb+srv://niravMeghani:FdhopgXdro7aRfIG@cluster0.7cmxwc4.mongodb.net/?retryWrites=true&w=majority'; 

// Connect to MongoDB Atlas
MongoClient.connect(uri)
  .then((client) => {
    console.log('Connected to MongoDB Atlas');
    const db = client.db('PharmaApp');
    const userRegistryCollection = db.collection('userRegistry');
    const pendingRequestCollection = db.collection('pendingRequests');
    //const collection = db.collection('sidebardata');

    // Define a route to fetch data
    app.get('/api/sidebardata', async (req, res) => {
      try {
        const data = await db.collection('sidebardata').find({}).toArray();
        res.json(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/api/synthesisTreeData',async(req,res)=>{
      try {
         const data = await db.collection('synthesisTreeData').find({}).toArray();
         res.json(data); 
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

    app.post('/api/register', async (req, res) => {
      //res.send('Post request received');
      try {
        const userData = req.body; // Assuming the client sends JSON data with user details
        console.log(userData);
        const result = await userRegistryCollection.insertOne(userData);
        res.json({ success: true, message: 'User registered successfully', data: result});
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/api/pendingRequests', async(req,res)=>{
      try {
        const data = await pendingRequestCollection.find({}).toArray();
        res.json(data);
      } catch (error) {
        console.log('Error fetching data:',error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

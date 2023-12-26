const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Atlas connection URI
const uri = 'mongodb+srv://niravMeghani:FdhopgXdro7aRfIG@cluster0.7cmxwc4.mongodb.net/?retryWrites=true&w=majority'; 

// Connect to MongoDB Atlas
MongoClient.connect(uri)
  .then((client) => {
    console.log('Connected to MongoDB Atlas');
    const db = client.db('PharmaApp');
    const collection = db.collection('sidebardata');

    // Define a route to fetch data
    app.get('/api/sidebardata', async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

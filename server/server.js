const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());


// Connect to MongoDB Atlas
MongoClient.connect(process.env.MONGODB_URI)
  .then((client) => {
    console.log('Connected to MongoDB Atlas');
    const db = client.db('PharmaApp');
    const userRegistryCollection = db.collection('userRegistry');
    const pendingRequestCollection = db.collection('pendingRequests');
    const flowMapCollection = db.collection('flowmap');



    // SidebarData
    app.get('/api/sidebardata', async (req, res) => {
      try {
        const data = await db.collection('sidebardata').find({}).toArray();
        res.json(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    //Synthesis tree data
    app.get('/api/synthesisTreeData',async(req,res)=>{
      try {
         const data = await db.collection('synthesisTreeData').find({}).toArray();
         res.json(data); 
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

    //User Registration 
    app.post('/api/register', async (req, res) => {
      try {
        const userData = req.body; // Assuming the client sends JSON data with user details
        console.log(userData);
        const result = await userRegistryCollection.insertOne(userData);
        res.json({ success: true, message: 'User registered successfully', data: result });
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.post('/api/approvestatusupdate', async(req, res) => {
      try {
        
        const taskId = req.body; // Assuming the client sends JSON data with user details
        const filter = {
          data: taskId.data
        };
    const update = { $set: { "status": "Approved" ,"comment": taskId.comment, "statusModifiedData": taskId.statusModifiedData} };

    const postresult = await pendingRequestCollection.updateOne(filter, update);

    if (postresult.modifiedCount === 1) {
      res.json({success: true, message: 'Approved', data: postresult });
      console.log('Document updated successfully');
    } else {
      console.log('Document not found or not updated');
    }
      } catch (error) {
        console.error('Error approving the task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.post('/api/declinestatusupdate', async(req, res) => {
      try {
        
        const taskId = req.body; // Assuming the client sends JSON data with user details
        console.log(taskId);
        const filter = {
          data: taskId.data
        };
     const update = { $set: { "status": "Declined" ,"comment": taskId.comment, "statusModifiedData": taskId.statusModifiedData} };

    const postresult = await pendingRequestCollection.updateOne(filter, update);

    if (postresult.modifiedCount === 1) {
      res.json({success: true, message: 'Declined', data: postresult });
      console.log('Document updated successfully');
    } else {
      console.log('Document not found or not updated');
    }
      } catch (error) {
        console.error('Error Decline the task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

     //Send Request to the manager
     app.post('/api/sendRequest', async(req,res)=>{
      try{
        const request = req.body;
        const result = await pendingRequestCollection.insertOne(request);
        res.json({ success: true, message: 'Request Sent successfully', data: result });
      }
      catch (error) {
        console.error('Error sending Request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

    //fetch the pendingRequests
    app.get('/api/pendingRequests', async(req,res)=>{
      try {
        const data = await pendingRequestCollection.find({}).toArray();
        res.json(data);
      } catch (error) {
        console.log('Error fetching data:',error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

    //fetch the user details
    app.get('/api/register',async(req,res)=>{
      try{
        const data = await userRegistryCollection.find({}).toArray();
        res.json(data);
      } catch(error){
        console.log('Could not found registerd users: ',error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

    //send the flowchart data into db
    app.post('/api/flowchartData', async(req,res)=>{
      try {
        const request = req.body;
        const result = await flowMapCollection.insertOne(request);
        res.json({ success: true, message: 'Request Sent successfully', data: result });

      } catch (error) {
        console.error('Error while inserting flow', error);
        res.status(500).json({ error: 'Internal server Error' });
      }
    })

// Define Express routes
app.get('/api/process-maps', async (req, res) => {
  try {
    const processMaps = await flowMapCollection.find({},{projection:{_id:1,name:1}}).toArray();
    console.log("Process Maps",processMaps);
    res.json(processMaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/process-map/:id', async (req, res) => {
  try {
    console.log("req.params.id:",req.params.id);
    const flow = await flowMapCollection.findOne({_id:new ObjectId(req.params.id)});
    console.log("flow:",flow);
    if (flow) {
      res.json(flow);
    } else {
      res.status(404).send('Flow not found');
    }
  } catch (error) {
    console.error('Error fetching flow data:', error);
    res.status(500).send('Error fetching flow data');
  }
});


app.put('/api/process-map/:id', async (req, res) => {
  try {
    const flowId = req.params.id;
    const { nodes, edges } = req.body;
    const result = await flowMapCollection.updateOne(
      { _id: new ObjectId(flowId) },
      { $set: { nodes, edges } }
    );

    if (result.matchedCount > 0) {
      res.json({ message: 'Flow updated successfully' });
    } else {
      res.status(404).send('Flow not found');
    }
  } catch (error) {
    console.error('Error updating flow:', error);
    res.status(500).send('Internal Server Error');
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

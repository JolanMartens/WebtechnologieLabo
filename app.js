const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

// Initialize MongoDB connection
if (!client) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

// Helper function to get database connection
async function getDatabase() {
    const client = await clientPromise;
    return client.db('GentTennisWedstrijd');
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Get all members
app.get('/api/get_member_list', async (req, res) => {
    try {
        console.log("SERVER: get_member_list called");

        const db = await getDatabase();
        const membersCollection = db.collection('members');
        const members = await membersCollection.find({}).toArray();

        res.json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Failed to fetch members', details: error.message });
    }
});

// Add new member
app.post('/api/new_member', async function(req, res) {
    try {
        console.log("SERVER: post_new_member called");
        const newMember = req.body;
        console.log(newMember);

        const db = await getDatabase();
        const membersCollection = db.collection('members');
        await membersCollection.insertOne(newMember);

        res.redirect('/');
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ error: 'Failed to add member', details: error.message });
    }
});

// Replace entire member list (for sorting persistence)
app.post('/api/set_member_list', async function(req, res) {
    try {
        console.log("SERVER: set_member_list called");
        const members = req.body.members;
        console.log(members);

        const db = await getDatabase();
        const membersCollection = db.collection('members');

        // Delete all existing members
        await membersCollection.deleteMany({});

        // Insert new sorted list
        if (members && members.length > 0) {
            await membersCollection.insertMany(members);
        }

        res.redirect('/');
    } catch (error) {
        console.error('Error setting member list:', error);
        res.status(500).json({ error: 'Failed to set member list', details: error.message });
    }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`SERVER: App listening on port ${port}`);
    });
}

// Export for Vercel
module.exports = app;
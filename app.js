const express = require('express')
var bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');

require('dotenv').config();

const app = express()
const port = 3000

app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json());
app.use(express.static('public'));


/*var amount_of_members = 0;
var member_list=[];*/

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;
let membersCollection;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        db = client.db('GentTennisWedstrijd');
        membersCollection = db.collection('members');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectDB();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Get all members
app.get('/api/get_member_list', async (req, res) => {
    try {
        console.log("SERVER: get_member_list called");
        const members = await membersCollection.find({}).toArray();
        res.json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

// Add new member
app.post('/api/new_member', async function(req, res) {
    try {
        console.log("SERVER: post_new_member called");
        const newMember = req.body;
        console.log(newMember);

        await membersCollection.insertOne(newMember);
        res.redirect('/');
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ error: 'Failed to add member' });
    }
});

app.post('/api/set_member_list', async function(req, res) {
    try {
        console.log("SERVER: set_member_list called");
        const members = req.body.members;
        console.log(members);

        // Delete all existing members
        await membersCollection.deleteMany({});

        // Insert new sorted list
        if (members && members.length > 0) {
            await membersCollection.insertMany(members);
        }

        res.redirect('/');
    } catch (error) {
        console.error('Error setting member list:', error);
        res.status(500).json({ error: 'Failed to set member list' });
    }
});


// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`SERVER: Example app listening on port ${port}`)
    })
}

// Export for Vercel
module.exports = app;
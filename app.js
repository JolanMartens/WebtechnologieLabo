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

// Get all players
app.get('/api/get_player_list', async (req, res) => {
    try {
        console.log("SERVER: get_player_list called");

        const db = await getDatabase();
        const playersCollection = db.collection('players');
        const players = await playersCollection.find({}).sort({ firstName: 1, lastName: 1 }).toArray();

        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Failed to fetch players', details: error.message });
    }
});

// Add new player
app.post('/api/new_player', async function(req, res) {
    try {
        console.log("SERVER: post_new_player called");
        const { firstName, lastName, dateOfBirth, email, password} = req.body;

        const db = await getDatabase();
        const playersCollection = db.collection('players');

        // Check if player already exists
        const existingplayer = await playersCollection.findOne({
            email: email.trim(),
        });

        if (existingplayer) {
            return res.status(400).json({ error: 'player already exists' });
        }

        const newPlayer = {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: new Date(dateOfBirth),
            email: email,
            password: password,
            teamId: null
        }

        const result = await playersCollection.insertOne(newPlayer);
        console.log("succesfully added player: ", result);

        res.redirect('/');
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({ error: 'Failed to add player', details: error.message });
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


// maps

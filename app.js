const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

require('dotenv').config(); // load environment values from .env file

const app = express();
const port = 3000;

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

// Initialize MongoDB connection if there isn't one
if (!client) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

// return database
async function getDatabase() {
    const client = await clientPromise; // wait for the connection
    return client.db('GentTennisWedstrijd');
}

// Render pages with PUG
app.get('/', (req, res) => {
    res.render('index', { title: 'Home - Tennis dubbelspel tornooi' });
});

app.get('/index', (req, res) => {
    res.render('index', { title: 'Home - Tennis dubbelspel tornooi' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'Over ons' });
});

app.get('/teams', (req, res) => {
    res.render('teams', { title: 'Teams' });
});

app.get('/loginPage', (req, res) => {
    res.render('loginPage', { title: 'Inloggen' });
});

app.get('/registerPage', (req, res) => {
    res.render('registerPage', { title: 'Registreren' });
});

app.get('/allPlayers', (req, res) => {
    res.render('allPlayers', { title: 'Alle Spelers' });
});

app.get('/mijnAccountPage', (req, res) => {
    res.render('mijnAccountPage', { title: 'Mijn Account' });
});

app.get('/jouwTeam', (req, res) => {
    res.render('jouwTeam', { title: 'Jouw Team' });
});


// give the main htlml file when accessing root url
/*app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});*/

// Get all players
app.get('/api/get_player_list', async (req, res) => {
    try {
        console.log("SERVER: get_player_list called");

        const db = await getDatabase();
        const playersCollection = db.collection('players'); // get players collection
        const players = await playersCollection.find({}).sort({ firstName: 1, lastName: 1 }).toArray(); // get all players and sort by firstName and LastName

        res.json(players); // send player data back

    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Failed to fetch players', details: error.message });
    }
});

// Add new player
app.post('/api/new_player', async function(req, res) {
    try {
        console.log("SERVER: post_new_player called");

        const { firstName, lastName, dateOfBirth, email, password} = req.body; // get player data from body
        const db = await getDatabase();
        const playersCollection = db.collection('players');

        // Check if player with same email already exists
        const existingPlayer = await playersCollection.findOne({
            email: email.trim()
        });

        if (existingPlayer) {
            return res.status(400).json({ error: 'player already exists' });
        }

        // create new player object
        const newPlayer = {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: new Date(dateOfBirth),
            email: email,
            password: password,
            teamId: null
        }

        const result = await playersCollection.insertOne(newPlayer); // insert player into database

        console.log("succesfully added player: ", result);

        res.redirect('/'); // go back to root
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({ error: 'Failed to add player', details: error.message });
    }
});

// login
app.post('/api/login', async function(req, res) {
   try {
       console.log("SERVER: post_login called");
       const { email, password } = req.body;

       const db = await getDatabase();
       const playersCollection = db.collection('players');

       const player = await playersCollection.findOne({email: email.trim()}); // find player by email

       // give error when player or password is wrong
       if (!player) {
           return res.status(400).json({ error: 'Wachtwoord of Email is fout/bestaat niet' });
       }
       if (player.password !== password) {
           return res.status(401).json({ error: 'Wachtwoord of Email is fout/bestaat niet' });
       }

       //send player data without password
       const { password: _, ...playerData } = player;
       res.json({
           success: true,
           player: playerData,
           message: 'Login successful'
       });

   } catch (error) {
       console.error('Error during login:', error);
       res.status(500).json({ error: 'Login Failed', details: error.message });
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

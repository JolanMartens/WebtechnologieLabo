const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config(); // load environment values from .env file

const app = express();
const port = 3000;

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());

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
app.get('/cookies', (req, res) => {
    res.render('cookies', { title: 'cookies' });
});

app.get('/newTeam',(req, res) => {
  res.render('newTeam', { title: 'Maak een nieuw team' });
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

app.get('/schrijf-je-in', async (req, res) => {
  try {
    const userId = req.cookies?.userId; // get cookie

    if (!userId) {
      // Not logged in => register
      return res.redirect('/registerPage');
    }

    const db = await getDatabase();
    const playersCollection = db.collection('players');
    const currentUser = await playersCollection.findOne({ _id: new ObjectId(userId) });

    if (!currentUser) {
      // Cookie invalid => not logged in
      return res.redirect('/registerPage');
    }

    // Logged in => new team page
    return res.redirect('/newTeam');
  } catch (error) {
    console.error("Error in /schrijf-je-in route:", error);
    res.redirect('/registerPage'); // fallback
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

        if (teamId) {
            const teamPlayerCount = await playersCollection.countDocuments({ teamId: new ObjectId(teamId) });
            if (teamPlayerCount >= 2) {
                return res.status(400).json({ error: 'Team already has two players' });
            }
        }


        // create new player object
        const newPlayer = {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: new Date(dateOfBirth),
            email: email,
            password: password,
            teamId: teamId ? new ObjectId(teamId) : null
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


app.post('/api/new_team', async (req, res) => {
  try {
    const { teamName, secondFirstName, secondLastName, secondEmail, secondDateOfBirth } = req.body;
    const db = await getDatabase();
    const teamsCollection = db.collection('teams');
    const playersCollection = db.collection('players');

    // 1. Check if team name already exists
    const existingTeam = await teamsCollection.findOne({ teamName: teamName.trim() });
    if (existingTeam) {
      return res.status(400).json({ error: 'Team name already in use' });
    }

    // 2. Get current logged-in user (from cookie/session)
    const currentUserId = req.cookies?.userId; // assuming you set this at login
    if (!currentUserId) {
      return res.status(401).json({ error: 'Not logged in' });
    }
    const currentUser = await playersCollection.findOne({ _id: new ObjectId(currentUserId) });
    if (!currentUser) {
      return res.status(404).json({ error: 'Current user not found' });
    }

    // 3. Create new team
    const teamResult = await teamsCollection.insertOne({
      teamName: teamName.trim(),
      createdAt: new Date(),
      createdBy: currentUser._id
    });
    const teamId = teamResult.insertedId;

    // 4. Update current user to be first player in team
    await playersCollection.updateOne(
      { _id: currentUser._id },
      { $set: { teamId: teamId, role: 'captain' } }
    );

    // 5. Add second player
    const secondPlayer = {
      firstName: secondFirstName,
      lastName: secondLastName,
      email: secondEmail,
      dateOfBirth: new Date(secondDateOfBirth),
      teamId: teamId,
      role: 'member'
    };
    const secondResult = await playersCollection.insertOne(secondPlayer);

    res.status(201).json({
      success: true,
      team: { id: teamId, teamName },
      players: [
        { id: currentUser._id, firstName: currentUser.firstName, lastName: currentUser.lastName },
        { id: secondResult.insertedId, firstName: secondFirstName, lastName: secondLastName }
      ]
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team', details: error.message });
  }
});

app.get('/api/get_teams_with_players', async (req, res) => {
    try {
        const db = await getDatabase();
        const teams = await db.collection('teams').aggregate([
            {
                $lookup: {
                    from: 'players',
                    localField: '_id',
                    foreignField: 'teamId',
                    as: 'players'
                }
            },
            {
                $project: {
                    teamName: 1,
                    players: {
                        firstName: 1,
                        lastName: 1,
                        email: 1
                    }
                }
            }
        ]).toArray();

        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch teams with players', details: error.message });
    }
});
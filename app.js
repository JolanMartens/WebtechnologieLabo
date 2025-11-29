const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

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

// Function to send email using Brevo REST API
async function sendInviteEmail(toEmail, firstName, teamName, firstNameTeammate) {
    const url = "https://api.brevo.com/v3/smtp/email";

    const options = {
        method: "POST",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: { email: process.env.SENDER_EMAIL, name: "Gent Tennis Admin" },
            to: [{ email: toEmail, name: firstName }],
            subject: `Uitnodiging voor team: ${teamName}`,
            htmlContent: `
                <html>
                    <body>
                        <h1>Hallo ${firstName},</h1>
                        <p>  <strong>${firstNameTeammate}</strong> heeft u net lid gemaakt van het team <strong>${teamName}</strong>.</p>
                        <p>Wilt u niet bij dit team horen? Verlaat het team op onze website via "MIJN ACCOUNT".</p>
                        <a href="https://webtechnologie-labo.vercel.app"> Klik hier om naar onze site te gaan.</a>
                    </body>
                </html>
            `
        })
    };

    try {
        await fetch(url, options);
        console.log(`Email sent to ${toEmail}`);
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

async function sendRegisterEmail(toEmail, firstName) {
    const url = "https://api.brevo.com/v3/smtp/email";

    const options = {
        method: "POST",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: { email: process.env.SENDER_EMAIL, name: "Gent Tennis Admin" },
            to: [{ email: toEmail, name: firstName }],
            subject: `Inschrijving Dubbelspeltoernooi Gent`,
            htmlContent: `
                <html>
                    <body>
                        <h1>Hallo ${firstName},</h1>
                        <p>U hebt u zonet ingeschreven voor het dubbelspeltoernooi van Gent.</p>
                        <p>Check zeker onze website voor meer info en bij verdere vragen contacteer ons via <a href="mailto:info@dubbelspelgent.com">info@dubbelspelgent.com</a>.</p>
                        <p><strong>Veel tennis plezier!!!</strong></p>
                        <a href="https://webtechnologie-labo.vercel.app"> Klik hier om naar onze site te gaan.</a>
                    </body>
                </html>
            `
        })
    };

    try {
        await fetch(url, options);
        console.log(`Email sent to ${toEmail}`);
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

// check if user is Admin
async function requireAdmin(req, res, next) {
    try {
        const userId = getCookie(req, 'userId');

        if (!userId) {
            return res.redirect('/loginPage');
        }

        const db = await getDatabase();
        const user = await db.collection('players').findOne({ _id: new ObjectId(userId) });

        if (user && user.role === 'admin') { // log in user as admin else as user
            return next();
        } else {
            return res.redirect('/index');
        }
    } catch (error) {
        console.error("requireAdmin error:", error);
        res.status(500).send("requireAdmin error");
    }
}

app.delete('/api/admin/delete_player/:id', async (req, res) => {
    const userId = req.params.id;
    const db = await getDatabase();

    // Delete the player
    await db.collection('players').deleteOne({_id: new ObjectId(userId)});

    res.json({ success: true, message: 'Player deleted' });


});

app.put('/api/admin/update_player/:id', async (req, res) => {
    const playerId = req.params.id;
    const { firstName, lastName, email, role } = req.body;

    const db = await getDatabase();

    const result = await db.collection('players').updateOne(
        { _id: new ObjectId(playerId) },
        {
            $set: {
                firstName: firstName,
                lastName: lastName,
                email: email,
            }
        });

    console.log('player updated: ', result);
    res.json({ success: true, message: 'player updated' });
});

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

app.get('/admin',requireAdmin ,(req, res) => {
    res.render('admin', { title: 'admin' });
});

app.get('/matchbracket', (req, res)=> {
    res.render('matchbracket', { title: 'matchbracket' });
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
    const userId = getCookie(req, 'userId');

    if (!userId) {
      return res.redirect('/registerPage');
    }

    const db = await getDatabase();
    const playersCollection = db.collection('players');
    const currentUser = await playersCollection.findOne({ _id: new ObjectId(userId) });

    if (!currentUser) {
      return res.redirect('/registerPage');
    }

    if (currentUser.teamId){
      return res.redirect('/jouwTeam')
    }

    return res.redirect('/newTeam');
  } catch (error) {
    console.error("Error in /schrijf-je-in route:", error);
    res.redirect('/registerPage');
  }
});

// Add new player
app.post('/api/new_player', async function(req, res) {
    try {
        console.log("SERVER: post_new_player called");

        const {firstName, lastName, dateOfBirth, email, password} = req.body; // get player data from body
        const db = await getDatabase();
        const playersCollection = db.collection('players');

        // Check if player with same email already exists
        const existingPlayer = await playersCollection.findOne({
            email: email.trim()
        });

        if (existingPlayer) {
            return res.status(400).json({error: 'player already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // create new player object
        const newPlayer = {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: new Date(dateOfBirth),
            email: email,
            password: hashedPassword,
            teamId: null,
            role: 'member'
        }

        const result = await playersCollection.insertOne(newPlayer); // insert player into database

        console.log("succesfully added player: ", result);

        res.cookie('userId', result.insertedId.toString(), {
            maxAge: 86400000,
            httpOnly: false,
            path: '/'
        });
        res.cookie('isLoggedIn', 'true', {
            maxAge: 86400000,
            httpOnly: false,
            path: '/'
        });

        await sendRegisterEmail(email, firstName);

        res.json({
            success: true,
            player: {
                _id: result.insertedId,
                firstName: firstName,
                lastName: lastName,
                email: email
            }
        });

    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({error: 'Failed to add player', details: error.message});
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
       const isPasswordValid = await bcrypt.compare(password, player.password);

       if (!isPasswordValid) {
           return res.status(400).json({ error: 'Wachtwoord of Email is fout/bestaat niet' });
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

app.put('/api/teams/:id/add_score', async (req, res) => {
  try {
    const teamId = req.params.id;
    const { points } = req.body;

    const db = await getDatabase();
    const teamsCollection = db.collection('teams');

    const result = await teamsCollection.updateOne(
      { _id: new ObjectId(teamId) },
      { $inc: { score: points } }  
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json({ success: true, message: "Score updated" });

  } catch (error) {
    console.error("Error adding score:", error);
    res.status(500).json({ error: "Failed to update score" });
  }
});



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

    // 2. Get current logged-in user from cookie
    const currentUserId = getCookie(req, 'userId');
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
      createdBy: currentUser._id,
      score: 0
    });
    const teamId = teamResult.insertedId;

    // 4. Update current user
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

    await sendInviteEmail(secondEmail, secondFirstName, teamName, currentUser.firstName);

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
                    score: 1,
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

function getCookie(req, name) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;
  const match = cookies.split(';').find(c => c.trim().startsWith(name + '='));
  return match ? match.split('=')[1] : null;
}


app.get('/teamButton', async (req, res) => {
  try {
    const userId = getCookie(req, 'userId');

    if (!userId) {
      return res.redirect('/registerPage');
    }

    const db = await getDatabase();
    const playersCollection = db.collection('players');
    const currentUser = await playersCollection.findOne({ _id: new ObjectId(userId) });

    if (!currentUser) {
      return res.redirect('/registerPage');
    }

    if (currentUser.teamId) {
      return res.redirect('/jouwTeam');
    } else {
      return res.redirect('/newTeam');
    }

  } catch (error) {
    console.error("Error in /teamButton route:", error);
    res.redirect('/registerPage'); 
  }

});

app.get('/api/get_players_with_teams', async (req, res) => {
    try {
        const db = await getDatabase();
        const players = await db.collection('players').aggregate([
            {
                $lookup: {
                    from: 'teams',
                    localField: 'teamId',
                    foreignField: '_id',
                    as: 'team'
                }
            },
            {
                $sort: { firstName: 1, lastName: 1 }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    teamName: { $arrayElemAt: ['$team.teamName', 0] }
                }
            }
        ]).toArray();

        res.json(players);
    } catch (error) {
        console.error('Error fetching players with teams:', error);
        res.status(500).json({ error: 'Failed to fetch players with teams', details: error.message });
    }
});

app.get('/api/get_my_team', async (req, res) => {
  try {
    const userId = getCookie(req, 'userId');
    if (!userId) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    const db = await getDatabase();
    const playersCollection = db.collection('players');
    const teamsCollection = db.collection('teams');

    const currentUser = await playersCollection.findOne({ _id: new ObjectId(userId) });
    if (!currentUser || !currentUser.teamId) {
      return res.status(404).json({ error: 'User has no team' });
    }

    const team = await teamsCollection.aggregate([
      { $match: { _id: currentUser.teamId } },
      {
        $lookup: {
          from: 'players',
          localField: '_id',
          foreignField: 'teamId',
          as: 'players'
        }
      }
    ]).toArray();

    res.json(team[0]); // return just the user's team
  } catch (error) {
    console.error('Error fetching my team:', error);
    res.status(500).json({ error: 'Failed to fetch team', details: error.message });
  }
});


app.delete('/api/admin/delete_team/:id', async (req, res) => {
    const teamId = req.params.id;
    const db = await getDatabase();

    // Delete the team
    await db.collection('teams').deleteOne({_id: new ObjectId(teamId)});

    res.json({ success: true, message: 'team deleted' });


});
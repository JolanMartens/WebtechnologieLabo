const express = require('express')
var bodyParser = require('body-parser')
const app = express()

const port = 3000
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json());

var amount_of_members = 0;
var member_list=[];

app.use(express.static('public'));

app.get('/api/get_member_list', (req, res) => {
    console.log("SERVER: get_member_list called")
    res.json(member_list)
})

app.post('/api/new_member', function(req, res) {
    console.log("SERVER: post_new_member called")
    const newMember = req.body
    console.log(newMember)
    member_list.push(newMember)
    amount_of_members=amount_of_members+1;
    res.redirect('/');
})

app.post('/api/set_member_list', function(req, res) {
    console.log("SERVER: set_member_list called")
    member_list = req.body.members;
    console.log(member_list)
    res.redirect('/');
})

app.listen(port, () => {
  console.log(`SERVER: Example app listening on port ${port}`)
})
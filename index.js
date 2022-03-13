var express = require("express");
var fs = require("fs");
var app = express();

app.use(express.static("/public"));

// homepage
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// guestbook page containing guests' messages
app.get("/guestbook", function (req, res) {
  var data = require(__dirname + "/guestnotes.json");
  var title =
    "<h1 style='background-color: #DC143C; color: whitesmoke; margin: 5px; padding: 5px'>Tonttula gnomes' guestbook </h1>";
  var results =
    title +
    '<table border="3">' +
    "<tr>" +
    "<th>Name</th>" +
    "<th>Country</th>" +
    "<th>Message</th>" +
    "</tr>";

  var goElsewhere =
    '<h3>You can go to <a href="/">back to homepage</a> or <a href="/newmessage">leave new message</a>.</h3>';

  for (var i = 0; i < data.length; i++) {
    results +=
      "<tr>" +
      "<td>" +
      data[i].username +
      "</td>" +
      "<td>" +
      data[i].country +
      "</td>" +
      "<td>" +
      data[i].message +
      "</td>" +
      "</tr>";
  }
  res.send(results + "</table>" + goElsewhere);
});

// new message page where guests can leave their salutations
app.get("/newmessage", function (req, res) {
  res.sendFile(__dirname + "/public/newMessage.html");
});

// require the module required for using form data and parse
var bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));

// route for the guestbook form sending the data
app.post("/newmessage", function (req, res) {
  // load the existing data from the file containing guestbook comments
  var data = require(__dirname + "/guestnotes.json");
  var id = data.length;

  // create a new JSON object and add it to the existing data
  data.push({
    id: id,
    username: req.body.username,
    country: req.body.country,
    message: req.body.message,
    Date: new Date(),
  });

  // data in JSON format to string
  var jsonStr = JSON.stringify(data);

  // write the stringified data to a file
  fs.writeFile(__dirname + "/guestnotes.json", jsonStr, (err) => {
    if (err) throw err;
  });
  res.send(
    "Saved the data to a file. Browse to the <a href='/guestbook'>guestbook</a> to see."
  );
});

// new message page with ajax
app.get("/ajaxmessage", function (req, res) {
  res.sendFile(__dirname + "/public/ajaxMessage.html");
});

app.post("/ajaxmessage", function (req, res) {
  var username = req.body.username;
  var country = req.body.country;
  var message = req.body.message;

  // gets the messages in guestbook and makes a table
  var data = require(__dirname + "/guestnotes.json");

  var results =
    '<table border="3">' +
    "<tr>" +
    "<th>Name</th>" +
    "<th>Country</th>" +
    "<th>Message</th>" +
    "</tr>";

  for (var i = 0; i < data.length; i++) {
    results +=
      "<tr>" +
      "<td>" +
      data[i].username +
      "</td>" +
      "<td>" +
      data[i].country +
      "</td>" +
      "<td>" +
      data[i].message +
      "</td>" +
      "</tr>";
  }
  var lastRow =
    "<tr>" +
    "<td>" +
    username +
    "</td>" +
    "<td>" +
    country +
    "</td>" +
    "<td>" +
    message +
    "</td>" +
    "</tr>" +
    "</table>";

  res.send(results + lastRow);
});

// 404 MESSAGE
app.get("*", function (req, res) {
  res.status(404).send("Sorry, requested page not found.");
});

app.listen(8080, function () {
  console.log("This app is listening on port 8080");
});

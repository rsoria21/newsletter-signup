// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// this is used to fetch a path to static files(local files on your computer, so make a public folder and use this app.use to fetch the file.)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    // [] these mean array
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  // this connect mailchimp to my account. after lists and then / my number
  // api key/generated code gose after the +
  const url = "https://us2.api.mailchimp.com/3.0/lists/+";

  const options = {
    method: "POST",
    // api key/generated code gose below
    auth: "",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      // sendFile sends a full page and the __direname
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});
// this is used for the button to redirect you back to the home page
app.post("/failure.html", function (req, res) {
  res.redirect("/");
});
// this is also used for the button to redirect you back to the home page
app.post("/success.html", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

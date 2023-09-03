const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

require("dotenv").config();

// Configure Mailchimp API
mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us14",
});

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Define a route for the home directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle form submission
app.post("/submit", async (req, res) => {
  try {
    // Extract form data
    const { firstName, lastName, email, golfCourseName, role, phoneNumber } = req.body;
    console.log(golfCourseName);
    console.log(phoneNumber);
    console.log(role);

    const response = await mailchimp.lists.addListMember("d2af527b9c", {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          COURSENAME: golfCourseName,
          PHONENUM: phoneNumber,
          REQROLE: role,
        },
      });
      

    //console.log("Contact added to Mailchimp:", response);

    // Redirect to success page
    res.redirect("/success.html");
  } catch (error) {
    console.error("Error adding contact to Mailchimp:", error);

    // Redirect to failure page
    res.redirect("/failure.html");
  }
});

// Start the server
app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});

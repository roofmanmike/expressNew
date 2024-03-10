//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');

const homeStartingContent = "Paragraph from backend with EJS";
const aboutContent = "'about' content";
const contactContent = "'Contact' contactContent";
const posts = [];
const app = express();
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Set up Chrome options
const options = new chrome.Options();
options.addArguments('--headless'); // Run Chrome in headless mode (without GUI)

// Create a new WebDriver instance
const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

// Define the URL you want to scrape
const url = 'https://www.google.com/search?q=w3+schools&oq=w3+sc&gs_lcrp=EgZjaHJvbWUqBwgCEAAYgAQyBggAEEUYOTIGCAEQIxgnMgcIAhAAGIAEMgkIAxAAGAoYgAQyBggEEEUYPDIGCAUQRRg8MgYIBhBFGDwyBggHEAUYQNIBCDU5MTJqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8';

// Function to scrape h1 titles
async function scrapeTitles() {
  try {
    // Open the website
    await driver.get(url);

    // Wait for some time to let the page load (you might need to adjust the time)
    await driver.sleep(2000);

    // Find all h1 elements on the page
    const h1Elements = await driver.findElements(By.tagName('h1'));
    const scrapedList = [];
    // Print the text content of each h1 element
    for (const h1Element of h1Elements) {
      const text = await h1Element.getText();
      console.log('H1 Title:', text);
      scrapedList.push(text);
      console.log(scrapedList);
    }
  } finally {
    // Close the WebDriver instance
    await driver.quit();
  }
}

// Call the function to start scraping
scrapeTitles();





app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  let item = homeStartingContent;
  res.render("home", {startingContent: homeStartingContent, posts: posts});
  });
  app.get("/about", function(req, res){
    let item = aboutContent;
    res.render("about", {aboutContent: aboutContent});
    });
  app.get("/contact", function(req, res){
    let item = contactContent;
    res.render("contact", {contactContent: contactContent});
    });
  app.get("/compose", function(req, res){
    res.render("compose");
    });
    
  app.post("/compose", function(req, res){
    const post = {
      title: req.body.postTitle,
      content: req.body.postBody
    };

    posts.push(post);
  
    // res.render("home", {posts: posts});
    // res.render("home", {startingContent: homeStartingContent, posts: posts});


    res.redirect("/");
    });
    app.get("/post", function(req, res){
      res.render("post");
    })
    
    app.get("/post/:postName", function(req, res){
      const requestedTitle = _.lowerCase(req.params.postName);

      posts.forEach(function(post){
        const storedTitle = _.lowerCase(post.title);

        if (storedTitle === requestedTitle) {

          res.render("post", {
            title: post.title,
            content: post.content
          });

        }
        
      });
    });





app.listen(3000, function() {
  console.log("Server started on port 3000");
});

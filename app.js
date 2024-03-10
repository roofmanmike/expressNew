//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');

var homeStartingContent = "Your name scraped and pushed thru EJS to this front end from your site, refresh to see it or add more with 'compose'";
const aboutContent = "'about' content";
const contactContent = "'Contact' contactContent";
const posts = [];
const scrapedList = [];
const app = express();
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


const options = new chrome.Options();
options.addArguments('--headless'); 


const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();


  const url = 'https://rapidmod.io/';


async function scrapeTitles() {
  try {

    await driver.get(url);


    await driver.sleep(2000);


    const h1Elements = await driver.findElements(By.className('site-title'));

    for (const h1Element of h1Elements) {
      const text = await h1Element.getText();
      scrapedList.push(text);
      
      console.log(text);
    }
  } finally {

    await driver.quit();
  }
}

scrapeTitles();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  let item = homeStartingContent;
  let scrapedUp = scrapedList;
  scrapedUp.toString();
  res.render("home", {startingContent: homeStartingContent, scrapedUp: scrapedUp, posts: posts});
  });
  app.get("/about", function(req, res){
    let item = aboutContent;
    let scrapedUp = scrapedList;
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
  

    res.redirect("/");
    });
    
    
    





app.listen(3000, function() {
  console.log("Server started on port 3000");
});

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});

const wikiSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Article = new mongoose.model("Article", wikiSchema);

///////////////////////////////// requests to specific article  ////////////////////////////////////
app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, articlesFound) => {
      res.send(articlesFound);
    });
  })
  .post((req, res) => {
    const newArt = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArt.save((err) => {
      if (!err) res.send("Successfully added document");
      else res.send(err);
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, (err) => {
      if (!err) res.send("successfully deleted all items");
      else res.send(err);
    });
  });

/////////////////////////////////// requests to specific article // by route parameter/////////////////

app
  .route("/articles/:clientRoute")
  .get((req, res) => {
    const requestedRoute = req.params.clientRoute;
    Article.findOne({ title: requestedRoute }, (err, itemFound) => {
      if (!err) {
        if (itemFound)
          /////////// if(itemFound) check if actually is an item found!
          res.send(itemFound);
        else res.send("there are no articles matching this search");
      } else res.send(err);
    });
  })
  .put((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.clientRoute },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err, result) {
        if (!err) res.send("document upadated successfully" + result);
        else res.send(err);
      }
    );
  })
  .patch((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.clientRoute },
      { $set: req.body },
      { overwrite: false },
      function (err, result) {
        if (!err) res.send("document updated successfully" + result);
        else res.send(err);
      }
    );
  })
  .delete((req, res) => {
    Article.findOneAndDelete(
      {
        title: req.params.clientRoute,
      },
      function (err) {
        if (!err) res.send("succesfully deleted doc");
        else res.send(err);
      }
    );
  });

app.listen("3000", function () {
  console.log("server started on port 3000");
});

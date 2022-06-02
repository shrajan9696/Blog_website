//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogDB");

const blogSchema = new mongoose.Schema({
  title:String,
  content:String
});


const Post = mongoose.model("Post",blogSchema);

const homeStartingContent ="This is a basic blog website where you can post your own blogs and delete them Create some beautiful and unique blog it's easy."
const aboutContent = "This is a basic blog website where you can post your own blogs and delete them Create some beautiful and unique blog it's easy."

const contactContent = "email:jainshrajan482@gmail.com"
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let posts = [];

app.get("/", function(req, res){

  Post.find({},function(err,posts){
    if(err){
      console.log(err);
    }

    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });


});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };
  const title = req.body.postTitle;
  const content = req.body.postBody;

  const newPost = new Post({
    title:title,
    content:content
  });

newPost.save(function(err){
  if(!err){
    res.redirect("/");
  }
})


  // posts.push(post);



});

app.get("/posts/:postId" ,function(req, res){
  const requestedPostId = (req.params.postId);

  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);
  //
  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

  Post.findOne({_id:requestedPostId},function(err,post){
    res.render("post",{
      title:post.title,
      content:post.content
    });
  });

});

app.post("/delete",function(req,res){
  const id = req.body.id;
  Post.findByIdAndRemove(id,function(err){
    if(err){
      console.log(err);
    }
  });
  res.redirect("/");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

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

const userSchema = new mongoose.Schema({
  name:String,
  password:String,
  content:[{
    title:String,
    pcontent:String,
    createdat:String
  }]
});


const Post = mongoose.model("Post",blogSchema);
const User = mongoose.model("User",userSchema);

const homeStartingContent ="This is a basic blog website where you can post your own blogs and delete them Create some beautiful and unique blog it's easy."
const aboutContent = "This is a basic blog website where you can post your own blogs and delete them Create some beautiful and unique blog it's easy."

const contactContent = "email:jainshrajan482@gmail.com"
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let posts = [];

app.get("/", function(req, res){

  User.find({},function(err,posts){
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

// app.get("/compose", function(req, res){
//   res.render("compose");
// });

app.get("/login",function(req,res){
  res.render("login",{message:""});
})

app.get("/signup",function(req,res){
  res.render("signup",{message:""});
})

app.post("/signup",function(req,res){
  const name=req.body.name;
  const password=req.body.password;
  User.findOne({name:name},function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      if(docs){
        console.log("person already exists");
        res.render("signup",{message:"username exists already. Please change!"});
      }
      else{
        const person = new User({
          name:name,
          password:password,

        });
        person.save(function(err){
          if(err){
            console.log(err);
          }
          else{

          res.render("compose",{name:name});
          }
        })
      }
    }
  })

});

app.post("/login",function(req,res){
  const name=req.body.name;
  const password=req.body.password;
  User.findOne({name:name},function(err,founduser){
    if(err){
      console,log(err);
    }
    else {
      if(founduser){
        if(founduser.password==password){
          console.log("successfully validated");
          res.render("userprofile",{persons:founduser});
        }
        else{
          console.log("wrong credentials");
          res.render("login",{message:"wrong credentials"});

        }
      }
      else   {
        console.log("wrong credentials");
        res.render("login",{message:"wrong credentials"});
      }

    }
  })
});

app.post("/compose", function(req, res){
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };
    var mydate1 = new Date();
    mydate1.toString();
   newpost={
     title : req.body.postTitle,
   pcontent : req.body.postBody,
   createdat: mydate1
   }

   const name = req.body.button;
  User.findOneAndUpdate(
    {name:name},
    {$push:{content:newpost}},
    function(err){
      if(err){
        console.log("error");
      }
      else{
        console.log("updated successfully");
          res.redirect("/");
      }
    }
  );



  // User.findOne({name:name},function(err,docs){
  //   if(err) console.log(err);
  //   else console.log(docs);
  // })

  // res.redirect("/");
  // console.log("saved");




});



// Saving Data into MongoDB



// newUser.save(function(err){
//   if(!err){
//
//     User.findOne({name:name},(err,found)=>{
//       if(err){
//         console.log(err);
//       }
//       else{
//         console.log(found);
//       }
//       res.redirect("/");
//     });
//   }
// })



// posts.push(post);
app.post("/founduser",function(req,res){
  const name=req.body.button;
  res.render("compose",{name:name});
});

app.post("/removepost",function(req,res){
  const str=req.body.button;
   const personid = str.substring(0, str.indexOf(' '));
  const postindex = Number(str.substring(str.indexOf(' ') + 1));
  console.log(req.body.button);
  console.log(personid);
  console.log(postindex);
  User.findOne({_id:personid},function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      console.log("index found");
    docs.content.splice(postindex,1);

    docs.save(function(error){
      if(error){
        console.log(error);
      }
      else{
        console.log("deleted successfully");
        res.render("userprofile",{persons:docs});
      }
    })
    }

  });

})






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

//   Post.findOne({_id:requestedPostId},function(err,post){
//     res.render("post",{
//       title:post.title,
//       content:post.content
//     });
//   });
//
// });
//
// app.post("/delete",function(req,res){
//   const id = req.body.id;
//   Post.findByIdAndRemove(id,function(err){
//     if(err){
//       console.log(err);
//     }
//   });
//   res.redirect("/");
// });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

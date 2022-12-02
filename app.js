//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const path= require("path");




const upload = require(__dirname+"/utils/multer");

mongoose.connect("mongodb+srv://Quotopedia24:shrajanjain@cluster0.6x9bzfs.mongodb.net/blogDB");


const userSchema = new mongoose.Schema({
  name:String,
  password:String,
  content:[{
    title:String,
    pcontent:String,
    createdat:String,
    avatar:String,
    cloudinary_id:String
  }]
});



const User = mongoose.model("User",userSchema);

const homeStartingContent ="Quotopedia24 is a basic blog website where you can post your own quotes and delete them . Lets bundle up your thoughts and quotes  it's easy."
const aboutContent = "This is a basic blog website where you can post your own blogs and delete them Create some beautiful and unique blog it's easy."

const contactContent = "email:jainshrajan482@gmail.com"
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



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
        // console.log("person already exists");
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
  // console.log(process.env.API);
  const name=req.body.name;
  const password=req.body.password;
  User.findOne({name:name},function(err,founduser){
    if(err){
      console.log(err);
    }
    else {
      if(founduser){
        if(founduser.password==password){
          // console.log("successfully validated");
          res.render("userprofile",{persons:founduser});
        }
        else{
          // console.log("wrong credentials");
          res.render("login",{message:"wrong credentials"});

        }
      }
      else   {
        // console.log("wrong credentials");
        res.render("login",{message:"wrong credentials"});
      }

    }
  })
});

app.post("/compose", upload.single("image"), function (req, res){

    var mydate1 = new Date();
    mydate1.toString();


   const name = req.body.button;
   cloudinary.config({
     cloud_name:"quotopedia24",
     api_key: "512418771847945",
     api_secret: "JoFV_tvv8FVHUauESime1CX4-uc"
   });
  cloudinary.uploader.upload(req.file.path,
   function(error, result) {
      if(error){
        console.log(error);
      }
      else{
        // console.log(result);
        const newpost={
          title : req.body.postTitle,
        pcontent : req.body.postBody,
        createdat: mydate1,
         avatar:   result.secure_url,
         cloudinary_id:   result.cloudinary_id
        }
        User.findOneAndUpdate(
          {name:name},
          {$push:{content:newpost}},
          function(err){
            if(err){
              console.log("error");
            }
            else{
              // console.log("updated successfully");
                // res.redirect("/");
                User.findOne({name:name},function(err,docs){
                  if(err)
                  {
                    console.log(err);
                  }
                  else{
                    res.render("userprofile",{persons:docs});
                  }
                })

            }
          }
        );

      }
    });





});







app.post("/founduser",function(req,res){
  const name=req.body.button;
  res.render("compose",{name:name});
});

app.post("/removepost",function(req,res){
  const str=req.body.button;
   const personid = str.substring(0, str.indexOf(' '));
  const postindex = Number(str.substring(str.indexOf(' ') + 1));
  // console.log(req.body.button);
  // console.log(personid);
  // console.log(postindex);
  User.findOne({_id:personid},function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      // console.log("index found");
    docs.content.splice(postindex,1);

    docs.save(function(error){
      if(error){
        console.log(error);
      }
      else{
        // console.log("deleted successfully");
        res.render("userprofile",{persons:docs});
      }
    })
    }

  });

})







app.post("/removeprofile",function(req,res){
  const id = req.body.button;
  User.findByIdAndRemove(id,function(err){
    if(err){
      console.log(err);
    }
  });
  // console.log("profile removed");
  res.redirect("/");
});


app.get("/shareprofile/:username",function(req,res){
  const username = req.params.username;
  // const id = req.body.button;
  //  console.log(id);
   console.log(username);
   User.findOne({name:username},function(err,docs){
     if(!err){
       res.render("share",{persons:docs})
       // console.log(docs);
     }
   })

})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,function(){
  console.log("server has started successfully");
});

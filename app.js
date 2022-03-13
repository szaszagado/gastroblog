const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const upload = require('express-fileupload');

const path = require('path');


 const exphbs = require('express-handlebars');
 const passport = require('passport');
 const localStrategy = require('passport-local').Strategy;
 const bcrypt = require('bcrypt');

 require('dotenv').config();


// //Step 1

// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'green3dsashe@gmail.com',
//     pass: 'Carpmasterfishing50'
//   }
// });

// //Step 2

// let mailOptions = {
//   from: 'green3dsashe@gmail.com',
//   to: 'carpmasterfishing@gmail.com',
//   subject: 'Testing the email in NODEMAIL',
//   text: 'Its working, yeeeeah!',
//   attachments: [
//     { filename: 'cake.jpg', path: './public/img/cake.jpg'}
//   ]
// };

// //Step 3

// transporter.sendMail(mailOptions, function(err, data) {
//   if (err) {
//     console.log('Error Occurs', err);
//   } else {
//     console.log('Email sent!!!!');
//   }
// });







//Adatbázis csatlakoztatása

 const mongoose = require('mongoose');
 mongoose.connect(process.env.MONGODB_URI);
 mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

 mongoose.connection.on("error", err => {
   console.log("err", err)
 });
 mongoose.connection.on("connected", (err, res) => {
   console.log("mongoose is connected")
 });

const app = express();

app.use(fileUpload());

app.use(flash()); 





//Admin felhasználó létrehozása az adatbázisban

 const UserSchema = new mongoose.Schema({
   username: {
     type: String,
     required: true
   },
   password: {
     type: String,
     required: true
   }
 });

 const User = mongoose.model('User', UserSchema);





const port = process.env.PORT || 3000;

require('dotenv').config();

//app.use(express.urlencoded( { extended: true } ));
//app.use(express.static('public'));
app.use(expressLayouts);


app.use(express.static(__dirname + '/public'));
 app.use(session({
     secret: "CookingBlogSecretSession",
     resave: false,
     saveUninitialized: true
   }));
   app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
   done(null, user.id);
 });

passport.deserializeUser(function (id, done) {
   User.findById(id, function (err, user) {
     done(err, user);
   });
 });

passport.use(new localStrategy(function (username, password, done) {
  User.findOne({ username: username}, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });

    bcrypt.compare(password, user.password, function (err, res) {
      if (err) return done(err);
      if (res === false) return done(null, false, { message: 'Incorrect password.' });

      return done(null, user);
    });
  });
}));



//Recept írás letiltása az olvasók elől
//POST, GET only ADMIN

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

function isLoggedOut(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/');
}


const submitRecipe = require('./server/routes/recipeRoutes')
app.get('/submit-recipe', isLoggedIn, submitRecipe);

//const submitRecipeOnPost = require('./server/routes/recipeRoutes')
//app.post('/submit-recipe', isLoggedIn, submitRecipeOnPost);




//Admin routes

app.get('/home', (req, res) => {
  res.render("findex", { title: "Home"});
});


app.get('/login', isLoggedOut, (req, res) => {

  const response = {
    title: "Gasztroblog - Bejelentkezés",
    error: req.query.error
  }


  res.render("login", response);
});


app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?error=true'
}));


app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});


app.get('/setup', async (req, res) => {
  const exists = await User.exists({ username: "admin" });

  if (exists) {
    res.redirect('/login');
    return;
  };

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash("pass", salt, function (err, hash) {
      if (err) return next(err);

      const newAdmin = new User({
        username: "admin",
        password: hash
      });

      newAdmin.save();

      res.redirect('/login');
    });
  });
});







app.get('/send-recipe', (req, res) => {
  res.render('email-form');
})


app.post('/send', (req, res) => {

    let uploadFile;
    let newuploadPath;
    let imageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      uploadFile = req.files.image;
      imageName = Date.now() + uploadFile.name;

      newuploadPath = require('path').resolve('./') + '/public/uploads/recipes_from_email' + imageName;

      uploadFile.mv(newuploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

  

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: 'false',
      auth: {
        user: 'green3dsashe@gmail.com',
        pass: 'Carpmasterfishing50'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

  let mailOptions = {
    from: '<green3dsashe@gmail.com>',
    to: 'carpmasterfishing@gmail.com',
    subject: 'Beküldött recept',
    text: '',
    html: "<h3>Recept beküldő adatai</h3><ul><li>Beküldő neve: " + req.body.sendername + "</li><li>Beküldő email címe: " + req.body.senderemail + "</li></ul><h3>Recept megnevezese: </h3><ul><li>" + req.body.recipename + "</li></ul><h3>Kategória fogás szerint: </h3><ul><li>" + req.body.categoryByServing + "</li></ul><h3>Kategória nemzetiség szerint: </h3><ul><li>" + req.body.categoryByNationality + "</li></ul><h3>Elkészítés: </h3><ul><li>" + req.body.description + "</li></ul><h3>Adag (főre): </h3><ul><li>" + req.body.servings + "</li></ul><h3>Hozzávalók: </h3><ul><li>" + req.body.ingredients + "</li></ul>",
    attachments: [{
      filename: imageName,
      path: newuploadPath
    }]
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log('Error Occurs', error);
    } else {
      console.log('Email senttttt!');
    }

    req.flash('Recipe has been added.')
    res.redirect('/send-recipe');
  });
});





app.use(cookieParser('CookingBlogSecure'));
//  app.use(session({
//    secret: 'CookingBlogSecretSession',
//    saveUninitialized: true,
//    resave: true
//  }));


// app.use(flash());
// app.use(fileUpload());


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');



const routes = require('./server/routes/recipeRoutes');
const { ObjectId } = require('bson');
const { timeStamp } = require('console');
const { fstat } = require('fs');
const { db } = require('./server/models/Category');
//const { ReadableStreamBYOBRequest } = require('stream/web');
app.use('/', routes);

app.listen(port, ()=> console.log(`Listening to port ${port}`));



//Hozzászólás
//POST

app.post("/do-comment", function (req, res) {
  db.collection("recipes").update({"_id": ObjectId(req.body.recipe_id) }, {
      $push: {
          "comments": {username: req.body.username, comment: req.body.comment}
      }, function (error, post) {
          res.send("comment succesffull");
      }
  })

})




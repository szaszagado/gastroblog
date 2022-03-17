require('../models/database');
const Category = require('../models/Category');
const Nationality = require('../models/Nationality');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const { populate, db } = require('../models/Category');
const { post } = require('../routes/recipeRoutes');
//const passport = require('passport');
// const express = require('express');
// const app = express();

// const User = require('../models/User')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

// const hbs = require('express-handlebars');
// const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt');
// const expressLayouts = require('express-ejs-layouts');


// const mongoose = require('mongoose');
//  mongoose.connect(process.env.MONGODB_URI);
//  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//  mongoose.connection.on("error", err => {
//    console.log("err", err)
//  });
//  mongoose.connection.on("connected", (err, res) => {
//    console.log("mongoose is connected")
//  });

// const UserSchema = new mongoose.Schema({
//    username: {
//      type: String,
//      required: true
//    },
//    password: {
//      type: String,
//      required: true
//    }
//  });

//  const User = mongoose.model('User', UserSchema);

//  const port = process.env.PORT || 3000;

//  require('dotenv').config();

//  app.use(expressLayouts);



// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser(function (user, done) {
//    done(null, user.id);
//  });

// passport.deserializeUser(function (id, done) {
//    User.findById(id, function (err, user) {
//      done(err, user);
//    });
//  });

// passport.use(new localStrategy(function (username, password, done) {
//   User.findOne({ username: username}, function (err, user) {
//     if (err) return done(err);
//     if (!user) return done(null, false, { message: 'Incorrect username.' });

//     bcrypt.compare(password, user.password, function (err, res) {
//       if (err) return done(err);
//       if (res === false) return done(null, false, { message: 'Incorrect password.' });

//       return done(null, user);
//     });
//   });
// }));

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { Timestamp, ObjectId } = require('mongodb');
const { count, timeStamp } = require('console');
mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const visitorSchema = new mongoose.Schema({
  name: String,
  count: Number
});
const Visitor = mongoose.model("Visitor",visitorSchema);


function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) return next();
   res.redirect('/login');
 }
 
 function isLoggedOut(req, res, next) {
   if (!req.isAuthenticated()) return next();
   res.redirect('/home');
 }

/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);

    const bestavg = await Recipe.find({}).sort({ratingAvg: -1}).limit(limitNumber);

    const categories = await Category.find({}).limit(limitNumber);
    const reggeli = await Recipe.find({ 'category': 'Reggeli' }).limit(limitNumber);
    const ebed = await Recipe.find({ 'category': 'Ebéd' }).limit(limitNumber);
    const vacsora= await Recipe.find({ 'category': 'Vacsora' }).limit(limitNumber);
    const desszert = await Recipe.find({ 'category': 'Desszert' }).limit(limitNumber);
    const levesek = await Recipe.find({ 'category': 'Levesek' }).limit(limitNumber);
    const egyebkategoria = await Recipe.find({ 'category': 'Egyéb' }).limit(limitNumber);

    const nationalities = await Nationality.find({}).limit(limitNumber);
    const thai = await Recipe.find({ 'nationality': 'Thai' }).limit(limitNumber);
    const kinai = await Recipe.find({ 'nationality': 'Kínai' }).limit(limitNumber);
    const indiai = await Recipe.find({ 'nationality': 'Indiai' }).limit(limitNumber);
    const olasz = await Recipe.find({ 'nationality': 'Olasz' }).limit(limitNumber);
    const magyar = await Recipe.find({ 'nationality': 'Magyar' }).limit(limitNumber);
    const angol = await Recipe.find({ 'nationality': 'Angol' }).limit(limitNumber);
    const egyebnemzetiseg = await Recipe.find({ 'nationality': 'Egyéb' }).limit(limitNumber);

    const recipe = await Recipe.find();


    const food = { latest, bestavg, recipe, reggeli, ebed, vacsora, desszert, levesek, thai, kinai, indiai, olasz, angol, magyar, egyebkategoria, egyebnemzetiseg};


    
    // Storing the records from the Visitor table
    let visitors = await Visitor.findOne({name: 'localhost'});

    // If the app is being visited first
    // time, so no records
    if(visitors == null) {
          
      // Creating a new default record
      const beginCount = new Visitor({
          name : 'localhost',
          count : 1
      })

      // Saving in the database
      beginCount.save()

      // Sending thee count of visitor to the browser
      //res.send(`<h2>Counter: `+1+'</h2>')

      // Logging when the app is visited first time
      console.log("First visitor arrived")
  }
  else{

      // Incrementing the count of visitor by 1
      visitors.count += 1;

      counter = visitors.count;
      

      // Saving to the database
      visitors.save()

      // Sending thee count of visitor to the browser
      //res.send(`<h2>Counter: `+visitors.count+'</h2>')

      // Logging the visitor count in the console
      console.log("visitor arrived: ",visitors.count)
  }
    
    recipeavg = recipe;
    
    res.render('index', {recipeavg: JSON.stringify(recipeavg), title: 'Gasztroblog - Kezdőlap', nationalities, categories, food, counter} );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
    try {
      const limitNumber = 20;
      const categories = await Category.find({}).limit(limitNumber);
      res.render('categories', { title: 'Gasztroblog - Kategóriák fogás szerint', categories } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
    try {
      let categoryId = req.params.id;
      const limitNumber = 20;
      const categoryById = await Recipe.find({ 'categoryByServing': categoryId }).limit(limitNumber);
      res.render('categories', { title: 'Gasztroblog - Kategóriák fogás szerint', categoryById } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

/**
 * GET /nationalities
 * Nationalities 
*/
exports.exploreNationalities = async(req, res) => {
  try {
    const limitNumber = 20;
    const nationalities = await Nationality.find({}).limit(limitNumber);
    res.render('nationalities', { title: 'Gasztroblog - Kategóriák nemzetiség szerint', nationalities } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

/**
* GET /nationalities/:id
* Nationalities By Id
*/
exports.exploreNationalitiesById = async(req, res) => { 
  try {
    let nationalityId = req.params.id;
    const limitNumber = 20;
    const nationalityById = await Recipe.find({ 'categoryByNationality': nationalityId }).limit(limitNumber);
    res.render('nationalities', { title: 'Gasztroblog - Kategóriák nemzetiség szerint', nationalityById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

/**
 * GET /recipe/:id
 * Recipe
 */
 exports.exploreRecipe = async(req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);

        // Storing the records from the Visitor table
        //let visitors = await Visitor.findOne({name: 'localhost'});

    // If the app is being visited first
    // time, so no records
    if(recipe == null) {
          
      // Creating a new default record
       const beginCount = new Recipe({
           count : 1
       })

      //Saving in the database
      beginCount.save()

      // Sending thee count of visitor to the browser
      //res.send(`<h2>Counter: `+1+'</h2>')

      // Logging when the app is visited first time
      console.log("First visitor on recipe arrived")
  }
  else{

      // Incrementing the count of visitor by 1
      recipe.count += 1;
      counter = recipe.count;
      
      // Saving to the database
      recipe.save()

      // Sending thee count of visitor to the browser
      //res.send(`<h2>Counter: `+visitors.count+'</h2>')

      // Logging the visitor count in the console
      console.log("visitor on recipe called "+ recipe.name +" changed: ",recipe.count)
  }
        db.collection('recipes').findOneAndUpdate({_id: ObjectId(recipeId)},
          [
            {
              $addFields: {
                //$set or $addFields
                ratingAvg: {
                  $avg: "$comments.rating"
                }
              }
            }
          ],
          {
            multi: true
          })

          rateee = recipe.ratingAvg;
          recipeComments = recipe.comments;

        res.render('recipe', {rateee: JSON.stringify(rateee), recipeComments: JSON.stringify(recipeComments) , title: 'Gasztroblog - ' + recipe.name, recipe, counter } );
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}



/**
 * POST /search
 * Search
 */
exports.searchRecipe = async(req, res) => {

    //searchTerm
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true} });
        res.render('search', { title: 'Gasztroblog - Keresés', recipe });
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

Recipe.collection.dropIndexes();



/**
 * GET /explore-latest
 * Explore Latest
 */
 exports.exploreLatest = async(req, res) => {
  try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Gasztroblog - Legfrisebb receptek', recipe } );
  } catch (error) {
      res.status(500).send({message: error.message || "Error Occured"});
  }
}


/**
 * GET /explore-bestavg
 * Explore Latest
 */
 exports.exploreBestavg = async(req, res) => {
  try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ ratingAvg: -1 }).limit(limitNumber);
      const recipesavg = await Recipe.find();
      recipeavg = recipesavg;
      res.render('explore-bestavg', {recipeavg: JSON.stringify(recipeavg), title: 'Gasztroblog - Legjobb értékelésű receptek', recipe } );
  } catch (error) {
      res.status(500).send({message: error.message || "Error Occured"});
  }
}


/**
 * GET /explore-random
 * Explore Random
 */
 exports.exploreRandom = async (req, res) => {
  try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Gasztroblog - Véletlenszerű recept', recipe } );
   } catch (error) {
      res.status(500).send({message: error.message || "Error Occured"});
  }
}

/**
 * GET /submit-recipe
 * Submit Recipe
 */
 exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Gasztroblog - Recept feltöltése', infoErrorsObj, infoSubmitObj  } );
  }


 /**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

      const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        servings: req.body.servings,
        quantity: req.body.quantity,
        ingredients: req.body.ingredients,
        categoryByServing: req.body.categoryByServing,
        categoryByNationality: req.body.categoryByNationality,
        image: newImageName,
        recipe_id: req.body.recipe_id,
        comments: req.body.comments,
        count: 0,
        likes: 0,
        ratingAvg: 0
      });

      
      
      await newRecipe.save();

      req.flash('infoSubmit', 'A receptet sikeresen feltöltötted!')
      console.log('Recipe has been added')
      res.redirect('/submit-recipe');

    } catch (error) {
      res.json(error);
      req.flash('infoErrors', error)
      res.redirect('/submit-recipe');
    }
   }

   /**
 * GET /send-recipe
 * Send Recipe
 */
//  exports.sendRecipe = async(req, res) => {
//   const infoErrorsObj = req.flash('infoErrors');
//   const infoSubmitObj = req.flash('infoSubmit');
//   res.render('send-recipe', { title: 'Gasztroblog - Recept beküldése', infoErrorsObj, infoSubmitObj  } );
//   }

   /**
 * POST /comment-recipe
 * Comment Recipe
*/
module.exports.CommentRecipeOnPost = async(req, res) => {
    let recipeId = req.params.id

    const comment = new Comment({
      username: req.body.username,
      comment: req.body.comment,
      date: req.body.date,
      rating: req.body.rating
    });

    comment.save((err, result) => {
      if (err){
        console.log(err)
      }else {
        Recipe.findById(req.params.id, (err, post) =>{
          if(err){
            console.log(err);
          }else{
            post.comments.push(result);
            post.save();
            console.log('====comments=====')
            console.log(post.comments);
            res.redirect('/recipe/' + recipeId);
          }
        })
      }
    })  
}

module.exports.LikesRecipeOnPost = async(req, res) => {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    if(recipe == null) {
          
       const beginLikes = new Recipe({
           likes : 1
       })

      //Saving in the database
      beginLikes.save()

      // Sending thee count of visitor to the browser
      //res.send(`<h2>Counter: `+1+'</h2>')

      // Logging when the app is visited first time
      console.log("First like is arrived")
  }
  else{

      // Incrementing the count of visitor by 1
      recipe.likes += 1;

      likecounter = recipe.likes;
      

      // Saving to the database
      recipe.save()

      // Sending thee count of visitor to the browser
      //res.send(`<h2>Counter: `+visitors.count+'</h2>')

      // Logging the visitor count in the console
      console.log("likes on recipe called "+ recipe.name +" liked: ",recipe.likes)
  }
  res.redirect('/recipe/' + recipeId);

}




// async function deleterecipe(){
//   try {
//     await Comment.deleteMany()
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// deleterecipe();



  // async function insertCategoryData(){
  //   try {
  //     await Category.insertMany([
  //       {
  //         "name": "Reggeli",
  //         "image": "english-breakfast.jpg"
  //       },
  //       {
  //         "name": "Ebéd",
  //         "image": "fishandchips.jpg"
  //       },
  //       {
  //         "name": "Vacsora",
  //         "image": "gulyas.jpg"
  //       },
  //       {
  //         "name": "Desszert",
  //         "image": "tiramisu.jpg"
  //       },
  //       {
  //         "name": "Levesek",
  //         "image": "edessavanyuleves.jpg"
  //       }
  //     ]);
  //   } catch (error) {
  //     console.log('err', + error)
  //   }
  // }

  // insertCategoryData();












   //    /**
   //  * GET /home
   //  */
   //     exports.goHome = (req, res) => { 
         
   //         res.render('findex', { title: 'Cooking Blog - Categoreis'} );
   //     }

   //      /**
   //  * GET /login
   //  */
   //       exports.adminOnGet = (req, res) => { 
           
   //             const response = {
   //                title: "Login",
   //                error: req.query.error
   //             }
   //            res.render('login', response);
   //        }

      
   //      /**
   //  * POST /login
   //  */
   //       exports.adminOnPost = (req, res) => {
   //          passport.authenticate('local', {
   //             successRedirect: '/home',
   //             failureRedirect: '/login?error=true'
   //          })
   //        }


   //     /**
   //  * GET /logout
   //  */
   //      exports.logoutOnGet = (req, res) => { 
   //          req.logout();
   //          res.redirect('/home');
   //     }

   //    /**
   //  * GET /setup
   //  */
   //     exports.setupOnGet = async(req, res) => { 
            
   //          const exists = await User.exists({ username: "admin" });
   //          if (exists) {
   //             res.redirect('/login');
   //             return;
   //          };

   //          bcrypt.genSalt(10, function (err, salt) {
   //             if (err) return next(err);
   //             bcrypt.hash("pass", salt, function (err, hash) {
   //                if (err) return next(err);

   //                const newAdmin = new User({
   //                username: "admin",
   //                password: hash
   //                });

   //                newAdmin.save();

   //                res.redirect('/login');
   //             });
   //          });
   //     }















      // Recipe.collection("recipes").update({ "_id": ObjectId (req.body.recipe_id)}, {
      //   $push: {
      //     "comments": {username: req.body.username, comment: req.body.comment}
      //   }
      // });

      // const newComment = new Comment({
      //   username: req.body.username,
      //   comment: req.body.comment,
      //   recipe: req.params.recipe_id,
      //   recipe_id: req.body.recipe_id
      // });

      // newComment.save().then(result => {
      //   Comment
      //   .populate(newComment, { path: "username" })
      //   .then(comment => {
      //     res.json({
      //       message: "Comment added",
      //       comment
      //     });
      //   })
      // })

      // newComment.save(function(err){
      //   if (err) res.send(err);
      //   Recipe.findById(req.params.recipe_id, function(err, recipe){
      //     if (err) return res.send(err);
      //     Recipe.findOne({name: 'ez lesz jo'}).populate(comments).exec(function (err, person) {
      //       if (err) return handleError(err);
      //       console.log(person);
      //     })
      //     recipe.save(function(err) {
      //       if (err) return res.send(err);
      //       res.json({status:'done'});
      //     });
      //   });
      // });

      // await newComment.save();

      // req.flash('infoSubmit', 'Comment has been added')
      // res.redirect('/comment-recipe');
   


//    const register = (req, res, next) => {
//     bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
//         if (err) {
//             res.json({
//                 error: err
//             })
//         }
//         let user = new User ({
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPass
//         })
//         user.save()
//         .then(user => {
//             res.json({
//                 message: 'User added succesfully!'
//             })
//         })
//         .catch(error => {
//             res.json({
//                 message: 'An error occured!'
//             })
//         })
//     })
// }

// module.exports = {
//     register
// }

// exports.register = async(req, res, next) => {
//   bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
//       if (err) {
//           res.json({
//               error: err
//           })
//       }
//       let user = new User ({
//           username: req.body.username,
//           email: req.body.email,
//           password: hashedPass
//       })
//       user.save()
//       .then(user => {
//           res.json({
//               message: 'User added succesfully!'
//           })
//       })
//       .catch(error => {
//           res.json({
//               message: 'An error occured!'
//           })
//       })
//   })
// }

// exports.registerGET = async(req, res) => {
//   try {
//     let recipeId = req.params.id;
//     const recipe = await Recipe.findById(recipeId);
//     res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
//   } catch (error) {
//     res.status(500).send({message: error.message || "Error Occured"});
//   }
// }
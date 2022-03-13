const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App Routes 
*/
router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe );
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.get('/categories', recipeController.exploreCategories);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-bestavg', recipeController.exploreBestavg);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.post('/recipe/:id/comments', recipeController.CommentRecipeOnPost);
router.get('/send-recipe', recipeController.sendRecipe);
router.post('/recipe/:id/likes', recipeController.LikesRecipeOnPost);
router.get('/nationalities/:id', recipeController.exploreNationalitiesById);
router.get('/nationalities', recipeController.exploreNationalities);
//router.get('/home', recipeController.goHome);
//router.post('/register', recipeController.register)
//router.post('/register', recipeController.register);
//router.get('/register', recipeController.registerGET);
//router.get('/home', recipeController.goHome);
//router.get('/login', recipeController.adminOnGet);
//router.post('/login', recipeController.adminOnPost);
//router.get('/login', recipeController.adminOnGet);
//router.get('/setup', recipeController.setupOnGet);
//router.get('/logout', recipeController.logoutOnGet);



module.exports = router;


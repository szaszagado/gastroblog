// let addIngredientsBtn = document.getElementById('addIngredientsBtn');
// let ingredientList = document.querySelector('.ingredientList');
// let ingredeintDiv = document.querySelectorAll('.ingredeintDiv')[0];
// let removeIngredientsBtn = document.getElementById('removeIngredientsBtn');

// addIngredientsBtn.addEventListener('click', function(){
//   let newIngredients = ingredeintDiv.cloneNode(true);
//   let input = newIngredients.getElementsByTagName('input')[0];
//   input.value = '';
//   ingredientList.appendChild(newIngredients);
// });

// removeIngredientsBtn.addEventListener('click', function(){

//   ingredientList.removeChild(newIngredients);

// });
// // document.getElementById("addIngredientsBtn").onclick = function (){
// //   var temp = document.getElementById("child_div").outerHTML;
// //   document.getElementById("parent_div").innerHTML = document.getElementById("parent_div").innerHTML + temp;
// //   }

// var survey_options = document.getElementById('survey_options');
// var add_more_fields = document.getElementById('add_more_fields');
// var remove_fields = document.getElementById('remove_fields');


// remove_fields.onclick = function(){
//   var input_tags = survey_options.getElementsByTagName('input');
//   if(input_tags.length > 2) {
//     survey_options.removeChild(input_tags[(input_tags.length) - 1]);
//   }
// }
let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredeintDiv = document.querySelectorAll('.ingredeintDiv')[0];

addIngredientsBtn.addEventListener('click', function(){
  let newIngredients = ingredeintDiv.cloneNode(true);
  let input = newIngredients.getElementsByTagName('input')[0];
  input.value = '';
  ingredientList.appendChild(newIngredients);
});

// document.getElementById("addIngredientsBtn").onclick = function (){
//   var temp = document.getElementById("child_div").outerHTML;
//   document.getElementById("parent_div").innerHTML = document.getElementById("parent_div").innerHTML + temp;
//   }
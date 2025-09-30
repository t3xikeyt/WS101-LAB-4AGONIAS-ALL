// recipes.js
const recipes = [
  {
    title: "Spaghetti Bolognese",
    ingredients: ["spaghetti", "tomato", "beef", "onion", "carrot"],
    category: "Dinner",
    cookingTime: 45,
  },
  {
    title: "Pancakes",
    ingredients: ["flour", "egg", "milk", "butter"],
    category: "Breakfast",
    cookingTime: 20,
  },
  {
    title: "Caesar Salad",
    ingredients: ["lettuce", "croutons", "cheese", "chicken"],
    category: "Lunch",
    cookingTime: 15,
  },
  {
    title: "Slow Cooker Chili",
    ingredients: ["beans", "beef", "tomato", "chili powder"],
    category: "Dinner",
    cookingTime: 180,
  },
];

// Count total recipes
function countRecipes(recipes) {
  return recipes.length;
}

// Filter recipes by category
function filterByCategory(recipes, category) {
  return recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
}

// Find the recipe with the longest cooking time
function findLongestCookingRecipe(recipes) {
  if (recipes.length === 0) return null;
  return recipes.reduce((max, r) => (r.cookingTime > max.cookingTime ? r : max), recipes[0]);
}

// Group recipes by cooking time ranges
// quick: <= 30 mins, medium: 31 to 90 mins, long: > 90 mins
function groupByCookingTime(recipes) {
  const grouped = { quick: [], medium: [], long: [] };
  recipes.forEach(r => {
    if (r.cookingTime <= 30) grouped.quick.push(r);
    else if (r.cookingTime <= 90) grouped.medium.push(r);
    else grouped.long.push(r);
  });
  return grouped;
}

// Simulate fetching new recipes asynchronously
function fetchNewRecipes() {
  return new Promise(resolve => {
    setTimeout(() => {
      const newRecipes = [
        {
          title: "Avocado Toast",
          ingredients: ["bread", "avocado", "lemon", "salt"],
          category: "Breakfast",
          cookingTime: 10,
        },
        {
          title: "Grilled Cheese Sandwich",
          ingredients: ["bread", "cheese", "butter"],
          category: "Lunch",
          cookingTime: 15,
        },
      ];
      resolve(newRecipes);
    }, 1500);
  });
}

(async () => {
  const output = document.getElementById("recipes-output");

  output.innerHTML += <p>Total recipes: ${countRecipes(recipes)}</p>;

  output.innerHTML += <p>Dinner recipes: ${filterByCategory(recipes, "Dinner").map(r => r.title).join(", ")}</p>;

  const longest = findLongestCookingRecipe(recipes);
  output.innerHTML += <p>Longest cooking recipe: ${longest.title} (${longest.cookingTime} mins)</p>;

  const grouped = groupByCookingTime(recipes);
  output.innerHTML += <p>Quick recipes: ${grouped.quick.map(r => r.title).join(", ")}</p>;
  output.innerHTML += <p>Medium recipes: ${grouped.medium.map(r => r.title).join(", ")}</p>;
  output.innerHTML += <p>Long recipes: ${grouped.long.map(r => r.title).join(", ")}</p>;

  const newRecipes = await fetchNewRecipes();
  output.innerHTML += <p>New recipes fetched asynchronously:</p>;
  output.innerHTML += <ul>${newRecipes.map(r => `<li>${r.title} (${r.cookingTime} mins)</li>).join("")}</ul>`;
})();

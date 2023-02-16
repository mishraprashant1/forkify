import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
  module.hot.accept();
}

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1. Render Spinner
    recipeView.renderSpinner();

    // 2. Fetch recipe
    await model.loadRecipe(id);

    // 3. Render Recipe
    recipeView.render(model.state.recipe);

    // 4. Add Servings Handler
    recipeView.addHandlerServings(controlServings);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
    paginationView.addHandlerPage(controlPagination);
  } catch (err) {
    throw err;
  }
};

const controlPagination = async function (e) {
  const btn = e.target.closest('.btn--inline');
  const toPage = btn.dataset.page;
  resultsView.render(model.getSearchResultsPage(Number(toPage)));
  paginationView.render(model.state.search);
  paginationView.addHandlerPage(controlPagination);
};

const controlServings = function (e) {
  if (e.classList.contains('btn--increase-servings')) {
    model.changeServings(model.state.recipe.servings + 1);
  } else {
    model.changeServings(model.state.recipe.servings - 1);
  }

  recipeView.renderIngredients(
    model.state.recipe.ingredients,
    model.state.recipe.servings
  );
};

function init() {
  recipeView.addHandlerRender(showRecipe);
  searchView.addHandlerSearch(controlSearchResults);
}
init();

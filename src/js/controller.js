import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView';
import addRecipeView from './views/addRecipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import { MODAL_CLOSE_SEC } from './config.js';

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

    // 1.5 Update the search results and select the active recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 2. Fetch recipe
    await model.loadRecipe(id);

    // 3. Render Recipe
    recipeView.render(model.state.recipe);

    // 4. Add Servings Handler
    // recipeView.addHandlerServings(controlServings);
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

const controlServings = function (newServings) {
  // Update Servings
  model.changeServings(newServings);

  // Update View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.bookmarks);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerUpdateServings(controlServings);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();

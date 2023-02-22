import icons from '../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './view';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'No recipes found for your query. Please try again!';
  _message = '';

  _generateMarkup() {
    const recipe = this._data;
    const markup = `
    <figure class="recipe__fig">
          <img src="${recipe.imageUrl}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          
          ${this._generateAllIngredientsMarkup(recipe.ingredients)}
            
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
    return markup;
  }

  renderIngredients(ingredients, servings) {
    const ingredients_list = this._parentElement.querySelector(
      '.recipe__ingredient-list'
    );
    ingredients_list.innerHTML = '';
    const markup = this._generateAllIngredientsMarkup(ingredients);
    ingredients_list.innerHTML = markup;
    this._renderServings(servings);
  }

  _renderServings(servings) {
    this._parentElement.querySelector('.recipe__info-data--people').innerHTML =
      servings;
  }

  _generateAllIngredientsMarkup(ingredients) {
    return ingredients.map(this._generateIngredientMarkup).join('');
  }

  _generateIngredientMarkup(ing) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? new Fraction(ing.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>
      `;
  }

  addHandlerRender(handler) {
    ['load', 'hashchange'].forEach(el => window.addEventListener(el, handler));
  }

  addHandlerServings(handler) {
    this._parentElement.querySelectorAll('.btn--tiny').forEach(el => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        handler(el);
      });
    });
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      console.log(btn);
      const updateTo = +btn.dataset.updateTo;
      handler(updateTo);
    });
  }
}

export default new RecipeView();

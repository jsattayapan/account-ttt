const { makePostRequest, makeGetRequest } = require('./../../function-helpers')


export const saveNewRecipe = (data, callback) => {
  makePostRequest('kitchen/saveNewRecipe', data, res => callback(res))
}



export const getRecipes = (callback) => {
  makeGetRequest('kitchen/getRecipes', res => callback(res))
}

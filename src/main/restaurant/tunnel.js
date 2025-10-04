const { makePostRequest, makeGetRequest } = require('./../../function-helpers')

export const restaurantGetDailyShift = (data, callback) => {
  makePostRequest('restaurant/getDailyShift', data, res => {
    setTimeout(() => {
      callback(res)
    }, 500)
  })
}


export const getStockItems = (callback) => {
  makeGetRequest('stock/getItems', res => callback(res))
}

/////


export const getNoneRecipeMenuItems = (callback) => {
  makeGetRequest('restaurant/getNoneRecipeMenuItems', res => callback(res))
}


export const deleteRecipe = (data, callback) => {
  makePostRequest('restaurant/deleteRecipe', data, res => callback(res))
}


export const deleteIngredientFromRecipe = (data, callback) => {
  makePostRequest('restaurant/deleteIngredientFromRecipe', data, res => callback(res))
}

export const submitIngredientToRecipe = (data, callback) => {
  makePostRequest('restaurant/submitIngredientToRecipe', data, res => callback(res))
}

export const getRecipes = (callback) => {
  makeGetRequest('restaurant/getRecipes', res => callback(res))
}

export const submitNewRecipe = (data, callback) => {
  makePostRequest('restaurant/submitNewRecipe', data, res => callback(res))
}
export const getRecipe = (data, callback) => {
  makePostRequest('restaurant/getRecipe', data, res => callback(res))
}


export const getReportByMonth = (data, callback) => {
  makePostRequest('restaurant/getReportByMonth', data, res => callback(res))
}

export const setPrinterByItemId = (data, callback) => {
  makePostRequest('restaurant/setPrinterByItemId', data, res => callback(res))
}

export const editMenuMeat = (data, callback) => {
  makePostRequest('restaurant/editMenuMeat', data, res => callback(res))
}

export const getVip = (callback) => {
  makeGetRequest('restaurant/getVip', res => callback(res))
}

export const getCustomerTablesByDate = (data, callback) => {
  makePostRequest('restaurant/getCustomerTablesByDate', data, res => callback(res))
}

export const getVipByTable = (data, callback) => {
  makePostRequest('restaurant/getVipByTable', data, res => callback(res))
}

export const getStaffsSaleDaily = (callback) => {
  makeGetRequest('restaurant/getStaffsSaleDaily', res => callback(res))
}

export const getCurrentReport = (callback) => {
  makeGetRequest('restaurant/getCurrentReport', res => callback(res))
}

export const getStaffsSaleByMonth = (data, callback) => {
  makePostRequest('restaurant/getStaffsSaleByMonth', data, res => callback(res))
}

export const getCustomerTablesById = (data, callback) => {
  makePostRequest('restaurant/getCustomerTablesById', data, res => callback(res))
}

export const getSoldItemsByDate = (data, callback) => {
  makePostRequest('restaurant/getSoldItemsByDate', data, res => callback(res))
}

export const getSoldItemsByMonth = (data, callback) => {
  makePostRequest('restaurant/getSoldItemsByMonth', data, res => callback(res))
}

export const getItems = (callback) => {
  makeGetRequest('restaurant/getItems', res => callback(res))
}

export const updateMenuItemStatus = (data, callback) => {
  makePostRequest('restaurant/updateMenuItemStatus', data, res => callback(res))
}

export const sumitNewPosUser = (data, callback) => {
  makePostRequest('restaurant/sumitNewPosUser', data, res => callback(res))
}

export const getPosUser = (callback) => {
  makeGetRequest('restaurant/getPosUser', res => callback(res))
}


export const sumitNewMenuItem = (data, callback) => {
  makePostRequest('restaurant/sumitNewMenuItem', data, res => callback(res))
}

export const updateItemPrice = (data, callback) => {
  makePostRequest('restaurant/updateItemPrice', data, res => callback(res))
}


export const updateItemStaffPrice = (data, callback) => {
  makePostRequest('restaurant/updateItemStaffPrice', data, res => callback(res))
}

export const getPrinterList = (callback) => {
  makeGetRequest('restaurant/getPrinterList', res => callback(res))
}

export const getCategoryList = (callback) => {
  makeGetRequest('restaurant/getCategoryList', res => callback(res))
}

export const getMenuPromotions = (callback) => {
  makeGetRequest('restaurant/getMenuPromotions', res => callback(res))
}


export const movePromotionOrder = (data, callback) => {
  makePostRequest('restaurant/movePromotionOrder', data, res => callback(res))
}


export const removePromotionOnServer = (data, callback) => {
  makePostRequest('restaurant/removePromotionOnServer', data, res => callback(res))
}

export const updatePromotionVisibleOnsServer = (data, callback) => {
  makePostRequest('restaurant/updatePromotionVisibleOnsServer', data, res => callback(res))
}

export const uploadPromotionImage = (data, callback) => {
  const formData = new FormData();
    formData.append('title', data.title);
      formData.append('imageFile', data.file);
  makePostRequest('restaurant/uploadPromotionImage', formData, res => callback(res))
}


export const uploadImageUrlToServer = (data, callback) => {
  const formData = new FormData();
      formData.append('code', data.code);
      formData.append('imageFile', data.file);
  makePostRequest('restaurant/uploadImageUrlToServer', formData, res => callback(res))
}

const { makePostRequest, makeGetRequest } = require('./../../function-helpers')

export const test = (data, callback) => {
  makePostRequest('boss/test', data, res => callback(res))
}


export const getEmployeeSectionByWeekNumber = (data, callback) => {
  makePostRequest('boss/getEmployeeSectionByWeekNumber', data, res => callback(res))
}


export const getExpenseSectionByWeekNumber = (data, callback) => {
  makePostRequest('boss/getExpenseSectionByWeekNumber', data, res => callback(res))
}

export const getPurchaseSectionByWeekNumber = (data, callback) => {
  makePostRequest('boss/getPurchaseSectionByWeekNumber', data, res => callback(res))
}


export const deletePurchaseReceiptFile = (data, callback) => {
  makePostRequest('boss/deletePurchaseReceiptFile', data, res => callback(res))
}


export const deleteMaintenanceById = (data, callback) => {
  makePostRequest('boss/deleteMaintenanceById', data, res => callback(res))
}


export const deletePurchaseApprovelFile = (data, callback) => {
  makePostRequest('boss/deletePurchaseApprovelFile', data, res => callback(res))
}

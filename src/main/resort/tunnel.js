const { makePostRequest, makeGetRequest } = require('./../../function-helpers')

export const getSevenDays = (data, callback) => {
  makePostRequest('resort/getSevenDays', data, res => callback(res))
}
export const insertReport = (data, callback) => {
  makePostRequest('resort/insertReport', data, res => callback(res))
}

export const getTotalGraph = (callback) => {
  makeGetRequest('resort/getTotalGraph', res => callback(res))
}

export const createBooking = (data, callback) => {
  makePostRequest('resort/lazy-hotel/createBooking', data, res => callback(res))
}

export const addNewCompany = (data, callback) => {
  makePostRequest('resort/addNewCompany', data, res => callback(res))
}

export const getCompanyList = (callback) => {
  makeGetRequest('resort/getCompanyList', res => callback(res))
}

export const notifyNewDirectBooking = (data, callback) => {
  makePostRequest('resort/notifyNewDirectBooking', data, res => callback(res))
}

export const createQuotation = (data, callback) => {
  makePostRequest('resort/createQuotation', data, res => callback(res))
}

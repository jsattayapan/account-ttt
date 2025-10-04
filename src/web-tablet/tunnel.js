import {IP} from './constants'
import axios from 'axios'

function makePostRequest(route, data, callback){
  axios.post(`${IP}/${route}`, data).then(res => {
     callback(res.data)
  }).catch(e => {
    console.log(e);
    callback({status: false, msg: 'ไม่สามารถเชื่อมต่อ Server ได้'})
  })
}

function makeGetRequest(route, callback){
  axios.get(`${IP}/${route}`).then(res => {
     callback(res.data)
  }).catch(e => {
    console.log(e);
    callback({status: false, msg: 'ไม่สามารถเชื่อมต่อ Server ได้'})
  })
}

export const restaurantGetDailyShift = (data, callback) => {
  makePostRequest('restaurant/getDailyShift', data, res => {
    setTimeout(() => {
      callback(res)
    }, 500)
  })
}

export const getSoldItemsByDate = (data, callback) => {
  makePostRequest('restaurant/getSoldItemsByDate', data, res => callback(res))
}


export const getCancelOrderByDate = (data, callback) => {
  makePostRequest('restaurant/getCancelOrderByDate', data, res => callback(res))
}


export const getCustomerTablesByDate = (data, callback) => {
  makePostRequest('restaurant/getCustomerTablesByDate', data, res => callback(res))
}


export const getCustomerTablesById = (data, callback) => {
  makePostRequest('restaurant/getCustomerTablesById', data, res => callback(res))
}

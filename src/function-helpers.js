import axios from 'axios'
const { IP } = require('./constanst')

export function makePostRequest(route, data, callback){
  axios.post(`${IP}/${route}`, data).then(res => {
     callback(res.data)
  }).catch(e => {
    console.log(e);
    console.log(`${IP}/${route}`);
    callback({status: false, msg: 'ไม่สามารถเชื่อมต่อ Server ได้'})
  })
}

export function makeGetRequest(route, callback){
  axios.get(`${IP}/${route}`).then(res => {
     callback(res.data)
  }).catch(e => {
    console.log(e);
    callback({status: false, msg: 'ไม่สามารถเชื่อมต่อ Server ได้'})
  })
}


const { makePostRequest, makeGetRequest } = require('./../function-helpers')

const login = (data, callback) => {
  makePostRequest('login', {...data, service: 'tt-website',version:'1.0.0.1'}, res => callback(res))
}

export default {
  login
}

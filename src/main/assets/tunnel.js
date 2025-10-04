const { makePostRequest, makeGetRequest } = require('./../../function-helpers')

export const getVehicleList = (callback) => {
  makeGetRequest('assetsManager/getVehicleList', res => callback(res))
}

export const createNewVehicleTunnel = (data, callback) => {
  const { id, type, name, value, dateOfOwn, imageFile } = data
  const formData = new FormData();
  formData.append('id', id);
  formData.append('type', type);
  formData.append('name', name);
  formData.append('value', value);
  formData.append('dateOfOwn', dateOfOwn);
  formData.append('imageFile', imageFile);
  makePostRequest('assetsManager/createNewVehicle', formData, res => callback(res))
}


export const updateVehicleRegister = (data, callback) => {
  makePostRequest('assetsManager/updateVehicleRegister', data, res => callback(res))
}

export const getRegisterByVehicleId = (data, callback) => {
  makePostRequest('assetsManager/getRegisterByVehicleId', data, res => callback(res))
}

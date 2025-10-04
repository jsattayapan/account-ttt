const { makePostRequest, makeGetRequest } = require('./../function-helpers')

export const updateUserImage = (data, callback) => {
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('imageFile', data.image);
  makePostRequest('hr/updateUserImage', formData, res => callback(res))
}

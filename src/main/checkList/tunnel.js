const { makePostRequest, makeGetRequest } = require('./../../function-helpers')

export const createCheckList = (data, callback) => {
  makePostRequest('checkList/createCheckList', data, res => callback(res))
}

export const getCheckList = (callback) => {
  makeGetRequest('checkList/getCheckList', res => callback(res))
}


export const getRoomCheckListItems = (callback) => {
  makeGetRequest('checkList/getRoomCheckListItems', res => callback(res))
}


export const submitNewRoomCheckListItem = (data, callback) => {
  makePostRequest('checkList/submitNewRoomCheckListItem', data, res => callback(res))
}

export const getCheckListItemByCheckListId = (data, callback) => {
  makePostRequest('checkList/getCheckListItemByCheckListId', data, res => callback(res))
}


export const createCheckListItem = (data, callback) => {
  makePostRequest('checkList/createCheckListItem', data, res => callback(res))
}


export const getTodayCheckListRecordByCheckListId = (data, callback) => {
  makePostRequest('checkList/getTodayCheckListRecordByCheckListId', data, res => callback(res))
}

export const createNewRoomCheckList = (data, callback) => {
  makePostRequest('checkList/createNewRoomCheckList', data, res => callback(res))
}


export const getCheckListByRoomId = (data, callback) => {
  makePostRequest('checkList/getCheckListByRoomId', data, res => callback(res))
}


export const getRoomCheckListRecordFailByRoomId = (data, callback) => {
  makePostRequest('checkList/getRoomCheckListRecordFailByRoomId', data, res => callback(res))
}


export const getRoomCheckListRecordByCheckListId = (data, callback) => {
  console.log('Tunnel');
  makePostRequest('checkList/getRoomCheckListRecordByCheckListId', data, res => callback(res))
}


export const createCheckListRecord = (data, callback) => {
  if(data.fileObject !== null){
    const formData = new FormData();
    formData.append('round', data.round);
    formData.append('createBy', data.createBy);
    formData.append('checkListItemId', data.checkListItemId);
    formData.append('isPass', data.isPass);
    formData.append('remark', data.remark);
    formData.append('imageFile', data.fileObject.file);
    makePostRequest('checkList/createCheckListRecordWithImage', formData, res => callback(res))
  }else{
    makePostRequest('checkList/createCheckListRecord', data, res => callback(res))
  }
}


export const createRoomCheckListRecord = (data, callback) => {
  if(data.fileObject !== null){
    const formData = new FormData();
    formData.append('createBy', data.createBy);
    formData.append('checkListId', data.checkListId);
    formData.append('itemId', data.itemId);
    formData.append('isPass', data.isPass);
    formData.append('remark', data.remark);
    formData.append('reportToEngineer', data.reportToEngineer);
    formData.append('imageFile', data.fileObject.file);
    makePostRequest('checkList/createRoomCheckListRecordWithImage', formData, res => callback(res))
  }else{
    makePostRequest('checkList/createRoomCheckListRecord', data, res => callback(res))
  }
}

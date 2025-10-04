const { makePostRequest, makeGetRequest } = require('./../../function-helpers')

export const getEmployeeByDepartmentId = (data, callback) => {
  makePostRequest('deptManager/getEmployeeByDepartmentId', data, res => callback(res))
}

export const getEmployeeTimetableOneWeekByDepartmentId = (data, callback) => {
  makePostRequest('deptManager/getEmployeeTimetableOneWeekByDepartmentId', data, res => callback(res))
}

export const submitEmployeeTimetable = (data, callback) => {
  makePostRequest('deptManager/submitEmployeeTimetable', data, res => callback(res))
}

export const insertMutipleEmployeeTimetable = (data, callback) => {
  makePostRequest('deptManager/insertMutipleEmployeeTimetable', data, res => callback(res))
}

export const deleteEmployeeTimetable = (data, callback) => {
  makePostRequest('deptManager/deleteEmployeeTimetable', data, res => callback(res))
}

// Stock Management For Department
export const submitEquipment = (data, callback) => {
  makePostRequest('deptManager/submitEquipment', data, res => callback(res))
}

export const getEquipmentByStoreId = (data, callback) => {
  makePostRequest('store/getEquipmentByStoreId', data, res => callback(res))
}

export const updateEquipmentStatus = (data, callback) => {
  makePostRequest('store/updateEquipmentStatus', data, res => callback(res))
}

export const getMenuItem = (callback) => {
  makeGetRequest('store/getMenuItem', res => callback(res))
}

export const submitNewAutoIngredient = (data, callback) => {
  makePostRequest('store/submitNewAutoIngredient', data, res => callback(res))
}

export const getAutoStockTransferToMenuByStoreId = (data, callback) => {
  makePostRequest('store/getAutoStockTransferToMenuByStoreId', data, res => callback(res))
}

export const submitAutoTranfer = (data, callback) => {
  makePostRequest('store/submitAutoTranfer', data, res => callback(res))
}

export const uploadEquipmentImage = (data, callback) => {
  const formData = new FormData();
  formData.append('equipmentId', data.equipmentId);
  formData.append('imageFile', data.imageFile);
  formData.append('storeId', data.storeId);

  makePostRequest('store/uploadEquipmentImage', formData, res => callback(res))
}

export const getStockItemByStoreId = (data, callback) => {
  makePostRequest('stock/getStockItemByStoreId', data, res => callback(res))
}

export const sumitUsedStock = (data, callback) => {
  makePostRequest('stock/sumitUsedStock', data, res => callback(res))
}

// EngineerJobsManagement
export const getBuildingsAndProperties = (callback) => {
  makeGetRequest('engineer/getBuildingsAndProperties', res => callback(res))
}

export const submitNewBuilding = (data, callback) => {
  makePostRequest('engineer/submitNewBuilding', data, res => callback(res))
}

export const submitNewProperty = (data, callback) => {
  makePostRequest('engineer/submitNewProperty', data, res => callback(res))
}

 export const submitNewJob = (data, callback) => {
   makePostRequest('engineer/submitNewJob', data, res => callback(res))
 }

  export const submitNewJobWithImages = (data, callback) => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('detail', data.detail);
    formData.append('location', data.location);
    formData.append('buildingId', data.buildingId);

    for (let i = 0 ; i < data.roomList.length ; i++) {
    formData.append("roomList", JSON.stringify(data.roomList[i]));
  }

    formData.append('createBy', data.createBy);

    for (let i = 0 ; i < data.imageList.length ; i++) {
    formData.append("imageList", data.imageList[i]);
}
    makePostRequest('engineer/submitNewJobWithImages', formData, res => callback(res))
  }

 export const getJobs = (callback) => {
   makeGetRequest('engineer/getJobs', res => callback(res))
 }

export const getJobDetailById = (data, callback) => {
  makePostRequest('engineer/getJobDetailById', data, res => callback(res))
}


export const sumbitItemsToEngineerJob = (data, callback) => {
  makePostRequest('engineer/sumbitItemsToEngineerJob', data, res => callback(res))
}

export const getEngineerInventory = (callback) => {
  makeGetRequest('engineer/getEngineerInventory', res => callback(res))
}

export const updateJobStatus = (data, callback) => {
  makePostRequest('engineer/updateJobStatus', data, res => callback(res))
}

export const getWorkerOnJob = (data, callback) => {
  makePostRequest('engineer/getWorkerOnJob', data, res => callback(res))
}

export const submitAddWorkerToJob = (data, callback) => {
  makePostRequest('engineer/submitAddWorkerToJob', data, res => callback(res))
}

export const submitJopReport = (data, callback) => {
  makePostRequest('engineer/submitJopReport', data, res => callback(res))
}

export const submitImagesToJob = (data, callback) => {
  const formData = new FormData();
  formData.append('jobId', data.jobId);
  formData.append('createBy', data.employeeId);

  for (let i = 0 ; i < data.imageList.length ; i++) {
  formData.append("imageList", data.imageList[i]);
}
  makePostRequest('engineer/submitImagesToJob', formData, res => callback(res))
}


// Kitchen Manager
export const getKitchenStock = callback => {
  makeGetRequest('kitchen/getKitchenStock', res => callback(res))
}

export const sumitNewIngredient = (data, callback) => {
  makePostRequest('kitchen/sumitNewIngredient', data, res => callback(res))
}

export const getIngredient = callback => {
  makeGetRequest('kitchen/getIngredient', res => callback(res))
}

export const submitPrepareIngredient = (data, callback) => {
  makePostRequest('kitchen/submitPrepareIngredient', data, res => callback(res))
}

export const submitStaffFood = (data, callback) => {
  makePostRequest('kitchen/submitStaffFood', data, res => callback(res))
}


export const submitKitchenTransfer = (data, callback) => {
  makePostRequest('kitchen/submitKitchenTransfer', data, res => callback(res))
}

export const getIngredientByStoreId = (data, callback) => {
  makePostRequest('kitchen/getIngredientByStoreId', data, res => callback(res))
}

const { makePostRequest, makeGetRequest } = require('./../../function-helpers')


export const submitDocument = (data, callback) => {
  const formData = new FormData();
  formData.append('employeeId', data.employeeId);
  formData.append('name', data.filename);
  formData.append('imageFile', data.file);
  makePostRequest('hr/submitDocument', formData, res => callback(res))
}

export const addScheduleUpdateSalary = (data, callback) => {
  makePostRequest('hr/addScheduleUpdateSalary', data, res => callback(res))
}

export const cancelEmployeeLeaveByPayroll = (data, callback) => {
  makePostRequest('hr/cancelEmployeeLeaveByPayroll', data, res => callback(res))
}

export const getEmployeeListForPayroll = (data, callback) => {
  makePostRequest('hr/getEmployeeListForPayroll', data, res => callback(res))
}

export const submitEmployeeTimetable = (data, callback) => {
  makePostRequest('deptManager/submitEmployeeTimetable', data, res => callback(res))
}

export const submitLeaveByPayroll = (data, callback) => {
  makePostRequest('hr/submitLeaveByPayroll', data, res => callback(res))
}

export const submitemployeeDayOff = (data, callback) => {
  makePostRequest('deptManager/submitemployeeDayOff', data, res => callback(res))
}
export const getEmployeeSalaryReceipt = (data, callback) => {
  makePostRequest('hr/getEmployeeSalaryReceipt', data, res => callback(res))
}


export const insertOTByPayroll = (data, callback) => {
  makePostRequest('hr/insertOTByPayroll', data, res => callback(res))
}

export const deleteEmployeeTimetable = (data, callback) => {
  makePostRequest('deptManager/deleteEmployeeTimetable', data, res => callback(res))
}

export const getEmployeeListForHr = (data, callback) => {
  makePostRequest('hr/getEmployeeListForHr', data, res => callback(res))
}

export const updateEmployeeAttribute = (data, callback) => {
  makePostRequest('hr/updateEmployeeAttribute', data, res => callback(res))
}

export const resignEmployee = (data, callback) => {
  makePostRequest('hr/resignEmployee', data, res => callback(res))
}

export const getEmployeeDocumentById = (data, callback) => {
  makePostRequest('hr/getEmployeeDocumentById', data, res => callback(res))
}

export const getSalarySummary = (data, callback) => {
  makePostRequest('hr/getSalarySummary', data, res => callback(res))
}

export const getPositions = (callback) => {
  makeGetRequest('hr/getPositions', res => callback(res))
}




export const uploadStaffFingerScanFile = (data, callback) => {
  makePostRequest('hr/uploadStaffFingerScanFile', data, res => callback(res))
}


export const submitProbationResult = (data, callback) => {
  makePostRequest('hr/submitProbationResult', data, res => callback(res))
}

export const getPositionDocuments = (callback) => {
  makeGetRequest('hr/getPositionDocuments', res => callback(res))
}

export const submitPositionDocument = (data, callback) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('imageFile', data.file);
  makePostRequest('hr/submitPositionDocument', formData, res => callback(res))
}

export const getNotQualifyTimetableByMonth = (data, callback) => {
  makePostRequest('hr/getNotQualifyTimetableByMonth', data, res => callback(res))
}

export const deleteFingerScanTimeByDate = (data, callback) => {
  makePostRequest('hr/deleteFingerScanTimeByDate', data, res => callback(res))
}

export const submitEmpFile = (data, callback) => {
  makePostRequest('hr/submitEmpFile', data, res => callback(res))
}

export const getSevenDayTimescan = (data, callback) => {
  makePostRequest('hr/getSevenDayTimescan', data, res => callback(res))
}


export const clearSalary = (data, callback) => {
  makePostRequest('hr/clearSalary', data, res => callback(res))
}

export const resetLineIdByEmployeeId = (data, callback) => {
  makePostRequest('hr/resetLineIdByEmployeeId', data, res => callback(res))
}


export const deleteAllFingerPrintByEmployeeId = (data, callback) => {
  makePostRequest('hr/deleteAllFingerPrintByEmployeeId', data, res => callback(res))
}

export const activateEmployee = (data, callback) => {
  makePostRequest('hr/activateEmployee', data, res => callback(res))
}

export const getEmployeeList = (callback) => {
  makeGetRequest('hr/getEmployeeList', res => callback(res))
}

export const submitDescription = (data, callback) => {
  makePostRequest('hr/submitDescription', data, res => callback(res))
}

export const submitDuties = (data, callback) => {
  makePostRequest('hr/submitDuties', data, res => callback(res))
}

export const updateEmployeeImage = (data, callback) => {
  const formData = new FormData();
  formData.append('id', data.id);
  formData.append('imageFile', data.image);
  makePostRequest('hr/updateEmployeeImage', formData, res => callback(res))
}

export const submitEditSalary = (data, callback) => {
  makePostRequest('hr/submitEditSalary', data, res => callback(res))
}
export const getSalaryByEmployeeId = (data, callback) => {
  makePostRequest('hr/getSalaryByEmployeeId', data, res => callback(res))
}

export const getEmployeeAccountById = (data, callback) => {
  makePostRequest('hr/getEmployeeAccountById', data, res => callback(res))
}

export const submitEmployeeAccount = (data, callback) => {
  makePostRequest('hr/submitEmployeeAccount', data, res => callback(res))
}

export const submitWarning = (data, callback) => {
  makePostRequest('hr/submitWarning', data, res => callback(res))
}

export const getWarningById = (data, callback) => {
  makePostRequest('hr/getWarningById', data, res => callback(res))
}

export const submitLeave = (data, callback) => {
  makePostRequest('hr/submitLeave', data, res => callback(res))
}
export const getChecklistLinkList = (callback) => {
  makeGetRequest('hr/getChecklistLinkList', res => callback(res))
}
export const getChecklistHistrory = (callback) => {
  makeGetRequest('hr/getChecklistHistrory', res => callback(res))
}


export const createLinkChecklistEmployee = (data, callback) => {
  makePostRequest('hr/createLinkChecklistEmployee', data, res => callback(res))
}


export const getLeaveById = (data, callback) => {
  makePostRequest('hr/getLeaveById', data, res => callback(res))
}
export const getDepartments = (callback) => {
  makeGetRequest('hr/getDepartments', res => callback(res))
}
export const getChecklistList = (callback) => {
  makeGetRequest('hr/getChecklistList', res => callback(res))
}

export const getEmployeeChecklistLink = (data, callback) => {
  makePostRequest('hr/getEmployeeChecklistLink', data, res => callback(res))
}

export const createNewChecklist = (data, callback) => {
  makePostRequest('hr/createNewChecklist', data, res => callback(res))
}

export const getChecklistItemByChecklistId = (data, callback) => {
  makePostRequest('hr/getChecklistItemByChecklistId', data, res => callback(res))
}

export const uploadChecklistAnswer = (data, callback) => {
  makePostRequest('hr/uploadChecklistAnswer', data, res => callback(res))
}

export const getAnswerByRecordId = (data, callback) => {
  makePostRequest('hr/getAnswerByRecordId', data, res => callback(res))
}



export const getChecklistRecordListByEmployee = (data, callback) => {
  makePostRequest('hr/getChecklistRecordListByEmployee', data, res => callback(res))
}





export const submitChecklistRecord = (data, callback) => {
    const formData = new FormData();
  formData.append('linkId', data.linkId);
    formData.append('createBy', data.createBy);
    formData.append('inspectBy', data.inspectBy);
    formData.append('checklistId', data.checklistId);
    formData.append('points', data.points);
    formData.append('maxPoint', data.maxPoint);
  formData.append('file', data.file);
  makePostRequest('hr/createChecklistLinkRecord', formData, res => callback(res))
}


export const addNewChecklistItem = (data, callback) => {
  makePostRequest('hr/addNewChecklistItem', data, res => callback(res))
}
export const insertDocumentPositionLink = (data, callback) => {
  makePostRequest('hr/insertDocumentPositionLink', data, res => callback(res))
}
export const updateEmployeePosition = (data, callback) => {
  makePostRequest('hr/updateEmployeePosition', data, res => callback(res))
}

export const getTimetableByEmployeeId = (data, callback) => {
  makePostRequest('hr/getTimetableByEmployeeId', data, res => callback(res))
}

export const setEmployeeFingerId = (data, callback) => {
  makePostRequest('hr/setEmployeeFingerId', data, res => callback(res))
}

export const getEmployeeTimetableByDate = (data, callback) => {
  makePostRequest('hr/getEmployeeTimetableByDate', data, res => callback(res))
}

export const submitNewEmployee = (data, callback) => {
  makePostRequest('hr/submitNewEmployee', data, res => callback(res))
}

export const getStaffTimetableByDate = (data, callback) => {
  makePostRequest('hr/getStaffTimetableByDate', data, res => callback(res))
}

export const getWorkingTimeSummary = (data, callback) => {
  makePostRequest('hr/getWorkingTimeSummary', data, res => callback(res))
}


export const getFingerScanByEmployeeId = (data, callback) => {
  makePostRequest('hr/getFingerScanByEmployeeId', data, res => callback(res))
}

export const getMonthlyTimeScanByEmployeeId = (data, callback) => {
  makePostRequest('hr/getMonthlyTimeScanByEmployeeId', data, res => callback(res))
}


export const submitEmployeeScanTimeManual = (data, callback) => {
  makePostRequest('hr/submitEmployeeScanTimeManual', data, res => callback(res))
}


export const getEmployeeHourSalary = (data, callback) => {
  makePostRequest('hr/getEmployeeHourSalary', data, res => callback(res))
}


export const downloadTimescanBydepartmentAndMonth = (data, callback) => {
  makePostRequest('hr/downloadTimescanBydepartmentAndMonth', data, res => callback(res))
}


export const getWorkingXSalaryByMonth = (data, callback) => {
  makePostRequest('hr/getWorkingXSalaryByMonth', data, res => callback(res))
}

export const saveEmployeeSalaryPayment = (data, callback) => {
  makePostRequest('hr/saveEmployeeSalaryPayment', data, res => callback(res))
}


export const showPrintReceipt = (data, callback) => {
  makePostRequest('hr/showPrintReceipt', data, res => callback(res))
}

export const updateWarningApprove = (data, callback) => {
  const formData = new FormData();
  formData.append('id', data.id);
  formData.append('imageFile', data.imageFile);
  makePostRequest('hr/updateWarningApprove', formData, res => callback(res))
}


export const createNewDormRoom = (data, callback) => {
  makePostRequest('hr/createNewDormRoom', data, res => callback(res))
}


export const getDormInfoById = (data, callback) => {
  makePostRequest('hr/getDormInfoById', data, res => callback(res))
}


export const createNewDormitoryBill = (data, callback) => {
  makePostRequest('hr/createNewDormitoryBill', data, res => callback(res))
}


export const getDormitoryBillById = (data, callback) => {
  makePostRequest('hr/getDormitoryBillById', data, res => callback(res))
}


export const assignNewResident = (data, callback) => {
  makePostRequest('hr/assignNewResident', data, res => callback(res))
}


export const resignResident = (data, callback) => {
  makePostRequest('hr/resignResident', data, res => callback(res))
}

export const insertMonthlyUtilitiesUsage = (data, callback) => {
  makePostRequest('hr/insertMonthlyUtilitiesUsage', data, res => callback(res))
}


export const setCurrentDormMeters = (data, callback) => {
  makePostRequest('hr/setCurrentDormMeters', data, res => callback(res))
}


export const insertMonthlyBillUsage = (data, callback) => {
  makePostRequest('hr/insertMonthlyBillUsage', data, res => callback(res))
}


export const getDorms = (callback) => {
  makeGetRequest('hr/getDorms', res => callback(res))
}

export const getNonResidentEmployee = (callback) => {
  makeGetRequest('hr/getNonResidentEmployee', res => callback(res))
}


export const deleteEmployeeAccount = (data, callback) => {
  makePostRequest('hr/deleteEmployeeAccount', data, res => callback(res))
}

export const submitNoteToEmployee = (data, callback) => {
  makePostRequest('hr/submitNoteToEmployee', data, res => callback(res))
}
export const getEmployeeNoteListById = (data, callback) => {
  makePostRequest('hr/getEmployeeNoteListById', data, res => callback(res))
}

export const deleteEmployeeNoteByNoteId = (data, callback) => {
  makePostRequest('hr/deleteEmployeeNoteByNoteId', data, res => callback(res))
}
export const getLogsByEmployeeId = (data, callback) => {
  makePostRequest('hr/getLogsByEmployeeId', data, res => callback(res))
}

export const getEmployeePublicHoliday = (data, callback) => {
  makePostRequest('deptManager/getEmployeePublicHoliday', data, res => callback(res))
}

export const downloadTimescanBydepartmentAndMonthWithOT = (data, callback) => {
  makePostRequest('hr/downloadTimescanBydepartmentAndMonthWithOT', data, res => callback(res))
}

export const getPublicHolidayList = (callback) => {
  makeGetRequest('deptManager/getPublicHolidayList', res => callback(res))
}

export const getEmployeeTimeScanById = (data, callback) => {
  makePostRequest('hr/getEmployeeTimeScanById', data, res => callback(res))
}

export const getEmployeeUnapproveRequestByEmployeeId = (data, callback) => {
  makePostRequest('deptManager/getEmployeeUnapproveRequestByEmployeeId', data, res => callback(res))
}
export const getEmployeeUnapproveRequest = (callback) => {
  makeGetRequest('deptManager/getEmployeeUnapproveRequest', res => callback(res))
}

export const hrSubmitNewEmployee = (data, callback) => {
  const formData = new FormData();
  formData.append('nationalId', data.nationalId);
  formData.append('dob', data.dob);
  formData.append('departmentId', data.selectedDepartment);
  formData.append('role', data.role);
  formData.append('startJob', data.startJob);
  formData.append('defaultDayOff', data.dayOff);
  formData.append('bankAccount', data.bankAccount);
  formData.append('name', data.name);
  formData.append('nationality', data.nationality);
  formData.append('phone', data.phone);
  formData.append('address', data.address);
  formData.append('employerAccount', data.employer);
    formData.append('positionId', data.positionId);
  formData.append('imageFile', data.imageFile);
  makePostRequest('hr/hrSubmitNewEmployee', formData, res => callback(res))

}

export const hrProcessTimeScanRequest = (data, callback) => {
  makePostRequest('deptManager/hrProcessTimeScanRequest', data, res => callback(res))
}

export const hrProcessTimetableRequest = (data, callback) => {
  makePostRequest('deptManager/hrProcessTimetableRequest', data, res => callback(res))
}

export const hrProcessLeaveRequest = (data, callback) => {
  makePostRequest('deptManager/hrProcessLeaveRequest', data, res => callback(res))
}

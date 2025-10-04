import axios from 'axios'


export const IP = 'https://tunit3-samed.ap.ngrok.io';
export const REPORT_JOB_PERMISSION = 'uywnwdl0ncxy10';
export const JOB_OWN_PERMISSION = 'uywovfl0oxjfgc';

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


export const getEmployeeProfileByLineId = (data, callback) => {
  makePostRequest('hr/getEmployeeProfileByLineId', data, res => callback(res))
}

export const getJobs = (callback) => {
  makeGetRequest('engineer/getJobs', res => callback(res))
}

export const getBuildingsAndProperties = (callback) => {
  makeGetRequest('engineer/getBuildingsAndProperties', res => callback(res))
}

export const getJobsByCreateBy = (data, callback) => {
  makePostRequest('engineer/getJobsByCreateBy', data, res => callback(res))
}

export const submitNewJob = (data, callback) => {
  makePostRequest('engineer/submitNewJob', data, res => callback(res))
}

export const updatePhoneByUserId = (data, callback) => {
  makePostRequest('hr/updatePhoneByUserId', data, res => callback(res))
}

export const getMonthlyTimeScanByEmployeeId = (data, callback) => {
  makePostRequest('hr/getMonthlyTimeScanByEmployeeId', data, res => callback(res))
}

export const getEmployeeAccountById = (data, callback) => {
  makePostRequest('hr/getEmployeeAccountById', data, res => callback(res))
}


export const getMonthlyReportStatus = (data, callback) => {
  makePostRequest('hr/getMonthlyReportStatus', data, res => callback(res))
}

export const showPrintReceipt = (data, callback) => {
  makePostRequest('hr/showPrintReceipt', data, res => callback(res))
}

export const newIssueReport = (data, callback) => {
  makePostRequest('hr/newIssueReport', data, res => callback(res))
}

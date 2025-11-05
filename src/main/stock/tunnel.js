const { makePostRequest, makeGetRequest } = require('./../../function-helpers')

export const addNewSupplier = (data, callback) => {
  makePostRequest('stock/addNewSupplier', data, res => callback(res))
}


export const getSuppliers = callback => {
  makeGetRequest('stock/getSuppliers', res => callback(res))
}

export const getSellerList = callback => {
  makeGetRequest('stock/getSellerList', res => callback(res))
}


export const getItemList = callback => {
  makeGetRequest('stock/getItemList', res => callback(res))
}

export const getConfirmPurchase = callback => {
  makeGetRequest('stock/getConfirmPurchase', res => callback(res))
}

export const getConfirmPurchaseById = (data, callback) => {
  makePostRequest('stock/getConfirmPurchaseById', data, res => callback(res))
}


export const findPurchaseByItemId = (data, callback) => {
  makePostRequest('stock/findPurchaseByItemId', data, res => callback(res))
}


export const submitNewMonthlyPayment = (data, callback) => {
  makePostRequest('stock/submitNewMonthlyPayment', data, res => callback(res))
}


export const getMonthlyPayment = callback => {
  makeGetRequest('stock/getMonthlyPayment', res => callback(res))
}

export const submitPaymentToPurchase = (data, callback) => {
  if(data.type === 'โอนเงิน' || data.type === 'โอนเงินโดย MD'){
    const formData = new FormData();
    formData.append('amount', data.amount);
    formData.append('purchaseId', data.purchaseId);
    formData.append('type', data.type);
    formData.append('username', data.username);
    formData.append('reference', data.reference);
    formData.append('creditSupplier', data.creditSupplier);
    formData.append('imageFile', data.imageFile);
    makePostRequest('stock/submitPaymentToPurchaseFormData', formData, res => callback(res))
  }else{
    makePostRequest('stock/submitPaymentToPurchase', data, res => callback(res))
  }
}


export const submitReceiptFile = (data, callback) => {
    const formData = new FormData();
    formData.append('poId', data.poId);
    formData.append('imageFile', data.receiptFile);
    makePostRequest('stock/submitReceiptFile', formData, res => callback(res))
}

export const getStores = callback => {
  makeGetRequest('stock/getStores', res => callback(res))
}

export const getStoreById = (data, callback) => {
  makePostRequest('stock/getStoreById', data, res => callback(res))
}

export const getItemsBySellerId = (data, callback) => {
  makePostRequest('stock/getItemsBySellerId', data, res => callback(res))
}

export const getPurchaseHistrories = (data, callback) => {
  makePostRequest('stock/getPurchaseHistrories', data, res => callback(res))
}

export const getSupplierById = (data, callback) => {
  makePostRequest('stock/getSupplierById', data, res => callback(res))
}

export const addNewExpense = (data, callback) => {
  if(data.type === 'โอนเงิน' || data.type === 'โอนเงินโดย MD'){
    const formData = new FormData();
    formData.append('amount', data.amount);
    formData.append('detail', data.detail);
    formData.append('type', data.type);
    formData.append('paymentAt', data.paymentAt);
    formData.append('reference', data.reference);
    formData.append('createBy', data.createBy);
    formData.append('imageFile', data.imageFile);
    makePostRequest('stock/addNewExpenseFormData', formData, res => callback(res))
  }else{
    makePostRequest('stock/addNewExpense', data, res => callback(res))
  }
}

export const addNewExpenseToSupplier = (data, callback) => {
  makePostRequest('stock/addNewExpenseToSupplier', data, res => callback(res))
}

export const paySupplierCreditToSupplier = (data, callback) => {
  if(data.type === 'โอนเงิน' || data.type === 'โอนเงินโดย MD'){
    const formData = new FormData();
    formData.append('amount', data.amount);
    formData.append('type', data.type);
    formData.append('reference', data.reference);
    formData.append('imageFile', data.imageFile);
    formData.append('createBy', data.createBy);
    formData.append('supplierId', data.supplierId);
    formData.append('purchaseList', JSON.stringify(data.purchaseList));
    formData.append('expenseList', JSON.stringify(data.expenseList));
    makePostRequest('stock/paySupplierCreditToSupplierFormData', formData, res => callback(res))
  }else{
    makePostRequest('stock/paySupplierCreditToSupplier', data, res => callback(res))
  }
}

export const getReportByMonth = (data, callback) => {
  makePostRequest('stock/getReportByMonth', data, res => callback(res))
}

export const getExpenseByMonth = (data, callback) => {
  makePostRequest('stock/getExpenseByMonth', data, res => callback(res))
}

export const getExpensePastMonth = callback => {
  makeGetRequest('stock/getExpensePastMonth', res => callback(res))
}

export const submitCashSale = (data, callback) => {
  makePostRequest('stock/submitCashSale', data, res => callback(res))
}

export const getAccountBalance = callback => {
  makeGetRequest('stock/getAccountBalance', res => callback(res))
}

export const submitTransferFromSaleCashToAccountCash = (data, callback) => {
  makePostRequest('stock/submitTransferFromSaleCashToAccountCash', data, res => callback(res))
}

export const getAccountHistrory = (data, callback) => {
  makePostRequest('stock/getAccountHistrory', data, res => callback(res))
}

export const submitTransferToMDAccount = (data, callback) => {
  const formData = new FormData();
  formData.append('createBy', data.createBy);
  formData.append('amount', data.amount);
  formData.append('imageFile', data.imageFile);
  makePostRequest('stock/submitTransferToMDAccount', formData, res => callback(res))
}

export const submitTransferFromMDAccount = (data, callback) => {
  const formData = new FormData();
  formData.append('createBy', data.createBy);
  formData.append('amount', data.amount);
  formData.append('imageFile', data.imageFile);
  makePostRequest('stock/submitTransferFromMDAccount', formData, res => callback(res))
}

export const getMaintenance  = callback => {
  makeGetRequest('stock/getMaintenance', res => callback(res))
}


export const deletePurchaseOrder = (data, callback) => {
  makePostRequest('stock/deletePurchaseOrder', data, res => callback(res))
}

export const deleteExpense = (data, callback) => {
  makePostRequest('stock/deleteExpense', data, res => callback(res))
}

export const cancelPaymentBySupplier = (data, callback) => {
  makePostRequest('stock/cancelPaymentBySupplier', data, res => callback(res))
}

export const getItemsHistroryByStoreId = (data, callback) => {
  makePostRequest('stock/getItemsHistroryByStoreId', data, res => callback(res))
}


export const clearPaymentByPurchaseId = (data, callback) => {
  makePostRequest('stock/clearPaymentByPurchaseId', data, res => callback(res))
}

export const submitMaintenancePayment = (data, callback) => {
  if(data.type === 'โอนเงิน' || data.type === 'โอนเงินโดย MD'){
    const formData = new FormData()
    formData.append('maintenanceId', data.maintenanceId)
    formData.append('createBy', data.createBy)
    formData.append('type', data.type)
    formData.append('imageFile', data.imageFile)
    formData.append('price', data.price)
    makePostRequest('stock/submitMaintenancePaymentFormData', formData, res => callback(res))
  }else{
    makePostRequest('stock/submitMaintenancePayment', data, res => callback(res))
  }
}

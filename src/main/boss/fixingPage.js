import React from 'react'

import {deletePurchaseReceiptFile,
  deleteMaintenanceById, deletePurchaseApprovelFile} from './tunnel'

export default class FixingPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      inputValue: ''
    }
  }

  inputOnChange = e => {
    const {value} = e.target
    this.setState(() => ({
      inputValue: value
    }))
  }

  validateInput = (value) => {
    if(value.trim() === ''){
      return false
    }else{
      return true
    }
  }

  deletePurchaseReceiptFile = () => {
    const {inputValue} = this.state
    if(this.validateInput(inputValue)){
      if(window.confirm('Confirm "Delete Purchase Receipt File" By ID#' + inputValue)){
        deletePurchaseReceiptFile({id: inputValue}, res => {
          if(res.status){
            alert('สำเร็จ')
            this.setState(() => ({
              inputValue: ''
            }))
          }else{
            alert(res.msg)
          }
        })
      }
    }else{
      alert('กรุณาใส่ ID ให้ถูกต้อง')
    }
  }


  deletePurchaseApprovelFile = () => {
    const {inputValue} = this.state
    if(this.validateInput(inputValue)){
      if(window.confirm('Confirm "Delete Purchase Approvel File" By ID#' + inputValue)){
        deletePurchaseApprovelFile({id: inputValue}, res => {
          if(res.status){
            alert('สำเร็จ')
            this.setState(() => ({
              inputValue: ''
            }))
          }else{
            alert(res.msg)
          }
        })
      }
    }else{
      alert('กรุณาใส่ ID ให้ถูกต้อง')
    }
  }


  deleteMaintenanceById = () => {
    const {inputValue} = this.state
    if(this.validateInput(inputValue)){
      if(window.confirm('Confirm "Delete Maintenance" By ID#' + inputValue)){
        deleteMaintenanceById({id: inputValue}, res => {
          if(res.status){
            alert('สำเร็จ')
            this.setState(() => ({
              inputValue: ''
            }))
          }else{
            alert(res.msg)
          }
        })
      }
    }else{
      alert('กรุณาใส่ ID ให้ถูกต้อง')
    }
  }

  render(){
    const {currentPage, inputValue} = this.state
    return (
      <div className="">
        Welcome To Fixing Page!
        <div className="col-12">
          <h3>Purchase</h3>
          <hr />
          <div className="col-12">
            <div class="form-group">
              <label for="exampleInputEmail1">ID:</label>
            <input value={inputValue} name="avaTwin" onChange={this.inputOnChange} className="form-control" type="text" />
            </div>
          </div>
          <div className="col">
            <button onClick={this.deletePurchaseReceiptFile} className="btn btn-success mx-1">Delete File Receipt By Purchase ID</button>
            <button onClick={this.deleteMaintenanceById} className="btn btn-success mx-1">Delete Maintenance By ID</button>
          <button onClick={this.deletePurchaseApprovelFile} className="btn btn-success mx-1">Delete File Approvel By Purchase ID</button>

          </div>
        </div>
      </div>
    )
  }
}

import React from 'react'
import validator from 'validator'
import Select from 'react-select';
import {
  submitStaffFood,
  getKitchenStock
} from './tunnel'

export default class StaffFood extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      uncategoriseItems: [],
      foodName: '',
      numberOfStaff:'',
      selectedItems: []
    }
  }

  numberOfStaffOnChange = e => {
    let value = e.target.value
    if(validator.isInt(value) || value.trim() === ''){
      this.setState(() => ({
        numberOfStaff: value
      }))
    }
  }

  foodNameOnChange = e => {
    let value = e.target.value
    this.setState(() => ({
      foodName: value
    }))
  }

  itemQuantityOnChange = e => {
    let value = e.target.value
    let itemId = e.target.name
    console.log(value, itemId);
    let selectedItems = this.state.selectedItems
    if(validator.isFloat(value)){
      selectedItems = selectedItems.filter(x => x.itemId !== itemId)
      selectedItems = [ ...selectedItems, {itemId, quantity: value}]
      this.setState(() => ({
        selectedItems
      }))
      console.log(selectedItems);
    }
    if(value.trim() === ''){
      selectedItems = selectedItems.filter(x => x.itemId !== itemId)
      this.setState(() => ({
        selectedItems
      }))
    }
  }

  findItemQuantity = id => {
    const selectedItems = this.state.selectedItems
    let found = selectedItems.find(x => x.itemId === id)
    if(found){
      return found.quantity
    }else{
      return ''
    }
  }

  componentDidMount(){
    getKitchenStock(res => {
      if(res.status){
        this.setState(() => ({
          uncategoriseItems: res.storeItemList
        }))
      }else{
        alert(res.msg)
      }
    })
  }
  submitStaffFood = () => {
    const uncategoriseItems = this.state.uncategoriseItems
    const selectedItems = this.state.selectedItems
    const foodName = this.state.foodName
    const numberOfStaff = this.state.numberOfStaff
    if(selectedItems.length === 0){
      alert('กรุณาใส่จำนวนวัตถุดิบที่ใช้')
      return
    }
    if(foodName.trim() === ''){
      alert('กรุณาใส่รายการอาหารที่ทำ')
      return
    }
    if(parseInt(numberOfStaff) <= 0 || numberOfStaff.trim() === ''){
      alert('กรุณาใส่จำนวนพนักงานให้ถูกต้อง')
      return
    }
    let error = ''
    selectedItems.forEach(x => {
      let found = uncategoriseItems.find(y => y.itemId === x.itemId)
      if(found.quantity < parseFloat(x.quantity)){
        error = error + `จำนวน ${found.name} ไม่เพียงพอ\n`
      }
    })
    if(error.trim() !== ''){
      alert(error)
      return
    }

    submitStaffFood({
      selectedItems,
      foodName,
      numberOfStaff,
      createBy: this.props.user.username
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          foodName: '',
          numberOfStaff: '',
          selectedItems: []
        }))
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })

  }
  render(){
    return(
      <div className="col-12 mx-2">
        <div className="row">
          <div className="col-md-6 col-11">
            <table className="table table-border">
              <thead>
                <tr>
                  <th>วัตถุดิบที่ยังไม่จัดสรร</th>
                  <th>จำนวน</th>
                  <th>หน่วย</th>
                  <th>จำนวนที่ใช้</th>
                </tr>
              </thead>
              <tbody>
                { this.state.uncategoriseItems.length !== 0 ?
                   this.state.uncategoriseItems.map(x => (
                    <tr>
                      <td>
                        {x.name}
                      </td>
                      <td>
                        {x.quantity}
                      </td>
                      <td>
                        {x.unit}
                      </td>
                      <td>
                        <input value={this.findItemQuantity(x.itemId)} onChange={this.itemQuantityOnChange} name={x.itemId} type="text" />
                      </td>
                    </tr>
                  ))
                :
                <tr>
                  <td colSpan="2">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              }
              </tbody>
            </table>
          </div>
          <div className="col-md-5 col-11">
            <div className="row">
              <div className="col-11">
                <div className="form-group">
                  <label for="exampleFormControlInput1">รายการอาหาร</label>
                  <input type="text" onChange={this.foodNameOnChange} value={this.state.foodName} className="form-control" id="exampleFormControlInput1" />
                </div>
              </div>
              <div className="col-11">
                <div className="form-group">
                  <label for="exampleFormControlInput1">จำนวนพนักงาน</label>
                  <input type="text" onChange={this.numberOfStaffOnChange} value={this.state.numberOfStaff} className="form-control" id="exampleFormControlInput1" />
                </div>
              </div>
              <div className="col-11">
                <button onClick={this.submitStaffFood} className="btn btn-success">บันทึก</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

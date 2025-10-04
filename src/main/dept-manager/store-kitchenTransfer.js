import React from 'react'
import validator from 'validator'
import Select from 'react-select';
import {
  submitKitchenTransfer,
  getIngredientByStoreId,
  getKitchenStock
} from './tunnel'


export default class TransferHotKitchen extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      uncategoriseItems: [],
      ingredientItems: [],
      subPage: 'วัตถุดิบที่ยังไม่จัดสรร',
      selectedItems: [],
      selectedIngredient: [],
      selectedDepartment: ''
    }
  }

  submit = () => {
    const selectedDepartment = this.state.selectedDepartment
    const selectedItems = this.state.selectedItems
    const selectedIngredient = this.state.selectedIngredient
    const uncategoriseItems = this.state.uncategoriseItems
    const ingredientItems = this.state.ingredientItems
    if(selectedDepartment.trim() === ''){
      alert('กรุณาเลือกแผนกที่ต้องการส่งของ')
      return
    }
    if(selectedItems.length === 0 && selectedIngredient.length === 0){
      alert('กรุณาเลือกรายการของหรือวัตถุดิบ')
      return
    }
    let error = ''
    selectedItems.forEach((item, i) => {
      if(item.quantity.trim === '' || item.quantity === 0){
        error = error + `กรุณาใส่จำนวน ${item.name} ให้ถูกต้อง\n`
      }else{
        let found = uncategoriseItems.find(x => x.itemId === item.id)
        if(found.quantity < parseFloat(item.quantity)){
          error = error + `จำนวน ${item.name} ไม่เพียงพอในการส่งของ\n`
        }
      }
    });

    selectedIngredient.forEach((item, i) => {
      if(item.quantity.trim === '' || item.quantity === 0){
        error = error + `กรุณาใส่จำนวน ${item.name} ให้ถูกต้อง\n`
      }else{
        let found = ingredientItems.find(x => x.id === item.id)
        if(found.quantity < parseFloat(item.quantity)){
          error = error + `จำนวน ${item.name} ไม่เพียงพอในการส่งของ\n`
        }
      }
    });

    if (error !== ''){
      alert(error)
      return
    }

    submitKitchenTransfer({
      selectedDepartment,
      selectedItems,
      selectedIngredient,
      createBy: this.props.user.username
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          selectedItems: [],
          selectedIngredient: [],
          selectedDepartment: ''
        }))
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })

  }

  componentDidMount(){
    getKitchenStock(res => {
      if(res.status){
        this.setState(() => ({
          uncategoriseItems: res.storeItemList
        }))
        console.log(res.storeItemList);
      }else{
        alert(res.msg)
      }
    })
    getIngredientByStoreId({
      storeId: this.props.storeId
    },res => {
      if(res.status){
        console.log(res.ingredientList);
        this.setState(() => ({
          ingredientItems: res.ingredientList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  onSubPageChange = (page) => {
    this.setState(() => ({
      subPage: page
    }))
  }

  onAddItem = (item, type) => {
    console.log(item);
    let selectedItems = this.state.selectedItems;
    let selectedIngredient = this.state.selectedIngredient;
    if(type === 'ingredient'){
      selectedIngredient = [ ...selectedIngredient, {id: item.id, name: item.name, unit: item.unit, quantity: 0}]
      this.setState(() => ({
        selectedIngredient
      }))
    }
    if(type === 'item'){
      selectedItems = [ ...selectedItems, {id: item.itemId, name: item.name, unit: item.unit, quantity: 0}]
      this.setState(() => ({
        selectedItems
      }))
    }
  }

  onRemoveItem = (item, type) => {
    let selectedItems = this.state.selectedItems;
    let selectedIngredient = this.state.selectedIngredient;
    if(type === 'ingredient'){
      selectedIngredient = selectedIngredient.filter(x => x.id !== item.id)
      this.setState(() => ({
        selectedIngredient
      }))
    }
    if(type === 'item'){
      selectedItems = selectedItems.filter(x => x.id !== item.itemId)
      this.setState(() => ({
        selectedItems
      }))
    }
  }

  isItemInList = id => {
    console.log(id);
    let found = false
    let selectedItems = this.state.selectedItems;
    let selectedIngredient = this.state.selectedIngredient;
    selectedItems.forEach((item, i) => {
      if(item.id === id){
        found = true
      }
    });
    selectedIngredient.forEach((item, i) => {
      if(item.id === id){
        found = true
      }
    });
    return found
  }

  departmentOnChange = input => {
    const value = input.value
    this.setState(() => ({
      selectedDepartment: value
    }))
  }

  quantityOnChange = e => {
    const value = e.target.value
    const id = e.target.id
    const type = e.target.name
    if(validator.isFloat(value) || value.trim() === ''){
      let selectedItems = this.state.selectedItems;
      let selectedIngredient = this.state.selectedIngredient;
      if(type === 'ingredient'){
        selectedIngredient = selectedIngredient.map(x => {
          if(x.id === id){
            x['quantity'] = value
          }
          return x
        })
        this.setState(() => ({
          selectedIngredient
        }))
      }
      if(type === 'item'){
        selectedItems = selectedItems.map(x => {
          if(x.id === id){
            x['quantity'] = value
          }
          return x
        })
        this.setState(() => ({
          selectedItems
        }))
      }
    }
  }

  render(){
    const departmentOption = [
      {label:'ครัวร้อน', value: 'uywcp6key6izm0'},
      {label: 'Bar Jep', value: 'uywcp6key6i8mq'},
      {label: 'ครัว Pavilion', value: 'uywd0qkfqjmhap'},
     ]
    return(
      <div className="col-12 mx-2">
        <div className="row mt-4">
          <div className="col-md-4 col-11 mx-2">
            <div className="row">
              <div onClick={() => this.onSubPageChange('วัตถุดิบที่ยังไม่จัดสรร')} className={`col-6 text-center ${this.state.subPage === 'วัตถุดิบที่ยังไม่จัดสรร' ? 'subPage-select' : 'subPage'}`}>
                ของในสต๊อก
              </div>
              <div onClick={() => this.onSubPageChange('วัตถุดิบในสต๊อก')} className={`col-6 text-center ${this.state.subPage === 'วัตถุดิบในสต๊อก' ? 'subPage-select' : 'subPage'}`}>
                วัตถุดิบในสต๊อก
              </div>
            </div>
          { this.state.subPage === 'วัตถุดิบที่ยังไม่จัดสรร' && <div className="row">
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>รายการ</th>
                      <th>หน่วย</th>
                      <th>จำนวนคงเหลือ</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.uncategoriseItems.length !== 0 ?
                      this.state.uncategoriseItems.map(x => (
                        <tr>
                          <td>{x.name}</td>
                          <td>{x.unit}</td>
                          <td>{x.quantity}</td>
                          <td>
                            {
                              !this.isItemInList(x.itemId) ?
                              <button onClick={() => this.onAddItem(x, 'item')} className="btn btn-success">+</button>
                              :
                              <button onClick={() => this.onRemoveItem(x, 'item')} className="btn btn-warning">-</button>
                            }
                          </td>
                        </tr>
                      ))
                      :
                      <tr colSpan='4'>
                        <td>ไม่พบรายการ</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>}
            { this.state.subPage === 'วัตถุดิบในสต๊อก' && <div className="row">
                <div className="col-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>รายการ</th>
                        <th>จำนวนคงเหลือ</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.ingredientItems.length !== 0 ?
                        this.state.ingredientItems.map(x => (
                          <tr>
                            <td>{x.name}</td>
                            <td>{x.quantity}</td>
                            <td>
                              {
                                !this.isItemInList(x.id) ?
                                <button onClick={() => this.onAddItem(x, 'ingredient')} className="btn btn-success">+</button>
                                :
                                <button onClick={() => this.onRemoveItem(x, 'ingredient')} className="btn btn-warning">-</button>
                              }
                            </td>
                          </tr>
                        ))
                        :
                        <tr colSpan='3'>
                          <td>ไม่พบรายการ</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>}
          </div>
          <div className="col-12 col-md-6">
            <div className="row">
              <div className="col-11 mx-3">
                <div className="form-group">
                  <label>เลือกแผนกที่ต้องการส่งของ</label>
                  <Select onChange={this.departmentOnChange} className="form-control" options={departmentOption} />
                </div>
              </div>
              <div className="col-11 mx-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th>รายการของ</th>
                      <th>จำนวน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.selectedItems.length !== 0 ?
                      this.state.selectedItems.map(x => (
                        <tr>
                          <td>{x.name} ({x.unit})</td>
                          <td><input onChange={this.quantityOnChange} id={x.id} name='item' value={x.quantity} type="text" /></td>
                        </tr>
                      ))
                      :
                      <tr>
                        <td>ไม่มีรายการที่เลือก</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="col-11 mx-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th>รายการวัตถุดิบ</th>
                      <th>จำนวน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.selectedIngredient.length !== 0 ?
                      this.state.selectedIngredient.map(x => (
                        <tr>
                          <td>{x.name} ({x.unit})</td>
                          <td><input onChange={this.quantityOnChange} id={x.id} name='ingredient' value={x.quantity} type="text" /></td>
                        </tr>
                      ))
                      :
                      <tr>
                        <td>ไม่มีรายการที่เลือก</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="col-11">
                <button onClick={this.submit} className="btn btn-success">บันทึก</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

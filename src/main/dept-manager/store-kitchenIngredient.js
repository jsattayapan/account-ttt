import React from 'react'
import validator from 'validator'
import Select from 'react-select';
import {
  submitEquipment,
  getIngredient,
  getKitchenStock,
  submitPrepareIngredient,
  sumitNewIngredient
} from './tunnel'
export default class PrepareIngredients extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      uncategoriseItems: [],
      showAddIngredient: false,
      ingredientList: [],
      selectedIngredientId: '',
      quantity: 0,
      selectedItems: [],
      equipmentOutlet: false
    }
  }

  submitEquipment = () => {
    let selectedItems = this.state.selectedItems
    const uncategoriseItems = this.state.uncategoriseItems
    selectedItems = selectedItems.filter(x => x.quantity !== 0)
    selectedItems = selectedItems.filter(x => x.quantity !== '')
    if(selectedItems.length === 0){
      alert('กรุณาใส่จำนวนวัตถุดิบที่ใช้')
      return
    }
    let error = ''
    selectedItems.forEach(x => {
      let found = uncategoriseItems.find(y => y.itemId === x.itemId)
      console.log(found.quantity, parseFloat(x.quantity));
      if(found.quantity < parseFloat(x.quantity)){
        error = error + `จำนวน ${found.name} ไม่เพียงพอ\n`
      }
    })
    console.log(error);
    if(error.trim() !== ''){
      alert(error)
      return
    }

    submitEquipment({
      selectedItems,
      createBy: this.props.user.username,
      departmentId: 'uywcp6key6iuc5'
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          selectedItems: []
        }))
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }

  submit = () => {
     let selectedItems = this.state.selectedItems
     const quantity = this.state.quantity
     const selectedIngredientId = this.state.selectedIngredientId
     const uncategoriseItems = this.state.uncategoriseItems
     selectedItems = selectedItems.filter(x => x.quantity !== 0)
     selectedItems = selectedItems.filter(x => x.quantity !== '')
     if(selectedItems.length === 0){
       alert('กรุณาใส่จำนวนวัตถุดิบที่ใช้')
       return
     }

     if(selectedIngredientId.trim() == ''){
       alert('กรุณาเลือกรายการวัตถุดิบที่แปรรูป')
       return
     }
     if(quantity === '' || parseFloat(quantity) <= 0){
       alert('กรุณาใส่จำนวนให้ถูกต้อง')
       return
     }
     let error = ''
     selectedItems.forEach(x => {
       let found = uncategoriseItems.find(y => y.itemId === x.itemId)
       console.log(found.quantity, parseFloat(x.quantity));
       if(found.quantity < parseFloat(x.quantity)){
         error = error + `จำนวน ${found.name} ไม่เพียงพอ\n`
       }
     })
     console.log(error);
     if(error.trim() !== ''){
       alert(error)
       return
     }
     submitPrepareIngredient({
       selectedItems,
       quantity,
       selectedIngredientId,
       createBy: this.props.user.username
     }, res => {
       if(res.status){
         alert('ข้อมูลถูกบันทึก')
         this.setState(() => ({
           selectedItems: [],
           selectedIngredientId: '',
           quantity: 0
         }))
         this.componentDidMount()
       }else{
         alert(res.msg)
       }
     })
  }

  selectedItemQuantityOnChange = e => {
    const value = e.target.value
    const itemId = e.target.name
    let selectedItems = this.state.selectedItems
    if(validator.isFloat(value)){
      let found  = selectedItems.find(x => x.itemId === itemId)
      if(found){
        const newItem = { itemId, quantity: value }
        selectedItems = selectedItems.filter(x => x.itemId !== itemId )
        selectedItems = [ ...selectedItems, newItem]
        this.setState(() => ({
          selectedItems
        }))
      }else{
        const newItem = { itemId, quantity: value }
        selectedItems = [ ...selectedItems, newItem]
        this.setState(() => ({
          selectedItems
        }))
      }
    }
    if(value.trim() === ''){
      selectedItems = selectedItems.filter(x => x.itemId !== itemId )
      this.setState(() => ({
        selectedItems
      }))
    }

  }

  componentDidMount(){
    getKitchenStock(res => {
      if(res.status){
        console.log(res.storeItemList);
        this.setState(() => ({
          uncategoriseItems: res.storeItemList
        }))
      }else{
        alert(res.msg)
      }
    })
    getIngredient(res => {
      if(res.status){
        this.setState(() => ({
          ingredientList: res.ingredientList.filter(x => x.storeId = 'uywcp6key6iuc5')
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  quantityOnChange = e => {
    const value = e.target.value
    if(validator.isFloat(value) || value.trim() === ''){
      this.setState(() => ({
        quantity: value
      }))
    }
  }

  ingredientOnChange = e => {
    const id = e.value
    this.setState(() => ({
      selectedIngredientId: id
    }))
  }

  updateIngredient = (ingredientList) => {
    this.setState(() => ({
      ingredientList: ingredientList,
      showAddIngredient: false
    }))
  }

  toggleAddIngredient = () => {
    this.setState(() => ({
      showAddIngredient: !this.state.showAddIngredient
    }))
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

  outletOnChange = input => {
    this.setState(() => ({
      equipmentOutlet: input.value
    }))
  }

  render(){
    let ingredientOptions = this.state.ingredientList
    ingredientOptions = ingredientOptions.map(x => ({label: `${x.name} ${x.amount} ${x.unit}`, value: x.id}))
    let outletOptions = [
      {label: 'ทำเป็นวัตถุดิบ', value: false},
      {label: 'ย้ายเป็นอุปกรณ์', value: true},
    ]
    return (
      <div className="col-12">
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
                        <input value={this.findItemQuantity(x.itemId)} onChange={this.selectedItemQuantityOnChange} name={x.itemId} type="text" />
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
          <div className="col-md-5 col-11 mx-3">
            <div className="row">
              <div className="col-12">
                  <div className="form-group">
                    <label for="exampleFormControlInput1">แยกประเภท</label>
                    <Select onChange={this.outletOnChange} options={outletOptions} />
                  </div>
              </div>
            </div>
            {
              !this.state.equipmentOutlet ?
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <button onClick={this.toggleAddIngredient} className="btn btn-link">
                        + เพิ่มรายการวัตถุดิบใหม่
                      </button>
                    </div>
                  </div>
                  {
                    this.state.showAddIngredient &&
                    <AddIngredientSection updateIngredient={this.updateIngredient} />
                  }
                  <div className="row">
                    <div className=" col-11">
                        <div className="form-group">
                          <label for="exampleFormControlInput1">รายการ</label>
                          <Select onChange={this.ingredientOnChange} options={ingredientOptions} />
                        </div>
                    </div>
                    <div className="col-11">
                      <div className="form-group">
                        <label for="exampleFormControlInput1">จำนวน</label>
                        <input onChange={this.quantityOnChange} value={this.state.quantity} type="text" className="form-control" id="exampleFormControlInput1" />
                      </div>
                    </div>
                    <div className="col-11 mt-4">
                      <button onClick={this.submit} className="btn btn-success">บันทึก</button>
                    </div>
                  </div>
                </div>
              </div> :
              <div className="row">
                <div className="col-12">
                  <button onClick={this.submitEquipment} className="btn btn-success">บันทึก</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

class AddIngredientSection extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      name: '',
      amount: '',
      unit:''
    }
  }

  textOnChange = e => {
    const value = e.target.value
    const name = e.target.name
    this.setState(() => ({
    [name]: value
    }))
  }
  amountOnChange = e => {
    const value = e.target.value
    if(validator.isFloat(value) || value.trim() === ''){
      this.setState(() => ({
        amount: value
      }))
    }
  }
  submit = () => {
    const name = this.state.name
    const amount = this.state.amount
    const unit = this.state.unit
    if(name.trim() === ''){
      alert('กรุณาระบุชื่อรายการ')
      return
    }
    if(unit.trim() === ''){
      alert('กรุณาระบุหน่วย')
      return
    }
    if(amount.trim() === ''){
      alert('กรุณาระบุปริมาณ')
      return
    }
    if(parseFloat(amount <= 0)){
      alert('กรุณาระบุปริมาณที่มากกว่า 0')
    }
    sumitNewIngredient({
      name,
      amount,
      unit
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.updateIngredient(res.ingredientList)
      }else{
        alert(res.msg)
      }
    })
  }
  render(){
    return (
      <div className="row">
        <div className="col-11">
          <div className="form-group">
            <label for="exampleFormControlInput1">ชื่อวัตถุดิบ</label>
            <input type="text" onChange={this.textOnChange} name='name' value={this.state.name} className="form-control" id="exampleFormControlInput1" />
          </div>
        </div>
        <div className="col-11">
            <div className="form-group">
              <label for="exampleFormControlInput1">ปริมาณ</label>
              <input onChange={this.amountOnChange} value={this.state.amount} type="text" className="form-control" id="exampleFormControlInput1" />
            </div>
        </div>
        <div className="col-11">
            <div className="form-group">
              <label for="exampleFormControlInput1">หน่วย</label>
              <input type="text" onChange={this.textOnChange} name='unit' value={this.state.unit} className="form-control" id="exampleFormControlInput1" />
            </div>
        </div>
        <div className="col-11 mt-4">
          <button onClick={this.submit} className="btn btn-success">บันทึก</button>
        </div>
      </div>
    )
  }
}

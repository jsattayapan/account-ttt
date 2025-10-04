import React from 'react'
import validator from 'validator'
import {
  getStockItemByStoreId,
  sumitUsedStock,
  submitEquipment,
  getMenuItem,
  submitNewAutoIngredient,
  getAutoStockTransferToMenuByStoreId,
  submitAutoTranfer} from './tunnel'
import Equipment from './store-equipment'
import Select from 'react-select'

export default class StoreManagement extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'รายการของจากจัดซื้อ',
      autoStockTransferToMenuList: []
    }
  }
  changeCurrentPage = page => {
    this.setState(() => ({
      currentPage: page
    }))
  }
  render(){
    return (
      <div className="row">
        <div className="col-12 store-management mb-3">
          <ul>
            <li onClick={() => this.changeCurrentPage('รายการของจากจัดซื้อ')} className={`${this.state.currentPage === 'รายการของจากจัดซื้อ' && 'selected-li'}`}>รายการของจากจัดซื้อ</li>
            <li onClick={() => this.changeCurrentPage('รายการของขายในเมนู')} className={`${this.state.currentPage === 'รายการของขายในเมนู' && 'selected-li'}`}>รายการของขายในเมนู</li>
            <li onClick={() => this.changeCurrentPage('อุปกรณ์')} className={`${this.state.currentPage === 'อุปกรณ์' && 'selected-li'}`}>อุปกรณ์</li>
          </ul>
        </div>
        { this.state.currentPage === 'รายการของจากจัดซื้อ' &&
          <StockFromPurchase user={this.props.user} />
        }
        { this.state.currentPage === 'อุปกรณ์' &&
          <Equipment storeId={this.props.user.storeId} user={this.props.user} />
        }
        { this.state.currentPage === 'รายการของขายในเมนู' &&
          <StockMenu storeId={this.props.user.storeId} user={this.props.user} />
        }
      </div>
    )
  }
}

class StockMenu extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      autoStockTransferToMenuList: [],
      menuList: [],
      stockList: [],
      selectedStockId:'',
      selectedMenuCode: '',
      showAddNew: false,
      quantity: 0
    }
  }
  componentDidMount(){
    getMenuItem(res => {
      if(res.status){
        const menuList = res.menuList.map(x => ({label: x.name, value: x.code}))
        this.setState(() => ({
          menuList
        }))
      }else{
        alert(res.msg)
      }
    })
    getStockItemByStoreId({storeId: this.props.user.storeId}, res => {
      if(res.status){
        this.setState(() => ({
          stockList: res.stockList.map(x => ({label: `${x.name} (${x.unit})`, value: x.id}))
        }))
      }else{
        console.log(res.msg);
      }
    })
    getAutoStockTransferToMenuByStoreId({
      storeId: this.props.user.storeId
    }, res => {
      if(res.status){
        this.setState(() => ({
          autoStockTransferToMenuList: res.autoStockTransferToMenuList
        }))
      }else{
        alert(res.msg)
      }
    })
  }
  stockOnChange = input => {
    this.setState(() => ({
      selectedStockId: input.value
    }))
  }
  menuOnChange = input => {
    this.setState(() => ({
      selectedMenuCode: input.value
    }))
  }
  quantityOnChange = e => {
    const value = e.target.value
    if(validator.isInt(value) || value.trim() === ''){
      this.setState(() => ({
        quantity: value
      }))
    }
  }
  submitNewAutoIngredient = () => {
    const stockId = this.state.selectedStockId
    const menuCode = this.state.selectedMenuCode
    const quantity = this.state.quantity
    if(stockId.trim() === ''){
      alert('กรุณาเลือกรายการของ')
      return
    }
    if(menuCode.trim() === ''){
      alert('กรุณาเลือกเมนู')
      return
    }
    if(quantity.trim() === '' || quantity <= 0){
      alert('กรุณาระบุจำนวนให้ถูกต้อง')
      return
    }
    submitNewAutoIngredient({
      stockId,
      menuCode,
      quantity,
      createBy: this.props.user.username,
      storeId: this.props.storeId
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.toggleAddNew()
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }
  toggleAddNew = () => {
    this.setState(() => ({
      showAddNew: !this.state.showAddNew,
      selectedStockId: '',
      selectedMenuCode: '',
      quantity: 0
    }))
  }
  render(){
    return (
      <div className="col-12">
        <div className="row">
          <div className="col-12">
            <button onClick={this.toggleAddNew} className="btn btn-link">+ เพิ่มรายการใหม่</button>
          </div>
        </div>
        { this.state.showAddNew &&
          <div className="row">
            <div className="col-12 col-md-3">
              <div className="form-group">
                <label>เลือกรายการของ</label>
                <Select onChange={this.stockOnChange} options={this.state.stockList} />
              </div>
            </div>
              <div className="col-12 col-md-3">
                <div className="form-group">
                  <label>เลือกเมนู</label>
                  <Select onChange={this.menuOnChange} options={this.state.menuList} />
                </div>
              </div>
            <div className="col-12 col-md-3">
              <div className="form-group">
                <label>จำนวนของที่แปลงได้</label>
                <input value={this.state.quantity} onChange={this.quantityOnChange} className="form-control" type="text" />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <button onClick={this.submitNewAutoIngredient} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }
        <div className="row">
          <div className="col-12">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>รายการของ</th>
                  <th>เมนูที่แปลงได้</th>
                  <th>จำนวนที่แปลงต่อหน่วย</th>
                  <th>จำนวนคงเหลือ</th>
                </tr>
              </thead>
              <tbody>
                { this.state.autoStockTransferToMenuList.map(x => (
                  <tr>
                    <td>{x.stockName} ({x.stockUnit})</td>
                    <td>{x.menuName}</td>
                    <td>{x.quantity}</td>
                    <td>{x.current_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

class StockFromPurchase extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      stockList: []
    }
  }
  reloadStockList = () => {
    this.componentDidMount()
  }
  componentDidMount(){
    getStockItemByStoreId({storeId: this.props.user.storeId}, res => {
      console.log(res.stockList);
      if(res.status){
        this.setState(() => ({
          stockList: res.stockList.filter(x => x.quantity !== 0)
        }))
      }else{
        console.log(res.msg);
      }
    })
  }
  render(){
    return (
      <div className="col-12">
        <div className="row">
          <div className="col-md-6 col-12">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <td>รายการ</td>
                  <td>หน่วย</td>
                  <td>จำนวน</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.stockList.map(x => (
                    <tr>
                      <td>{x.name}</td>
                      <td>{x.unit}</td>
                      <td>{x.quantity}</td>
                      <StockActions
                        reloadStockList={this.reloadStockList}
                        user={this.props.user}
                        itemId={x.id}
                        quantity={x.quantity}
                        autoTransfer={x.autoTransfer}
                         />
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

class StockActions extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      status: '',
      quantity: 0
    }
  }
  changeStatus = status => {
    this.setState(() => ({
      status,
      quantity: 0
    }))
  }
  quantityOnChange = e => {
    const value = e.target.value
    if(validator.isFloat(value) || value.trim() === ''){
      this.setState(() => ({
        quantity: value
      }))
    }
  }
  sumitUsedStock = () => {
    let quantity = this.state.quantity
    if(quantity.trim() === '' || parseFloat(quantity) === 0){
      alert('กรุณารุะบบจำนวน')
      return
    }
    if(parseFloat(quantity) > this.props.quantity){
      alert('จำนวนของไม่เพียงพอ')
      return
    }
    sumitUsedStock({
      createBy: this.props.user.username,
      storeId: this.props.user.storeId,
      itemId: this.props.itemId,
      quantity
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.changeStatus('')
        this.props.reloadStockList()
      }else{
        alert(res.msg)
      }
    })
  }
  submitEquipment = () => {
    let quantity = this.state.quantity
    if(quantity.trim() === '' || parseFloat(quantity) === 0){
      alert('กรุณารุะบบจำนวน')
      return
    }
    if(parseFloat(quantity) > this.props.quantity){
      alert('จำนวนของไม่เพียงพอ')
      return
    }
    submitEquipment({
      selectedItems: [{itemId: this.props.itemId, quantity: parseInt(quantity)}],
      departmentId: this.props.user.storeId,
      createBy: this.props.user.username
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.changeStatus('')
        this.props.reloadStockList()
      }else{
        alert(res.msg)
      }
    })
  }
  autoTransfer = () => {
    submitAutoTranfer({
      itemId: this.props.itemId,
      storeId: this.props.user.storeId
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.changeStatus('')
        this.props.reloadStockList()
      }else{
        alert(res.msg)
      }
    })
  }
  render(){
    return(
      <td>
        <div className="row">
          {
            this.state.status === '' &&
            <div className="row">
              <div className="col-12 col-md-5 text-center ml-2 mb-2">
                <button onClick={() => this.changeStatus('used')} className="btn btn-success mr-2 mb-2">✅</button>
              </div>
              <div className="col-12 col-md-5 text-center ml-2 mb-2">
                <button onClick={() => this.changeStatus('equipment')} className="btn btn-info mr-2 mb-2">🛠</button>
              </div>
              {this.props.autoTransfer &&
                <div className="col-12 col-md-5 text-center ml-2 mb-2">
                  <button onClick={() => this.autoTransfer()} className="btn btn-dark mr-2 mb-2">🔄</button>
                </div>
              }
            </div>

          }
          {
            this.state.status === 'used' &&
            <div className="row">
              <div className="col-11 ml-2">
                <div className="row">
                  <div className="col-11">
                    <b>ตัดรายการที่ใช้</b>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className='form-group'>
                      <label>จำนวน</label>
                      <input onChange={this.quantityOnChange} value={this.state.quantity} type='text' className="from-control" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-11 text-center mb-2">
                    <button onClick={this.sumitUsedStock} className="btn btn-success">ยืนยัน</button>
                  </div>
                  <div className="col-11 text-center">
                    <button onClick={() => this.changeStatus('')} className="btn btn-danger">ปิด</button>
                  </div>
                </div>

              </div>
            </div>
          }
          {
            this.state.status === 'equipment' &&
            <div className="row">
              <div className="col-11 ml-2">
                <div className="row">
                  <div className="col-11">
                    <b>ย้ายไปเป็นอุปกรณ์</b>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className='form-group'>
                      <label>จำนวน</label>
                      <input onChange={this.quantityOnChange} value={this.state.quantity} type='text' className="from-control" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-11 text-center mb-2">
                    <button onClick={this.submitEquipment} className="btn btn-success">ยืนยัน</button>
                  </div>
                  <div className="col-11 text-center">
                    <button onClick={() => this.changeStatus('')} className="btn btn-danger">ปิด</button>
                  </div>
                </div>

              </div>
            </div>
          }
        </div>
      </td>
    )
  }
}

import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import Select from 'react-select';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import {
  addNewSupplier,
  getSuppliers,
  getSupplierById,
  getConfirmPurchaseById,
  addNewExpenseToSupplier,
  paySupplierCreditToSupplier,
cancelPaymentBySupplier }
  from './tunnel'
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {PurchaseDetail} from './confirm-payment'

export default class Suppliers extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'main',
      supplier: {},
      purchase: {}
    }
  }

  changePage = page => {
    this.setState(() => ({currentPage: page}))
  }

  setSupplier = id => {
    getSupplierById ({id}, res => {
      if(res.status){
        console.log(res.supplier);
        let supplier = res.supplier
        supplier['payments'] = supplier.payments.sort((a, b) => b.timestamp > a.timestamp)
        supplier['expense'] = supplier.expense.sort((a, b) => b.timestamp > a.timestamp)
        this.setState(() => ({
          supplier: res.supplier,
          currentPage: 'showDetail',
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  poClick = id => {
    getConfirmPurchaseById({id}, res => {
      if(res.status){
        console.log(res.purchase);
        this.setState(() => ({
          currentPage: 'showPurchase',
          purchase: res.purchase
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return(
      <div className="mt-3">
        { this.state.currentPage === 'main' && <SupplierList onClick={this.setSupplier} changePage={this.changePage} />}
        { this.state.currentPage === 'showDetail' && <SupplierDetail
          user={this.props.user}
          onClick={this.poClick}
          changePage={this.changePage}
          supplier={this.state.supplier}
          setSupplier={this.setSupplier}
           />}
        {this.state.currentPage === 'showPurchase' &&
          <PurchaseDetail
            setPurchase={purchase => this.setState(() => ({purchase}))}
            purchase={this.state.purchase}
            user={this.props.user}
            backPage={() => this.changePage('showDetail')} />
        }
        {
          this.state.currentPage === 'add-supplier' &&
          <AddSupplier changePage={this.changePage} />
        }
      </div>
    )
  }
}

class SupplierDetail extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      addExpense: false,
      detail: '',
      amount: '',
      type: '',
      reference: '',
      imageFile: '',
      selectedPo: [],
      selectedExpense: [],
    }
  }

  fileOnChange = e => {
    let file = e.target.files[0]
    this.setState(() => ({
      imageFile: file
    }))
  }

  toggleAddExpense = () => {
    this.setState(() => ({addExpense: !this.state.addExpense}))
  }

  valueOnChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(({
      [name]: value
    }))
  }

  paySupplierCredit = () => {

    let purchaseList = this.state.selectedPo
    let expenseList = this.state.selectedExpense
    let sumPaymentAmount = this.state.selectedPo.reduce((total, x) => {
      let found = this.props.supplier.payments.find(y => y.purchaseId === x)
      return total + found.amount
    }, 0) + this.state.selectedExpense.reduce((total, x) => {
      let found = this.props.supplier.expense.find(y => y.id == x)
      return total + found.amount
    }, 0)

    if(purchaseList.length === 0 && expenseList.length === 0){
      alert('กรุณาเลือกรายการที่ต้องการชำระ')
      return
    }

    if(this.state.type === 'บัตรเครติด' && this.state.reference.trim() === ''){
      alert('กรุณาใส่หมายเลขอ้างอิง')
      return
    }

    if(this.state.type === ''){
      alert('กรุณาเลือกวิธีการจ่ายเงิน')
      return
    }

    if((this.state.type === 'โอนเงิน' || this.state.type === 'โอนเงินโดย MD') && this.state.imageFile === ''){
      alert('กรุณาอัพโหลดหลักฐานการโอนเงิน')
      return
    }



    if(window.confirm(`ยืนยันการจ่ายเงิน ${numeral(sumPaymentAmount).format('0,0.00')} บาท`)){
      paySupplierCreditToSupplier({
        amount: sumPaymentAmount ,
        supplierId: this.props.supplier.id,
        type: this.state.type,
        reference: this.state.reference,
        imageFile: this.state.imageFile,
        createBy: this.props.user.username,
        purchaseList,
        expenseList
      }, res => {
        if(res.status){
          alert('ข้อมูลถูกบันทึก')
          this.setState(() => ({
            type: '',
            reference: '',
            imageFile: '',
            selectedPo: [],
            selectedExpense: []
          }))
          this.props.setSupplier(this.props.supplier.id)
        }else{
          alert(res.msg)
        }
      })
    }
  }

  submitNewExpense = () => {
    const amount = parseInt(this.state.amount)
    if(this.state.detail.trim() === ''){
      alert('กรุณาใส่รายละเอียดค่าใช้จ่าย')
      return
    }
    if(isNaN(amount)){
      alert('กรุณาใส่จำนวนเงินเป็นเลข')
    }
    if(amount < 1){
      alert('กรุณาใส่จำนวนเงินที่มากกว่า 0 บาท')
      return
    }

    addNewExpenseToSupplier({
      amount,
      detail: this.state.detail,
      createBy: this.props.user.username,
      creditSupplier: this.props.supplier.id
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึกแล้ว')
        this.setState(() => ({
          addExpense: false,
          detail: '',
          amount: ''
        }))
        this.props.setSupplier(this.props.supplier.id)
      } else {
        alert(res.msg)
      }
    })

  }

  checkboxOnClick = (e) => {
    let checked = e.target.checked
    let id = e.target.name
    let list = this.state.selectedPo
    if(checked){
      list = [ ...list, id]
    }else{
      list = list.filter(x => x !== id)
    }
    this.setState(() => ({
      selectedPo: list,
    }))
  }

  checkboxOnClickExpense = e => {
    let checked = e.target.checked
    let id = e.target.name
    let list = this.state.selectedExpense
    if(checked){
      list = [ ...list, id]
    }else{
      list = list.filter(x => x !== id)
    }
    this.setState(() => ({
      selectedExpense: list,
    }))
  }

  paymentChange = (i) => {
    this.setState(() => ({type: i.value}))
  }


  cancelPaymentBySupplier = id => {
    cancelPaymentBySupplier({purchaseId: id}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.setSupplier(this.props.supplier.id)
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    console.log(this.props.supplier.payments[0]);
    let sumPaymentAmount = this.state.selectedPo.reduce((total, x) => {
      let found = this.props.supplier.payments.find(y => y.purchaseId === x)
      return total + found.amount
    }, 0) + this.state.selectedExpense.reduce((total, x) => {
      let found = this.props.supplier.expense.find(y => y.id == x)
      return total + found.amount
    }, 0)

    return(
      <div>
        <div className="row">
          <div className="col-9">
            <h3><b>{this.props.supplier.name}</b></h3>
          </div>
          <div className="col-3">
            <button onClick={() => this.props.changePage('main')} className="btn btn-danger">กลับ</button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            ที่อยู่: {this.props.supplier.address}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            ตัวแทนขาย: {this.props.supplier.salesPerson}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            เบอร์ติดต่อ: {this.props.supplier.phone} | Email: {this.props.supplier.email || '-'}
          </div>
        </div>
        <div className="row mt-3 mb-3">
          <div className="col-12">
            <button onClick={this.toggleAddExpense} className="btn btn-link">{this.state.addExpense ? '-' : '+'} เพิ่มค่าใช้จ่ายในร้านค้านี้</button>
          </div>
        </div>
        { this.state.addExpense && <div className="row mt-3 mb-3">
          <div className="col-4">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" >รายการ</span>
              </div>
              <input onChange={this.valueOnChange} name="detail" type="text" className="form-control" aria-describedby="basic-addon3" />
            </div>
          </div>
          <div className="col-4">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" >จำนวนเงิน</span>
              </div>
              <input onChange={this.valueOnChange} name="amount" type="text" className="form-control" aria-describedby="basic-addon3" />
            </div>
          </div>
          <div className="col-4">
            <button onClick={this.submitNewExpense} className="btn btn-success">บันทึก</button>
          </div>
        </div>}
        { this.props.supplier.credit !== 0 && <div className="row"><div className="col-12"><div className="row mt-3 mb-3">
          <div className="col-4">
            ยอดค้างชำระทั้งหมด: {numeral(this.props.supplier.credit).format('0,0.00')} บาท
          </div>
          <div className="col-2">
            ยอดที่ต้องการชำระ: {numeral(sumPaymentAmount).format('0,0.00')} บาท
          </div>
          <div className="col-3">
            <Select onChange={this.paymentChange} options={[
                {value:'โอนเงิน', label: 'โอนเงิน'},
                {value:'โอนเงินโดย MD', label: 'โอนเงินโดย MD'},
                {value:'บัตรเครดิต', label: 'บัตรเครดิต'},
                {value:'เงินสด', label: 'เงินสด'}
              ]} />
          </div>
          <div className="col-3">
            <button onClick={this.paySupplierCredit} className="btn btn-success">ชำระยอดที่ค้าง</button>
          </div>
        </div>
        <div className="row mt-3 mb-3">
          <div className="col-6">
          </div>
          { this.state.type === 'บัตรเครดิต' &&
            <div className="col-6">
            <div className="input-group mb-">
              <div className="input-group-prepend">
                <span className="input-group-text" ># อ้างอิง</span>
              </div>
              <input onChange={this.valueOnChange} name="reference" type="text" className="form-control" aria-describedby="basic-addon3" />
            </div>
          </div>
        }
        { (this.state.type === 'โอนเงิน' || this.state.type === 'โอนเงินโดย MD') &&
          <div className="col-6">
          <div className="input-group mb-">
            <div className="input-group-prepend">
              <span className="input-group-text" >หลักฐานการโอนเงิน</span>
            </div>
            <input onChange={this.fileOnChange} type="file" className="form-control" aria-describedby="basic-addon3" />
          </div>
        </div>
      }
        </div>
      </div></div>}
        <div className="row">
          <div className="col-12 col-md-8">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>วันที่</th>
                  <th>เลขใบสั่งซื้อ</th>
                  <th>บันทึกโดย</th>
                  <th>จำนวนเงิน</th>
                  <th>สถานะชำระ</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                {this.props.supplier.payments.sort((y, x) => y.timestamp - x.timestamp).map(x => (
                  <tr className="tr-hover">
                    <td><Checkbox onChange={this.checkboxOnClick} name={x.purchaseId} disabled={x.status !== 'hold'} /></td>
                    <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                    <td onClick={() => this.props.onClick(x.purchaseId)} className="underline-blue">{x.purchaseId}</td>
                    <td>{x.createBy}</td>
                    <td>{numeral(x.amount).format('0,0.00')}.-</td>
                    <td align="center">{x.status === 'hold' ? <FontAwesomeIcon icon={faTimes} color="red" /> : <FontAwesomeIcon icon={faCheck} color="green" />} </td>
                    <td><button onClick={() => this.cancelPaymentBySupplier(x.purchaseId)} className="btn btn-dark" disabled={x.status !== 'hold'} >ยกเลิกจ่าย</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-4 col-12">
            <table className="table">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>รายการ</th>
                  <th>บันทึกโดย</th>
                  <th>จำนวนเงิน</th>
                  <th>สถานะชำระ</th>
                </tr>
              </thead>
              <tbody>
                {this.props.supplier.expense.map(x => (
                  <tr className="tr-hover">
                    <td><input onClick={this.checkboxOnClickExpense} name={x.id} type="checkbox" disabled={x.status !== 'hold'} /></td>
                    <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                    <td>{x.detail}</td>
                    <td>{x.createBy}.-</td>
                    <td>{numeral(x.amount).format('0,0.00')}.-</td>
                    <td align="center">{x.status === 'hold' ? <FontAwesomeIcon icon={faTimes} color="red" /> : <FontAwesomeIcon icon={faCheck} color="green" />} </td>
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

class SupplierList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      suppliers: []
    }
  }

  componentDidMount(){
    getSuppliers(res => {
      if(res.status){
        this.setState(() => ({ suppliers: res.suppliers }))
      }else{
        alert(res.msg)
      }
    })
  }
  render(){
    return(
      <div>
        <div className="row">
        <button onClick={() => this.props.changePage('add-supplier')} className="btn btn-link"><b>+</b> ร้านค้า</button>
        </div>
        <div className="row">
          {this.state.suppliers.map(x => (
            <SupplierBox id={x.id} onClick={this.props.onClick} name={x.name} credit={x.credit} />
          ))}
        </div>
      </div>
    )
  }
}

class AddSupplier extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      name: '',
      address: '',
      salesPerson: '',
      phone: '',
      email: ''
    }
  }

  valueOnChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(({
      [name]: value
    }))
  }

  submitNewSupplier = () => {
    const { name, address, salesPerson, phone, email} = this.state
    if(name.trim() === ''){
      alert('กรุณาใส่ชื่อบริษัท')
      return
    }
    if(address.trim() === ''){
      alert('กรุณาใส่ที่อยู่บริษัท')
      return
    }
    if(salesPerson.trim() === ''){
      alert('กรุณาใส่ชื่อตัวแทนขาย')
      return
    }
    if(phone.trim() === ''){
      alert('กรุณาใส่เบอร์ติดต่อ')
      return
    }
    addNewSupplier({ name, address, salesPerson, phone, email}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.changePage('main')
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return(
      <div>
        <div className="row">
          <div className="col-8">
            <h3>เพิ่มร้านค้า</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" >ชื่อบริษัท</span>
              </div>
              <input onChange={this.valueOnChange} name="name" type="text" className="form-control" aria-describedby="basic-addon3" />
            </div>

          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">ที่อยู่</span>
              </div>
              <textarea onChange={this.valueOnChange} name="address" className="form-control" aria-label="With textarea"></textarea>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" >ตัวแทนขาย</span>
              </div>
              <input onChange={this.valueOnChange} name="salesPerson" type="text" className="form-control" aria-describedby="basic-addon3" />
            </div>

          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" >เบอร์ติดต่อ</span>
              </div>
              <input onChange={this.valueOnChange} name="phone" type="text" className="form-control" aria-describedby="basic-addon3" />
            </div>

          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" >Email</span>
              </div>
              <input onChange={this.valueOnChange} name="email" type="text" className="form-control" aria-describedby="basic-addon3" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <button onClick={this.submitNewSupplier} className="btn btn-success mr-3">บันทึก</button>
            <button onClick={() => this.props.changePage('main')} className="btn btn-danger mr-3">กลับ</button>
          </div>
        </div>
      </div>
    )
  }
}

const SupplierBox = props => {
  return (
    <div onClick={() => props.onClick(props.id)} className="supplierBox col-3">
      <div className="row"><div className='col-12'>{props.name}</div></div>
      <div className="row"><div className='col-12'>ยอดค้างชำระ: {numeral(props.credit).format('0,0.00')} บาท</div></div>
    </div>
  )
}

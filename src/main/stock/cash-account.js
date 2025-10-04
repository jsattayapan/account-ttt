import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import validator from 'validator'
import { faCashRegister, faMoneyBillWave, faUserShield, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IP } from './../../constanst'

import { submitCashSale,
  getAccountBalance,
  submitTransferFromSaleCashToAccountCash,
  submitTransferToMDAccount,
  submitTransferFromMDAccount,
  getAccountHistrory } from './tunnel'

export default class CashAccount extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      accountCashHistrory: [],
      saleCashHistrory: [],
      subPage: '',
      saleCash: 0,
      accountCash: 0
    }
  }
  componentDidMount(){
    getAccountBalance(res => {
      if(res.status){
        this.setState(() => ({
          saleCash: res.saleCash.amount,
          accountCash: res.accountCash.amount
        }))
      }else{
        alert(res.msg)
      }
    })
    getAccountHistrory({ date: new Date() }, res => {
      if(res.status){
        this.setState(() => ({
          saleCashHistrory: res.saleCash,
          accountCashHistrory: res.accountCash
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  subPageChange = page => {
    this.setState(() => ({subPage: page}))
  }
  closeSubPage = () => {
    this.setState(() => ({subPage: ''}))
    this.componentDidMount()
  }
  render(){
    return(
      <div>
        <div className="row mt-3 ml-3">
          <div className="col-3">
            <div className="row">
              <div className="col-12">
                รายได้เงินสด
              </div>
              <div className="col-12">
                <h3>{numeral(this.state.saleCash).format('0,0.00')} บาท</h3>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="row">
              <div className="col-12">
                บัญชีเงินสด
              </div>
              <div className="col-12">
                <h3>{numeral(this.state.accountCash).format('0,0.00')} บาท</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3 mx-2">
          <div className="col-12">
            <div className="row">
              <div onClick={() => this.subPageChange('บันทึกยอดรับเงินสดรายวัน')} className={`col-3 text-center ${this.state.subPage === 'บันทึกยอดรับเงินสดรายวัน' ? 'subPage-select' : 'subPage'}`}>
                <div className="row mb-2">
                  <div className="col-12 text-center">
                    บันทึกยอดรับเงินสดรายวัน
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 text-center">
                    <FontAwesomeIcon icon={faCashRegister} size='3x' />
                  </div>
                </div>
              </div>
              <div onClick={() => this.subPageChange('โอนรายได้เงินสดเข้าบัญชีเงินสด')} className={`col-3 text-center ${this.state.subPage === 'โอนรายได้เงินสดเข้าบัญชีเงินสด' ? 'subPage-select' : 'subPage'}`}>
                <div className="row mb-2">
                  <div className="col-12 text-center">
                    รายได้เงินสด &rarr; บัญชีเงินสด
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 text-center">
                    <FontAwesomeIcon icon={faMoneyBillWave} size='3x' />
                  </div>
                </div>
              </div>
              <div onClick={() => this.subPageChange('โอนรายได้เงินสดเข้าบัญชี MD')} className={`col-3 text-center ${this.state.subPage === 'โอนรายได้เงินสดเข้าบัญชี MD' ? 'subPage-select' : 'subPage'}`}>

                <div className="row mb-2">
                  <div className="col-12 text-center">
                    รายได้เงินสด &rarr; บัญชี MD
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 text-center">
                    <FontAwesomeIcon icon={faUserShield} size='3x' />
                  </div>
                </div>
              </div>
              <div onClick={() => this.subPageChange('รับโอนเงินจาก MD เข้าบัญชีเงินสด')} className={`col-3 text-center ${this.state.subPage === 'รับโอนเงินจาก MD เข้าบัญชีเงินสด' ? 'subPage-select' : 'subPage'}`}>
                <div className="row mb-2">
                  <div className="col-12 text-center">
                    บัญชี MD &rarr; บัญชีเงินสด
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 text-center">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} size='3x' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        { this.state.subPage === 'บันทึกยอดรับเงินสดรายวัน' && <CashSaleDaily
          closeSubPage={this.closeSubPage}
          user={this.props.user}
          /> }
        { this.state.subPage === 'โอนรายได้เงินสดเข้าบัญชีเงินสด' && <TransferToAccountCash
          closeSubPage={this.closeSubPage}
          user={this.props.user}
          saleCash={this.state.saleCash}
          /> }
          { this.state.subPage === 'โอนรายได้เงินสดเข้าบัญชี MD' && <TransferToMDAccount
            closeSubPage={this.closeSubPage}
            user={this.props.user}
            saleCash={this.state.saleCash}
            /> }
          { this.state.subPage === 'รับโอนเงินจาก MD เข้าบัญชีเงินสด' && <TransferFromMDAccount
            closeSubPage={this.closeSubPage}
            user={this.props.user}
            /> }

        <div className="row mt-3">
          <div className="col-6">
            <div className="row">
              <div className="col-12">
                <h3>ประวัติรายรับเงินสด</h3>
              </div>
              <div className="col-12">
                <table className="table table-dark">
                  <thead>
                    <tr>
                      <th>วันที่</th>
                      <th>รายการ</th>
                      <th>จำนวนเงิน</th>
                      <th>โดย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.saleCashHistrory.length !== 0 ?
                      this.state.saleCashHistrory.map(x =>
                        <tr>
                          <td>{x.date}</td>
                          <td>{x.detail} {x.filename !== null && <a href={IP +'/public/transactions/'+ x.filename} target="_blank" download>ดูไฟล์</a> }</td>
                          <td style={{color: x.type === 'in' ? '#00ff0c' : '#ff4242'}}>{numeral(x.amount).format('0,0.00')}</td>
                          <td>{x.createBy}<br/>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                        </tr>
                      ):
                      <tr>
                        <td colSpan="4">ไม่พบรายการ</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-12">
                <h3>ประวัติบัญชีเงินสด</h3>
              </div>
              <div className="col-12">
                <table className="table table-dark">
                  <thead>
                    <tr>
                      <th>วันที่</th>
                      <th>รายการ</th>
                      <th>จำนวนเงิน</th>
                      <th>โดย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.accountCashHistrory.length !== 0 ?
                      this.state.accountCashHistrory.map(x =>
                        <tr>
                          <td>{x.date}</td>
                          <td>{x.detail} {x.filename !== null && <a href={IP +'/public/transactions/'+ x.filename} target="_blank" download>ดูไฟล์</a> }</td>
                          <td style={{color: x.type === 'in' ? '#00ff0c' : '#ff4242'}}>{numeral(x.amount).format('0,0.00')}</td>
                          <td>{x.createBy}<br/>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                        </tr>
                      ):
                      <tr>
                        <td colSpan="4">ไม่พบรายการ</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class CashSaleDaily extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      date: '',
      avataraSale: 0,
      samedPavilionSale: 0,
      lazySandalsSale: 0,
      otherSale: 0,
      samedPavilionRestaurantSale: 0
    }
  }

  onValueChange = e => {
    let value = e.target.value
    let id = e.target.id
    if(value.trim() === '' || validator.isFloat(value)){
      this.setState(() => ({
        [id]: value
      }))
    }
  }

  onDateChange = e => {
    let value = e.target.value
    this.setState(() => ({
      date: value
    }))
  }

  onSubmitCashSale = () => {
    let date = this.state.date
    let avataraSale = this.state.avataraSale
    let samedPavilionSale = this.state.samedPavilionSale
    let lazySandalsSale = this.state.lazySandalsSale
    let otherSale = this.state.otherSale
    let samedPavilionRestaurantSale = this.state.samedPavilionRestaurantSale
    if(avataraSale === '' || samedPavilionSale === '' || lazySandalsSale === '' || otherSale === '' || samedPavilionRestaurantSale === ''){
      alert('กรุณาใส่ข้อมูลรายรับให้ครบ')
      return
    }
    if(date === ''){
      alert('กรุณาระบุวันที่')
      return
    }
    submitCashSale({
      createBy: this.props.user.username,
      date,
      avataraSale,
      samedPavilionSale,
      lazySandalsSale,
      otherSale,
      samedPavilionRestaurantSale
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.closeSubPage()
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return (
      <div className="row mt-3">
        <div className="col-4">
          <div className="form-group">
            <label>วันที่</label>
            <input onChange={this.onDateChange} value={this.state.date} className="form-control" type="date" />
          </div>
        </div>
        <div className="col-6">
          <div className="row mb-2">
            <div className="col-4">
              รายรับเงินสด Avatara
            </div>
            <div className="col-4">
              <input onChange={this.onValueChange} id='avataraSale' value={this.state.avataraSale} type="text" />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-4">
              รายรับเงินสด Samed Pavilion
            </div>
            <div className="col-4">
              <input onChange={this.onValueChange} id='samedPavilionSale' value={this.state.samedPavilionSale} type="text" />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-4">
              รายรับเงินสด ร้านอาหาร Samed Pavilion
            </div>
            <div className="col-4">
              <input onChange={this.onValueChange} id='samedPavilionRestaurantSale' value={this.state.samedPavilionRestaurantSale} type="text" />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-4">
              รายรับเงินสด Lazy Sandals
            </div>
            <div className="col-4">
              <input onChange={this.onValueChange} id='lazySandalsSale' value={this.state.lazySandalsSale} type="text" />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-4">
              รายรับเงินสด อื่นๆ
            </div>
            <div className="col-4">
              <input onChange={this.onValueChange} id='otherSale' value={this.state.otherSale} type="text" />
            </div>
          </div>
        </div>
        <div className="col-2">
          <div className="row">
            <div className="col-12 mb-3">
              <button onClick={this.onSubmitCashSale} className="btn btn-success">บันทึก</button>
            </div>
            <div className="col-12">
              <button onClick={this.props.closeSubPage} className="btn btn-danger">ปิด</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class TransferToAccountCash extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      amount: 0
    }
  }

  onAmountChange = e => {
    let value = e.target.value
    if(value === ''|| validator.isFloat(value)){
      this.setState(() => ({
        amount: value
      }))
    }
  }

  onSubmitTransfer = () => {
    let amount = this.state.amount
    let saleCash = this.props.saleCash

    if(amount === ''){
      alert('กรุณาใส่จำนวนเงิน')
      return
    }

    if(parseFloat(saleCash) < parseFloat(amount)){
      alert('ยอดเงินไม่เพียงพอในการโอน')
      return
    }

    submitTransferFromSaleCashToAccountCash({
      createBy: this.props.user.username,
      amount
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบัรทึก')
        this.props.closeSubPage()
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return(
      <div className="row mt-3">
        <div className="col-4">
          <div className="form-group">
            <label>จำนวนเงิน</label>
            <input onChange={this.onAmountChange} value={this.state.amount} className="form-control" type='text' />
          </div>
          </div>
          <div className="col-2">
            <button onClick={this.onSubmitTransfer} className="btn btn-success">บันทึก</button>
          </div>
          <div className="col-2">
            <button onClick={this.props.closeSubPage} className="btn btn-danger">ปิด</button>
          </div>
      </div>
    )
  }
}

class TransferToMDAccount extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      amount:0,
      imageFile: ''
    }
  }

  onValueChange = e => {
    let value = e.target.value
    if(validator.isFloat(value) || value === ''){
      this.setState(() => ({
        amount: value
      }))
    }
  }

  onSubmitTransfer = () => {
    let amount = this.state.amount
    let imageFile = this.state.imageFile
    let saleCash = this.props.saleCash
    if(amount === ''){
      alert('กรุณาใส่จำนวนเงิน')
      return
    }
    if(parseFloat(amount) <= 0){
      alert('กรุณาใส่จำนวนเงินให้ถูกต้อง')
      return
    }
    if(imageFile === ''){
      alert('กรุณาอัพโหลดหลักฐานการโอนเงิน')
      return
    }

    if(parseFloat(saleCash) < parseFloat(amount)){
      alert('ยอดเงินไม่เพียงพอในการโอน')
      return
    }

    submitTransferToMDAccount({
      amount,
      imageFile,
      createBy: this.props.user.username
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.closeSubPage()
      }else{
        alert(res.msg)
      }
    })
  }

  fileOnChange = e => {
    let file = e.target.files[0]
    this.setState(() => ({
      imageFile: file
    }))
  }


  render(){
    return(
      <div className="row mt-3">
        <div className="col-4">
          <div className="form-group">
            <label>จำนวนเงิน</label>
            <input onChange={this.onValueChange} value={this.state.amount} className="form-control" type='text' />
          </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <label>หลักฐานการโอนเงิน</label>
            <input onChange={this.fileOnChange} className="form-control" type='file' />
          </div>
        </div>
        <div className="col-2">
          <button onClick={this.onSubmitTransfer} className="btn btn-success">บันทึก</button>
        </div>
        <div className="col-2">
          <button onClick={this.props.closeSubPage} className="btn btn-danger">ปิด</button>
        </div>
      </div>
    )
  }
}

class TransferFromMDAccount extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      amount:0,
      imageFile: ''
    }
  }

  onValueChange = e => {
    let value = e.target.value
    if(validator.isFloat(value) || value === ''){
      this.setState(() => ({
        amount: value
      }))
    }
  }

  onSubmitTransfer = () => {
    let amount = this.state.amount
    let imageFile = this.state.imageFile
    if(amount === ''){
      alert('กรุณาใส่จำนวนเงิน')
      return
    }
    if(parseFloat(amount) <= 0){
      alert('กรุณาใส่จำนวนเงินให้ถูกต้อง')
      return
    }
    if(imageFile === ''){
      alert('กรุณาอัพโหลดหลักฐานการโอนเงิน')
      return
    }

    submitTransferFromMDAccount({
      amount,
      imageFile,
      createBy: this.props.user.username
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.closeSubPage()
      }else{
        alert(res.msg)
      }
    })
  }

  fileOnChange = e => {
    let file = e.target.files[0]
    this.setState(() => ({
      imageFile: file
    }))
  }


  render(){
    return(
      <div className="row mt-3">
        <div className="col-4">
          <div className="form-group">
            <label>จำนวนเงิน</label>
            <input onChange={this.onValueChange} value={this.state.amount} className="form-control" type='text' />
          </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <label>หลักฐานการโอนเงิน</label>
            <input onChange={this.fileOnChange} className="form-control" type='file' />
          </div>
        </div>
        <div className="col-2">
          <button onClick={this.onSubmitTransfer} className="btn btn-success">บันทึก</button>
        </div>
        <div className="col-2">
          <button onClick={this.props.closeSubPage} className="btn btn-danger">ปิด</button>
        </div>
      </div>
    )
  }
}

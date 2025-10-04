import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import Select from 'react-select';
import validator from 'validator';
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2'
import {
  getEmployeeAccountById,
  submitEmployeeAccount,
  deleteEmployeeAccount
} from './tunnel'

export default class AccountSection extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      accountList:[],
      showAccountForm: false,
      displayMonth: new Date(),
      month: new Date(),
      amount: '',
      amountPerMonth: '',
      remark: '',
      type: ''
    }
  }

  componentDidMount(){
    getEmployeeAccountById({employeeId: this.props.employeeId, month: this.state.displayMonth, type: 'manager'}, res => {
      console.log(res);
      if(res.status){
        this.setState(() => ({
          accountList: res.accountList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  toggleAccountForm = () => {
    this.setState(() => ({
      showAccountForm: !this.state.showAccountForm
    }))
  }

  setMonth = month => {
    this.setState(() => ({
      month
    }))
  }

  setDisplayMonth = displayMonth => {
    this.setState(() => ({displayMonth}), () => {
      this.componentDidMount();
    })
  }

  onAmountChange = e => {
    const value = e.target.value
    if(validator.isFloat(value) || value === ''){
      this.setState(() => ({
        amount: value
      }))
    }
  }



  onAmountPerMonthChange = e => {
    const value = e.target.value
    if(validator.isFloat(value) || value === ''){
      this.setState(() => ({
        amountPerMonth: value
      }))
    }
  }

  onRemarkChange = e => {
    const value = e.target.value
    this.setState(() => ({
      remark: value
    }))
  }

  optionOnChange = input => {
    this.setState(() => ({
      type: input.value
    }))
  }

  submitAccount = () => {
    const amount = this.state.amount
    const amountPerMonth = this.state.amountPerMonth
    const remark = this.state.remark
    const month = new Date(this.state.month)
    const type = this.state.type
    const date = new Date()
    const day = date.getDate()
    const fomatMonth = month.getMonth()
    if(amount === '' || amount <= 0){
      alert('กรุณาใส่จำนวนเงินที่มากกว่า 0')
      return
    }
    if(remark.trim() === ''){
      alert('กรุณาใส่หมายเหตุ')
      return
    }
    if(type === ''){
      alert('กรุณาเลือกประเภท')
      return
    }
    // if(month.getMonth() < date.getMonth()){
    //   alert('กรุณาเลือกรอบเดือนที่ไม่น้อยกว่าปัจจุบัน')
    //   return
    // }
    if(month.getMonth() === date.getMonth()){
      if(date.getDate() > 25){
        alert('ไม่สามารถเลือกรอบเดือนนี้ได้เนื่องจากวันที่เกินวันที่ 20 แล้ว')
        return
      }
    }
    submitEmployeeAccount({
      amount,
      amountPerMonth,
      remark,
      type,
      employeeId: this.props.employeeId,
      month,
      username: this.props.user.username
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.componentDidMount();
      }else{
        alert(res.msg)
      }
    })
  }


  deleteEmployeeAccount = (accountDetail) => {
    Swal.fire({
      title: `ต้องการลบ ${accountDetail.remark}`,
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deleteEmployeeAccount({
          employeeId:this.props.employeeId,
          remark: accountDetail.remark,
          timestamp: accountDetail.timestamp,
          amount: accountDetail.amount,
          type: accountDetail.type,
          month: accountDetail.month
        }, res => {
          if(res.status){
            this.componentDidMount()
            Swal.fire('ข้อมูลถูกลบแล้ว', '', 'success')
          }else{
            Swal.fire(res.msg, '', 'error')
          }
        })
      }
    })
  }

  render(){
    
    let typeOptions = [{label: 'เงินหัก', value: 'เงินหัก'}, {label: 'เงินแบ่งหัก', value: 'เงินแบ่งหัก'}]
    typeOptions = this.props.user.username  === 'olotem321' ? [...typeOptions, {label: 'เงินได้', value: 'เงินได้'}] : typeOptions

    let titleList = this.state.type === 'เงินแบ่งหัก' ?
    {
      startMonth: 'เริ่มรอบเดือน',
      amount: 'จำนวนเงินเต็ม'
    } :
    {
      startMonth: 'รอบเงินเดือน',
      amount: 'จำนวนเงิน'
    }


    return (
      <div className="col-12">
        <div className="row">
          

          <div className="col-4">
            <button onClick={this.toggleAccountForm} className="btn btn-link">+ เพิ่มเงินได้ / เงินหัก</button>
          </div>

        </div>
        {
          this.state.showAccountForm &&
          <div className="row">
            <div className="col-3">
              <div className="form-group">
                <label for="exampleFormControlInput1">ประเภท</label>
              <Select onChange={this.optionOnChange} options={typeOptions} />
              </div>
            </div>
            <div className="col-3">
              <div className="form-group">
                <label for="exampleFormControlInput1">{titleList.startMonth}</label>
                  <DatePicker
                    selected={this.state.month}
                    onChange={date => this.setMonth(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                  />
              </div>
            </div>
            { this.state.type === 'เงินแบ่งหัก' && <div className="col-3">
              <div className="form-group">
                <label for="exampleFormControlInput1">จำนวนเงินหักต่อเดือน</label>
              <input type="text" className="form-control" value={this.state.amountPerMonth} onChange={this.onAmountPerMonthChange} />
              </div>
            </div>}
            <div className="col-3">
              <div className="form-group">
                <label for="exampleFormControlInput1">{titleList.amount}</label>
              <input type="text" className="form-control" value={this.state.amount} onChange={this.onAmountChange} />
              </div>
            </div>
            <div className="col-3">
              <div className="form-group">
                <label for="exampleFormControlInput1">หมายเหตุ</label>
              <input type="text" className="form-control" value={this.state.remark} onChange={this.onRemarkChange} />
              </div>
            </div>
            <div className="col-3">
              <button onClick={this.submitAccount} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }
        <div className="row">
          <hr />
        <div className="col-12 col-md-6 my-2">
            <label className="pr-2">เดือน: </label>
              <DatePicker
                selected={this.state.displayMonth}
                onChange={date => this.setDisplayMonth(date)}
                dateFormat="MMM/yyyy"
                showMonthYearPicker
                className="form-control"
              />
          </div>

          <div className="col-12">
            <table className="table table-dark">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>รายการ</th>
                  <th>จำนวนเงิน</th>
                  <th>ประเภท</th>
                  <th>รอบเดือน</th>
                  <th>บันทึกโดย</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.accountList.length !== 0 ?
                  this.state.accountList.sort((x,y) => moment(y.timestamp) - moment(x.timestamp)).map(x => (
                    <tr>
                      <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                      <td>{x.remark}</td>
                      <td>{numeral(x.amount).format('0,0.00')}</td>
                      <td>{x.type}</td>
                      <td>{moment(x.month).format('MM/YYYY')}</td>
                      <td>{x.createBy} {this.props.user.username === 'olotem321' && <button className="btn btn-danger" onClick={() => this.deleteEmployeeAccount(x)}>x</button>}</td>
                    </tr>
                  ))
                  :
                  <tr>
                    <td colSpan="6">ไม่พบข้อมูล</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

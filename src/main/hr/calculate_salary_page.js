import React from 'react'
import ReactDOMServer from 'react-dom/server'
import numeral from 'numeral'
import { getWorkingXSalaryByMonth, saveEmployeeSalaryPayment, showPrintReceipt, clearSalary,getSalarySummary } from './tunnel'
import Switch from "react-switch";
import moment from 'moment'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class CalculateSalaryPage extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      employeeList: [],
      monthYear: new Date()
    }
  }

  componentDidMount(){
    getWorkingXSalaryByMonth({departmentId: '', month: this.state.monthYear }, res => {
      if(res.status){
        let employeeList = res.payload
        this.setState(() => ({
          employeeList
        }))
      }
    })
  }

  showPrintReceipt = (employee, monthYearDisplay) => {
    showPrintReceipt({employeeId: employee.id, month: this.state.monthYear}, res => {
      if(res.status){
        window.open(res.uri)
      }else{
        alert(res.msg)
      }
    })
  }

  showSalaryReportByMonth = () => {
    getSalarySummary({month: this.state.monthYear}, res => {
      if(res.status){
        window.open(res.uri)
      }else{
        alert(res.msg)
      }
    })
  }

  clearSalary = (employee) => {
    let id = employee.id
    let month = this.state.monthYear
    clearSalary({employeeId: id, monthYear: moment(month).format('MM/YYYY')}, res => {
      if(res.status){
        alert('Success')
        this.componentDidMount()
      } else {
        alert(res.msg)
      }
    })
  }

  changeDate = status => {
    let date = this.state.monthYear
    let newDate
    if(status){
      newDate = new Date(date.getFullYear(), date.getMonth()+ 1)
    }else{
      newDate = new Date(date.getFullYear(), date.getMonth() - 1)
    }
    getWorkingXSalaryByMonth({departmentId: '', month: newDate }, res => {
      if(res.status){
        console.log(res);
        let employeeList = res.payload
        this.setState(() => ({
          employeeList,
          monthYear: newDate
        }))
      }
    })
  }

  changeDateByCalender = date => {
    let newDate = new Date(date)
    getWorkingXSalaryByMonth({departmentId: '', month: newDate }, res => {
      if(res.status){
        let employeeList = res.payload
        this.setState(() => ({
          employeeList,
          monthYear: newDate
        }))
      }
    })
  }

  render() {
    let activeEmployee = this.state.employeeList.reduce((total, emp) => {
      if(emp.salaryReceipt){
        if(emp.salaryReceipt.earning !== null || emp.salaryReceipt.compensation !== 0){
          return total + 1
        }
      }
      return total
    }, 0)
    const totalSalaries = this.state.employeeList.reduce((total, emp) => {
      if(emp.salaryReceipt){
        if(emp.salaryReceipt.earning !== null){
          return total + emp.salaryReceipt.earning + emp.salaryReceipt.compensation
        }
      }
      return total
    }, 0)
    const preSalary = this.state.employeeList.reduce((total, emp) => {
      if(typeof emp.earning === 'number'){
          return total + emp.earning
      }
      return total
    }, 0)

    let sumSalaryByDepartment = this.state.employeeList.reduce((list, emp) => {

      if(emp.salaryReceipt){
        let total = emp.salaryReceipt.compensation + emp.salaryReceipt.earning - emp.salaryReceipt.socialSecurity
        for(const account of emp.account){
          if(account.type === 'เงินหัก'){
            total = total - account.amount
          }else{
            total = total + account.amount
          }
        }
        let found = list.filter(x =>  x.deptName === emp.departmentName)
        if(found.length === 0){
          list = [ ...list, {deptName: emp.departmentName, total}]
        }else{
          list = list.filter(x =>  x.deptName !== emp.departmentName)
          list = [ ...list, {deptName: emp.departmentName, total: total + found[0].total}]
        }
      }
      return list
    }, [])

    console.log(sumSalaryByDepartment);

    return (
      <div className="row">
        <div className="col-12">
          <div className="row mb-3">
            <div className="col-3 text-right">
              <button onClick={() => this.changeDate(false)} className="btn btn-warning">&larr;</button>
            </div>
            <div className="col-3 text-center">
              <DatePicker
                className="mr-5"
                selected={this.state.monthYear}
                onChange={date => this.changeDateByCalender(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
              <button className="btn btn-dark">{moment(this.state.monthYear).format('MMM/YYYY')}</button>
            </div>
            <div className="col-3">
              <button onClick={() => this.changeDate(true)}  className="btn btn-warning">&rarr;</button>
            </div>
            <div className="col-3 text-right">
              <button onClick={this.showSalaryReportByMonth}  className="btn btn-info">Print Receipts</button>
            </div>
          </div>
        </div>
        <div className="col-12">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>แผนก</th>
                <th>รวมเงินเดือน</th>
              </tr>
            </thead>
            <tbody>
              {
                sumSalaryByDepartment.map(x => (
                  <tr>
                    <td>{x.deptName}</td>
                    <td>{numeral(x.total).format('0,0')}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="col-12">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ชื่อ</th>
                <th>ยอดรวม ({activeEmployee}): {numeral(totalSalaries).format('0,0')} ({numeral(preSalary).format('0,0')})</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.employeeList.map(x => {

                  let socialSecurity = x.earning*0.025
                  let total = 0
                  if(this.state.checked){
                    total = x.earning - socialSecurity
                  }else{
                    total = x.earning
                  }

                  let subTotalMinutes = x.workingMinutes
                  let remainLateMinutes = 0
                  const lateMinutes = x.lateMinutes * -1
                  if(lateMinutes < 60){
                    subTotalMinutes += lateMinutes
                  }else{
                    remainLateMinutes = lateMinutes - 60
                    subTotalMinutes = subTotalMinutes + 60 - (remainLateMinutes * 2)
                  }

                  return (
                    <tr>
                      <td>
                        <div className="col-12">
                          {x.id} - {x.name}
                        </div>
                        <div className="col-12">
                          {x.role}
                        </div>
                      </td>

                      {
                        x.salaryReceipt === null ?
                        <ManualPaidForm reloadList={() => this.componentDidMount()} employeeId={x.id} monthYear={moment(this.state.monthYear).format('MMM/YYYY')} emp={x} secialSecurity={socialSecurity} monthYear={this.state.monthYear} />
                        :
                        <DisplayPaymentReceipt clearSalary={() => this.clearSalary(x)} showPrintReceipt={() => this.showPrintReceipt(x, moment(this.state.monthYear).format('MMM - YYYY'))} account={x.account} receipt={x.salaryReceipt} />
                    }
                    </tr>
                  )
                }
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}


const DisplayPaymentReceipt = props => {
  const receipt = props.receipt
  const style = props.style
  let total = receipt.compensation + receipt.earning - receipt.socialSecurity
  for(const account of props.account){
    if(account.type === 'เงินหัก'){
      total = total - account.amount
    }else{
      total = total + account.amount
    }
  }
  return (
    <td style={style}>
      <div className="col-12 text-right mt-2">
        เวลาทำงาน: {minutesToDisplay(receipt.workingMinutes)} นาที
      </div>
      <div className="col-12 text-right">
        รายรับ: {numeral(receipt.earning).format('0,0')} บาท
      </div>
        { receipt.socialSecurity ? <div className="col-12 text-right">
          ประกันสังคม: - {numeral(receipt.socialSecurity).format('0,0')} บาท
        </div> : ''}
        { receipt.compensation ? <div className="col-12 text-right">
          เงินชดเชย: + {numeral(receipt.compensation).format('0,0')} บาท
        </div> : ''}
        {
          props.account.map(x => (
            <div style={{color: x.type === 'เงินหัก' ? 'red' : 'green' }} className="col-12 text-right">
              {x.remark}:{x.type === 'เงินหัก' ? '-' : '+' } {numeral(x.amount).format('0,0')} บาท
            </div>
          ))
        }
        <div className="col-12 text-right mb-2">
          สรุปยอด: + {numeral(total).format('0,0')} บาท
        </div>

         <div className="col-12 text-center mb-2">
          <button onClick={props.showPrintReceipt} className="btn btn-info">พิมพ์ใบเสร็จเงินเดือน</button>
        </div>
        <div className="col-12 text-center mb-2">
          <button onClick={props.clearSalary} className="btn btn-danger">Clear</button>
        </div>
    </td>
  )
}

class ManualPaidForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      workingMinutes: this.props.emp.workingMinutes,
      checked: this.props.emp.paidSocialSecurity,
      compensation: 0
    }
  }
  handleChange = (e) => {
    this.setState(() => ({
      checked: e
    }))
  }

  compensationOnchange = e => {
    const value = e.target.value
    this.setState(() => ({
      compensation: isNaN(parseInt(value)) ? 0 : parseInt(value)
    }))
  }

  workingMinutesOnChange = e => {
    const value = e.target.value
    this.setState(() => ({
      workingMinutes: isNaN(parseInt(value)) ? 0 : parseInt(value)
    }))
  }

  saveEmployeeSalaryPayment = ({earning, socialSecurity, compensation, socialSecurityChecked}) => {
    const { monthYear, employeeId } = this.props
    if(!socialSecurityChecked){
      socialSecurity = 0
    }
    saveEmployeeSalaryPayment({monthYear, employeeId, socialSecurity, earning, compensation, workingMinutes: this.state.workingMinutes}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.reloadList()
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    const normalRate = this.props.emp.salary / 26 / 10 / 60
    const overTimeRate = this.props.emp.salary / 30 / 10 / 60
    let earning = Math.ceil(normalRate * this.state.workingMinutes)
    if(this.state.workingMinutes > 15600){
      earning = Math.ceil((15600 * normalRate) + ((this.state.workingMinutes - 15600) * overTimeRate))
    }
    const socialSecurityPercentage = 0.05;
    let socialSecurity = Math.ceil(earning*socialSecurityPercentage)
    if(socialSecurity > (15000*socialSecurityPercentage)){
      socialSecurity = 15000*socialSecurityPercentage
    }
    let total = earning + this.state.compensation
    if(this.state.checked){
      total = total - socialSecurity
    }
    for(const account of this.props.emp.account){
      if(account.type === 'เงินหัก'){
        total = total - account.amount
      }else{
        total = total + account.amount
      }
    }

    return (
      <td>

        <div className="col-12 text-left">
          <label>
            <Switch onChange={this.handleChange} checked={this.state.checked} />
            <span>จ่ายประกันสังคม </span>
          </label>
        </div>
        <div className="col-12 text-left">
          <label className="label-control">ทำงาน (นาที): </label>
          <input className="form-control" onChange={this.workingMinutesOnChange} value={this.state.workingMinutes} />
        </div>
        <div className="col-12 text-left">
          <label className="label-control">เงินชดเชย (บาท): </label>
          <input className="form-control" onChange={this.compensationOnchange} value={this.state.compensation} />
        </div>
        <hr />
        <div className="col-12 text-right">
          <ul>
            <li><label className="label-control">รายรับ (บาท):+ {numeral(earning).format('0,0')} บาท</label></li>
            {
              this.state.checked &&
              <li><label className="label-control">ประกันสังคม (บาท):- {numeral(socialSecurity).format('0,0')} บาท</label></li>
            }
            {
              this.props.emp.account.map(x =>
                <li><label className="label-control">{x.remark}:{x.type === 'เงินหัก' ? '-' : '+' } {numeral(x.amount).format('0,0')} บาท</label></li>
              )
            }
          </ul>
        </div>
        <hr />
          <div className="col-12 text-left">
            <label className="label-control">ยอดคงได้รับ: {numeral(total).format('0,0')} บาท</label>
          </div>
        <hr />
        <div className="col-12 text-center">
          <button onClick={() => this.saveEmployeeSalaryPayment({ earning,
               socialSecurity,
                compensation: this.state.compensation,
                socialSecurityChecked: this.state.checked
                })} className="btn btn-success btn-block">บันทึก</button>
        </div>
      </td>
    )
  }
}

class SubmitSalaryPaidForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      checked: false
    }
  }

  handleChange = (e) => {
    this.setState(() => ({
      checked: e
    }))
  }

  render(){
    const { earning, socialSecurity, total } = this.props
    return (
      <td>
        <div className="col-12 text-right">
          <label>
            <span>จ่ายประกันสังคม </span>
            <Switch onChange={this.handleChange} checked={this.state.checked} />
          </label>
        </div>
        <div className="col-12 text-right">
          รายรับ: {numeral(earning).format('0,0')} บาท
        </div>
        {this.state.checked && <div className="col-12 text-right">
          ประกันสังคม (5%): - {numeral(socialSecurity).format('0,0')} บาท
        </div>}
        <hr />
          <div className="col-12 text-right">
            ยอดสรุป: {numeral(total).format('0,0')} บาท
          </div>
          { earning === 'ไม่พบข้อมูลเงินเดือน' && <div className="col-12 text-right" style={{color:'red'}}>
            * ไม่พบหมายฐานเงินเดือน
          </div>}
      </td>
    )
  }
}

const  minutesToDisplay = minutes => {
  let day = parseInt(minutes/(600))
  let dayR = minutes%600
  let hr = parseInt(dayR/60)
  let hrR = dayR%60
  return day + ' Days ' + hr + ' Hr ' + hrR + ' m'
}

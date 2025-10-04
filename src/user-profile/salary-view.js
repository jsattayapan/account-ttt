import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import numeral from 'numeral'
import moment from 'moment'
import {
  faChevronCircleRight, faChevronCircleLeft, faArrowUp, faArrowDown,faUsersCog,
  faBuilding, faSave, faCloudSun, faBed,faExclamationTriangle, faCoffee, faUndoAlt,
  faUser, faCalendarAlt, faHome, faTools, faFileInvoiceDollar,faBullhorn, faPencilAlt, faLocationArrow,faChevronDown
 } from '@fortawesome/free-solid-svg-icons'
import { BottomNav } from './index.js'
import { IP,
  getEmployeeAccountById,
  showPrintReceipt,
  getMonthlyReportStatus
} from './tunnel'

export default class SalaryView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentMonth: new Date(),
      accountList: [],
      receipt: ''
    }
  }

  componentDidMount(){
    getMonthlyReportStatus({month: this.state.currentMonth, type: 'emp-receipt'}, statusRes => {
      if(statusRes.status){
        if(statusRes.reportStatus){


          getEmployeeAccountById({employeeId: this.props.employeeId, month: this.state.currentMonth}, res => {
            console.log(res);
            if(res.status){
              this.setState(() => ({
                accountList: res.accountList,
                receipt: res.receipt
              }))
            }
          })

        }
      }
    })

  }

  monthOnChange = (input) => {
    let {currentMonth} = this.state
    let { employeeId } = this.props
    if(input){
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }else{
      currentMonth.setMonth(currentMonth.getMonth() - 1)
    }

    getMonthlyReportStatus({month: currentMonth, type: 'emp-receipt'}, statusRes => {
      if(statusRes.status){
        if(statusRes.reportStatus){

          getEmployeeAccountById({employeeId, month: currentMonth}, res => {
            console.log(res);
            if(res.status){
              this.setState(() => ({
                accountList: res.accountList,
                receipt: res.receipt,
                currentMonth
              }))
            }
          })

        }
      }
    })


  }

  showPrintReceipt = () => {
    showPrintReceipt({
      month : this.state.currentMonth,
      employeeId: this.props.employeeId,
      lineId: this.props.lineId
    }, res => {
      if(res.status){
        window.open(res.uri, "_blank");
      }
    })
  }

  render(){
    let {receipt, accountList} = this.state
    //
    let incomeList = accountList.filter(x => x.type === 'เงินได้')
    let outcomeList = accountList.filter(x => x.type === 'เงินหัก')
    let totalIncome = incomeList.reduce((total, x) => total += x.amount , 0)
    let totalOutcome = outcomeList.reduce((total, x) => total += x.amount , 0)
    console.log(totalIncome);

    if(receipt.earning !== undefined) {
      totalIncome += receipt.earning
    }
    if(receipt.socialSecurity !== undefined) {
      totalOutcome = totalOutcome + receipt.socialSecurity
    }
    let remainTotal = totalIncome - totalOutcome
    // receipt.socialSecurity !== undefined && totalOutcome =+ receipt.socialSecurity
    // let incomeList = []
    // let outcomeList = []
    console.log(totalIncome);


    return (
      <div className="row">
        <div className="d-flex flex-row justify-content-center mt-4">
          <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(false)} color="#f2c66f" icon={faChevronCircleLeft} />
          <span id="month-title">
            {moment(this.state.currentMonth).format('MMMM')}
          </span>
          <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(true)} color="#f2c66f" icon={faChevronCircleRight} />
        </div>
        <div className="d-flex flex-column align-items-center mt-4">
          { this.state.receipt !== '' ? <h1>{numeral(remainTotal).format('0,0')}.-</h1>: 'N/A'}
          <p>REMAINING</p>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <table style={{width: '90%'}} className="table table-sm text-light ">
            <thead>
              <th style={{width: '60%'}}><FontAwesomeIcon size='2x' color="green" icon={faArrowUp} /> เงินได้</th>
              <th style={{textAlign: 'right'}}>{numeral(totalIncome).format('0,0')}.-</th>
            </thead>
            <tbody >
              {
                receipt.earning !== undefined && <tr>
                <td>เงินเดือน</td>
                <td style={{textAlign: 'right'}}>{numeral(receipt.earning).format('0,0')}.-</td>
              </tr>
              }
              {
                incomeList.map(x => (
                  <tr>
                    <td>{x.remark}</td>
                    <td style={{textAlign: 'right'}}>{numeral(x.amount).format('0,0')}.-</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <table style={{width: '90%'}} className="table table-sm text-light ">
            <thead>
              <th style={{width: '60%'}} ><FontAwesomeIcon size='2x' color="red" icon={faArrowDown} /> เงินหัก</th>
              <th style={{textAlign: 'right'}}>{numeral(totalOutcome).format('0,0')}.-</th>
            </thead>
            <tbody >
              {
                receipt.socialSecurity !== undefined && <tr>
                <td>ประกันสังคม</td>
                <td style={{textAlign: 'right'}}>{numeral(receipt.socialSecurity).format('0,0')}.-</td>
              </tr>
              }
              {
                outcomeList.map(x => (
                  <tr>
                    <td>{x.remark}</td>
                    <td style={{textAlign: 'right'}}>{numeral(x.amount).format('0,0')}.-</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="col-12 mt-4 text-center">
          <button onClick={this.showPrintReceipt} style={{width: '90%'}} className={`${this.state.receipt === '' ? 'profile-block disable' : 'profile-block'}`} disabled={this.state.receipt === ''}>ดาวน์โหลดสลิป</button>
        </div>
        <div style={{height:'150px', width: '50px'}}>

        </div>
        <BottomNav
          icon1={null}
          icon2={faUndoAlt}
          onClick1={faHome}
          onClick2={() => this.props.changePage('main')}
           />
      </div>
    )
  }
}

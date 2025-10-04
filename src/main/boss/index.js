import React from 'react'

import moment from 'moment'
import validator from 'validator'
import {Bar} from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto'
import numeral from 'numeral'
import { IP } from './../../constanst'

import FixingPage from './fixingPage'

import {  test,
  getEmployeeSectionByWeekNumber,
  getExpenseSectionByWeekNumber,
  getPurchaseSectionByWeekNumber
} from './tunnel'

export default class Boss extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'summary'
    }
  }

  changePage = page => {
    this.setState(() => ({
      currentPage: page
    }))
  }

  render(){
    const {currentPage} = this.state
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <button onClick={() => this.changePage('summary')} className="btn btn-link">Summary</button>
            <button onClick={() => this.changePage('fixing')} className="btn btn-link">Fix</button>
          </div>
        </div>
        {currentPage === 'summary' && <SummaryMainFrame />}
        {currentPage === 'fixing' && <FixingPage />}
      </div>
    )
  }
}
class SummaryMainFrame extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      jepPayload: [],
      dateRange: [],
      breakfastRevenue: [],
      avatara: [],
      lazy: [],
      pavilion: [],
      employeeSection: [],
      totalEmployeeCost: 0,
      expenseList: [],
      purchaseList: [],
      currentWeek: 0,
      firstDay: new Date(),
      lastDay: new Date(),
      currentPage: 'jep'
    }
  }

  componentDidMount(){
    let date = { target: { value: new Date()}}
    this.dateOnChange(date)
  }

  dateOnChange = e => {
    let date = e.target.value
    let weekNumber = moment(date).week()
    this.setState(() => ({
      currentWeek: weekNumber
    }))
    test({date}, res => {
      if(res.status){
        let breakfastRevenue = res.dateRange.reduce((payload, each) => {
          let avatara = res.avatara.filter(x => x.date === each)
          let pavilion = res.pavilion.filter(x => x.date === each)
          let lazy = res.lazy.filter(x => x.date === each)
          return [...payload , avatara[0].breakfastRevenue + pavilion[0].breakfastRevenue + lazy[0].breakfastRevenue ]
        },[])
        this.setState(() => ({
          dateRange: res.dateRange,
          jepPayload: res.restaurantTotal,
          breakfastRevenue,
          avatara: res.avatara,
          pavilion: res.pavilion,
          lazy: res.lazy
        }))
      }
    })

    getEmployeeSectionByWeekNumber({date}, res => {
      if(res.status){
        let totalAmount = 0
        let finalPayload = res.departmentList.reduce((payloadResult, each) => {
          let temp = []
          for(let textDate of this.state.dateRange){
            let empList = res.employeePayload.filter(x => (x.date === textDate && x.deptId === each.id))
            if(empList.length !== 0){
              let total = empList[0].employeeDeptList.reduce((total, ea) => total +ea.cost ,0)
              totalAmount += total
              temp = [ ...temp, {
                date: textDate,
                total,
                urlList: empList[0].employeeDeptList.map(x => x.imageUrl)
              }]
            }
          }
          return [ ...payloadResult, {departmentName: each.name, payload: temp} ]
        }, [])
        this.setState(() => ({
          employeeSection: finalPayload,
          totalEmployeeCost: totalAmount
        }))
      }
    })

    getExpenseSectionByWeekNumber({date}, res => {
      if(res.status){
        this.setState(() => ({
          expenseList: res.expenseList
        }))
      }
    })

    getPurchaseSectionByWeekNumber({date}, res => {
      if(res.status){
        console.log(res);
        this.setState(() => ({
          purchaseList: res.purchaseList,
          firstDay: res.firstDay,
          lastDay: res.lastDay
        }))
      }
    })
    }


    setCurrentPage = page => {
      this.setState(() => ({
        currentPage: page
      }))
    }



  render(){
    let totalRestaurant = this.state.jepPayload.reduce((total,each) => (total + each), 0)
    let totalBreakfast = this.state.breakfastRevenue.reduce((total,each) => (total + each), 0)

    let roomRevenueAva = this.state.avatara.reduce((total, x) => {
      return total + x.roomRevenue
    }, 0)
    let otherRevenueAva = this.state.avatara.reduce((total, x) => {
      return total + x.otherRevenue
    }, 0)

    let roomRevenuePav = this.state.pavilion.reduce((total, x) => {
      return total + x.roomRevenue
    }, 0)
    let otherRevenuePav = this.state.pavilion.reduce((total, x) => {
      return total + x.otherRevenue
    }, 0)

    let roomRevenueLazy = this.state.lazy.reduce((total, x) => {
      return total + x.roomRevenue
    }, 0)
    let otherRevenueLazy = this.state.lazy.reduce((total, x) => {
      return total + x.otherRevenue
    }, 0)

    let totalIncome = totalRestaurant + totalBreakfast + roomRevenueAva + otherRevenueAva + roomRevenuePav + otherRevenuePav + roomRevenueLazy + otherRevenueLazy
    let totalOutcome = this.state.totalEmployeeCost + this.state.expenseList.reduce((tol, exp) => tol + exp.amount, 0) + this.state.purchaseList.reduce((tol, exp) => tol + exp.total, 0)


    return (
      <div className="container">
        <div className="col-12 bg-light text-end">
          <input type="date" onChange={this.dateOnChange} />
          <h4><span style={{fontSize: '30px', color: 'green'}}>{this.state.currentWeek}</span> <span style={{fontSize: '10px', marginTop: '10px'}}>Wk.</span></h4>
          ({moment(this.state.firstDay).format('DD/MM')} - {moment(this.state.lastDay).format('DD/MM')})
        </div>
        <div className="col-12">
          <table className="table table-sm table-bordered">
            <tbody>
              <tr>
                <th>ร้านอาหารเจี๊ยบ</th>
                <td style={{color: 'green'}}>{numeral(totalRestaurant + totalBreakfast).format('0,0')} บาท</td>
                <th>ค่าพนักงาน</th>
                <td style={{color: 'red'}}>{numeral(this.state.totalEmployeeCost).format('0,0')} บาท</td>
              </tr>
              <tr>
                <th>Avatara</th>
                <td style={{color: 'green'}}>{numeral(roomRevenueAva + otherRevenueAva).format('0,0')} บาท</td>
                <th>ค่าใช้จ่าย</th>
                <td style={{color: 'red'}}>{numeral(this.state.expenseList.reduce((tol, exp) => tol + exp.amount, 0)).format('0,0')} บาท</td>
              </tr>
              <tr>
                <th>Samed Pavilion</th>
                <td style={{color: 'green'}}>{numeral(roomRevenuePav + otherRevenuePav).format('0,0')} บาท</td>
                <th>ค่าของ</th>
                <td style={{color: 'red'}}>{numeral(this.state.purchaseList.reduce((tol, exp) => tol + exp.total, 0)).format('0,0')} บาท</td>
              </tr>
              <tr>
                <th>Lazy Sandals</th>
                <td style={{color: 'green'}}>{numeral(roomRevenueLazy + otherRevenueLazy).format('0,0')} บาท</td>
                <td colSpan="2"></td>
              </tr>
              <tr>
                <th>รวมยอดรับ</th>
                <td style={{color: 'green'}}>{numeral(totalIncome).format('0,0')} บาท</td>
                <th>รวมยอดจ่าย</th>
                <td style={{color: 'red'}}>{numeral(totalOutcome).format('0,0')} บาท</td>
              </tr>
              <tr>
                <th>Performance</th>
                <td>{numeral(100 - (totalOutcome / totalIncome * 100)).format('0.00')} %</td>
                <th>คงเหลือ</th>
                <td style={totalIncome - totalOutcome < 0 ? {color: 'red'} : {color: 'green'} }>{numeral(totalIncome - totalOutcome).format('0,0')} บาท</td>
              </tr>
            </tbody>
          </table>
        </div>

          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a onClick={() => this.setCurrentPage('jep')} className={`nav-link ${this.state.currentPage === 'jep' && 'active'}`}>Jep</a>
            </li>
            <li className="nav-item">
              <a onClick={() => this.setCurrentPage('ava')} className={`nav-link ${this.state.currentPage === 'ava' && 'active'}`}>Avatara</a>
            </li>
            <li className="nav-item">
              <a onClick={() => this.setCurrentPage('pav')} className={`nav-link ${this.state.currentPage === 'pav' && 'active'}`}>Pavilion</a>
            </li>
            <li className="nav-item">
              <a onClick={() => this.setCurrentPage('lazy')} className={`nav-link ${this.state.currentPage === 'lazy' && 'active'}`}>Lazy</a>
            </li>
            <li className="nav-item">
              <a onClick={() => this.setCurrentPage('emp')} className={`nav-link ${this.state.currentPage === 'emp' && 'active'}`}>Employee</a>
            </li>
            <li className="nav-item">
              <a onClick={() => this.setCurrentPage('exp')} className={`nav-link ${this.state.currentPage === 'exp' && 'active'}`}>Expense</a>
            </li>
            <li className="nav-item">
              <a onClick={() => this.setCurrentPage('pur')} className={`nav-link ${this.state.currentPage === 'pur' && 'active'}`}>Purchase</a>
            </li>
          </ul>
          {
            this.state.currentPage === 'exp' && <ExpenseSection expenseList={this.state.expenseList} />
          }
          {
            this.state.currentPage === 'pur' && <PurchaseSection purchaseList={this.state.purchaseList} />
          }
          {
            this.state.currentPage === 'jep' && <JepSection breakfastRevenue={this.state.breakfastRevenue} dateRange={this.state.dateRange} payload={this.state.jepPayload} />
          }
          {
            this.state.currentPage === 'emp' && <EmployeeSection totalEmployeeCost={this.state.totalEmployeeCost} payload={this.state.employeeSection} dateRange={this.state.dateRange} />
          }
          {
            this.state.currentPage === 'ava' && <AvataraSection property='Avatara' payload={this.state.avatara} dateRange={this.state.dateRange}/>
          }
          {
            this.state.currentPage === 'pav' && <AvataraSection property='Pavilion' payload={this.state.pavilion} dateRange={this.state.dateRange}/>
          }
          {
            this.state.currentPage === 'lazy' && <AvataraSection property='Lazy' payload={this.state.lazy} dateRange={this.state.dateRange}/>
          }





      </div>
    )
  }
}

const PurchaseSection = props => {
  return (
    <div className="row">
      <div className="col-12">
        <h4>ซื้อของ</h4>
        <p>ยอดรวม: {numeral(props.purchaseList.reduce((tol, exp) => tol + exp.total, 0)).format('0,0')} บาท</p>
      </div>
      <div className="col-12 table-wrapper-scroll-y my-custom-scrollbar">
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>ร้านค้า</th>
              <th>ยอดเงิน</th>
            </tr>
          </thead>
          <tbody>
            {props.purchaseList.map(pur => (
              <PurchaseInfo purchase={pur} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


class PurchaseInfo extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showItemList: false
    }
  }

  setShowItemList = () => {
    this.setState(() => ({
      showItemList: !this.state.showItemList
    }))
  }

  render(){
    let pur = this.props.purchase
    return (
      <tr onClick={this.setShowItemList}>
        <td>{pur.issueDate === null ? moment(pur.timestamp).format('DD/MM/YYYY') : pur.issueDate}</td>
        <td>
          <div className="row">
            <div className="col-12">
              {pur.sellerName}
            </div>
            {
              this.state.showItemList &&
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>รายการ</th>
                    <th>จำนวน</th>
                    <th>ราคารวม</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    pur.purchaseItemList.map(x => (
                      <tr>
                        <td>{x.name}</td>
                        <td>{x.quantity}</td>
                        <td>{numeral(x.quantity * x.price).format('0,0')} บาท</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            }
          </div>
          </td>
        <td>{numeral(pur.total).format('0,0')} บาท</td>
      </tr>
    )
  }
}

const ExpenseSection = props => {
  return (
    <div className="row">
      <div className="col-12">
        <h4>ค่าใช้จ่าย</h4>
        <p>ยอดรวม: {numeral(props.expenseList.reduce((tol, exp) => tol + exp.amount, 0)).format('0,0')} บาท</p>
      </div>
      <div className="col-12 table-wrapper-scroll-y my-custom-scrollbar">
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>รายการ</th>
              <th>ยอดเงิน</th>
            </tr>
          </thead>
          <tbody>
            {props.expenseList.map(exp => (
              <tr>
                <td>{moment(exp.completePaymentBy).format('DD/MM/YYYY')}</td>
                <td>{exp.detail}</td>
                <td>{exp.amount} บาท</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const EmployeeSection = props => {
  return (
    <div className="row">
      <div className="col-12">
        <b>ยอดรวมค่าพนักงาน: </b>{numeral(props.totalEmployeeCost).format('0,0')} บาท
      </div>
      <div className="col-12">
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>แผนก/วันที่</th>
              {
                props.dateRange.map(x => (<td>{x}</td>))
              }
            </tr>
          </thead>
          <tbody>
            {
              props.payload.map(x => (
                <tr>
                  <td><b>{x.departmentName}</b></td>
                  {
                    x.payload.map(y => (
                      <td>
                        <p><b>เงิน: </b>{numeral(y.total).format('0,0')} ({y.urlList.length})</p>
                        <p>
                          {
                            y.urlList.map(z => (
                              <img style={{border: '1px solid white', marginLeft: '-15px', verticalAlign: 'middle', width: '35px', height: '35px', borderRadius: '50%'}} src={IP + '/public/employee/' + `${z !== null ? z : 'person.png'}`} />
                            ))
                          }
                        </p>
                      </td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
const AvataraSection = props => {
  let roomOccupency = props.payload.reduce((total, x) => {
    return total + x.roomOccupency
  }, 0)
  let roomRevenue = props.payload.reduce((total, x) => {
    return total + x.roomRevenue
  }, 0)
  let otherRevenue = props.payload.reduce((total, x) => {
    return total + x.otherRevenue
  }, 0)
  let totalDay = 30
  let isCurrentWeek = props.dateRange.indexOf(moment().format('DD/MM/YYYY'))
  if(isCurrentWeek !== -1){
    totalDay = isCurrentWeek
  }
  let totalRoom = 89;
  if(props.property === 'Pavilion'){
    totalRoom = 80
  }
  if(props.property === 'Lazy'){
    totalRoom = 24
  }

  totalRoom = totalRoom*totalDay
  let percentage = numeral(roomOccupency/totalRoom*100).format('0.00')


  return (
    <div className="row">
      <div className="col-12">
        <table className="table table-sm table-bordered">
          <tbody>
            <tr>
              <th colSpan='3'>{props.property}</th>
            </tr>
            <tr>
              <td colSpan='3'>
              <div style={{height: 300}}>
                <Bar data={
                    {labels: props.dateRange.map(x => moment(x, 'DD/MM/YYYY').format('ddd DD/MM')),
                    datasets: [
                      {
                        label:'Revenue',
                        data: props.payload.map(x => x.roomRevenue),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      borderWidth: 1
                    }
                    ]}
                    }
                    width={100}
                    height={300}
                    options={{ maintainAspectRatio: false }} />
                    </div>
              </td>
            </tr>
            <tr>
              <td><b>Avg. Occupency (%): </b>{percentage}</td>
              <td><b>Total Room: </b>{roomOccupency} / {totalRoom}</td>
              <td><b>Avg. RR Room: </b>{numeral(roomRevenue/roomOccupency).format('0,0')} บาท</td>
            </tr>
            <tr>
              <td><b>Room Revenue: </b>{numeral(roomRevenue).format('0,0')} บาท</td>
              <td><b>Other Room: </b>{numeral(otherRevenue).format('0,0')} บาท</td>
              <td><b>Total Revenue: </b>{numeral(otherRevenue + roomRevenue).format('0,0')} บาท</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const JepSection = props => {
  let totalRestaurant = props.payload.reduce((total,each) => (total + each), 0)
  let totalBreakfast = props.breakfastRevenue.reduce((total,each) => (total + each), 0)
return (
  <div className="row">
    <div className="col-12">
      <table className='table table-sm table-bordered'>
        <tbody>
        <tr>
          <td colSpan='2'>
          <div style={{height: 300}}>
          <Bar data={
              {labels: props.dateRange.map(x => moment(x, 'DD/MM/YYYY').format('ddd DD/MM')),
              datasets: [
                {
                  label:'ยอดขายร้านอาหารเจี๊ยบ',
                  data: props.payload,
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderWidth: 1
              },
              {
                label:'ยอดขายอาหารเช้า',
                data: props.breakfastRevenue,
                backgroundColor: 'rgba(75, 54, 192, 0.6)',
              borderWidth: 1
            },
              ]}
              }
              width={100}
              height={300}
              options={{ maintainAspectRatio: false }} />
          </div>
          </td>
        </tr>
        <tr>
          <td align='right'><b>Total ร้านอาหาร: </b> {numeral(totalRestaurant).format('0,0')} บาท</td>
          <td align='right'><b>Total อาหารเช้า: </b> {numeral(totalBreakfast).format('0,0')  } บาท</td>
        </tr>
        <tr>
          <td align='right' colSpan='2'><b>Total revenue: </b>{numeral(totalRestaurant+totalBreakfast).format('0,0')} บาท</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div className="col-12">
    </div>
  </div>
)
}

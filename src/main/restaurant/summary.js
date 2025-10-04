import React from 'react'
import CountUp from 'react-countup'

import DailyShift from './daily-shift'

import { faScroll, faMoneyBillAlt, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getCurrentReport, getReportByMonth } from './tunnel'
import { numFormat } from './functions'
import moment from 'moment'

import {Bar} from 'react-chartjs-2';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class Summary extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      thisMonth_table: 0,
      thisMonth_total: 0,
      thisMonth_guest: 0,
      months: [],
      total: [],
      showGraph: 'day',
      selectMonth:'',
      payload: {},
      lowest: 0,
      highest: 0
    }
  }

  componentDidMount(){
      getCurrentReport(res => {
        if(res.status){
          let dayTotal = res.pastMonth.map(x => x.total).reverse()
          let lowest = Math.min(...dayTotal)
          let highest = Math.max(...dayTotal)
          lowest = dayTotal.indexOf(lowest)
          highest = dayTotal.indexOf(highest)
          this.setState(() => ({
            thisMonth_guest: res.thisMonth_guest,
            thisMonth_table: res.thisMonth_table,
            thisMonth_total: res.thisMonth_total,
            months: res.pastYear.map(x => x.title).reverse(),
            total: res.pastYear.map(x => x.total).reverse(),
            dayTitle: res.pastMonth.map(x => x.title).reverse(),
            dayTotal: res.pastMonth.map(x => x.total).reverse(),
            day: res.day,
            lowest : lowest,
            highest
          }))
        }else{
          alert(res.msg)
        }
      })
  }

  changeGraph = (e) => {
    const value = e.target.value
    this.setState(() => ({showGraph: value}))
  }

  setMonth = month => {
    this.setState(() => ({
      selectMonth: month
    }))
    console.log(month)
  }

  findMonthlyReport = () => {
    if(this.state.selectMonth === ''){
      alert('กรุณาเลือกเดือน')
      return
    }
    getReportByMonth({date: this.state.selectMonth}, res => {
      if(res.status){
        this.setState(() => ({payload: res.payload, loadedMonth: this.state.selectMonth}))
      }else{
        alert(res.msg)
      }
    })
  }

  getColorByDate = (day, i, h) => {
    let date = new Date(day)
    let dayInt = date.getDay();
    let color = []
    for(let x = 0; x < 7; x++){
      if(dayInt === 0 || dayInt === 6){
        color = [ ...color, 'rgba(75, 192, 192, 0.6)']
      }else{
        color = [ ...color, 'rgba(54, 162, 235, 0.6)']
      }
      dayInt++
      if(dayInt === 7){
        dayInt = 0
      }
    }
    color = [ ...color, ...color, ...color, ...color, ...color,]
    color[i] = 'rgba(255, 0, 0, 0.6)'
    color[h] = 'rgba(0, 234, 89, 0.6)'
    return color
  }

  render(){
    return(
      <div>
        <div className="row">
          <div className="col-md-8 col-11 summaryBtn container-t">
            <div className="row">
              <div className="col-12">
                <input onChange={this.changeGraph} type="radio" id="day" name="graph" value="day" checked={this.state.showGraph === 'day'}/>
                <label for="day">รายวัน</label>
                <input onChange={this.changeGraph} type="radio" id="month" name="graph" value="month" checked={this.state.showGraph === 'month'}/>
                <label for="month">รายเดือน</label>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {this.state.showGraph === 'day' ? <Bar data={
            {labels: this.state.dayTitle,
            datasets: [
              {
                label:'ยอดขาย',
                data: this.state.dayTotal,
                backgroundColor: this.getColorByDate(this.state.day, this.state.lowest, this.state.highest),
              borderColor: this.getColorByDate(this.state.day, this.state.lowest, this.state.highest),
              borderWidth: 1
              }
            ]}
            }
            width={100}
            height={250}
            options={{ maintainAspectRatio: false }} /> :
            <Bar data={
            {labels: this.state.months,
            datasets: [
              {
                label:'ยอดขาย',
                data: this.state.total,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1
              }
            ]}
            }
            width={100}
            height={250}
            options={{ maintainAspectRatio: false }} />}
              </div>
            </div>
          </div>
          <div className="col-md-3 col-12">
            <div className="row mt-2">
              <div className="col-12 text-right month-title">
                {moment().format('MMM, YYYY')}
              </div>
              <SumBox value={this.state.thisMonth_table} title="จำนวนโต๊ะ" icon={faScroll} />
              <SumBox pastTotal={this.state.total[4]} value={this.state.thisMonth_total} title="ยอดขาย" icon={faMoneyBillAlt} />
              <SumBox value={this.state.thisMonth_guest} title="ลูกค้า" icon={faUserFriends} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-11 container-t mt-3">
            <div className="row mt-2 ml-2">
              <h3>ยอดสรุปรายเดือน</h3>
            </div>
            <div className="row mt-2 ml-2">
              <DatePicker
                className="mr-5"
                selected={this.state.selectMonth}
                onChange={date => this.setMonth(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
            <button className="btn btn-success" onClick={this.findMonthlyReport}>ค้นหา</button>
              </div>
              <div className="row mt-2">
                <div className="col-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{moment(this.state.loadedMonth).format('MMM YYYY')}</th>
                        <th>รวม</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>จำนวนลูกค้า (คน)</th>
                  <td align='right'>{numFormat(this.state.payload.guests)}</td>
                      </tr>
                      <tr>
                        <th>จำนวนโต๊ะ</th>
                  <td align='right'>{numFormat(this.state.payload.tables)}</td>
                      </tr>
                      <tr>
                        <th>ส่วนลด (บาท)</th>
                  <td align='right'>{numFormat(this.state.payload.discount)}</td>
                      </tr>
                      <tr>
                        <th>อาหาร</th>
                  <td align='right'>{numFormat(this.state.payload.totalFood)}</td>
                      </tr>
                      <tr>
                        <th>เครื่องดื่ม</th>
                  <td align='right'>{numFormat(this.state.payload.totalBeverage)}</td>
                      </tr>
                      <tr>
                        <th>จำนวนยกเลิก (รายการ)</th>
                  <td align='right'>{numFormat(this.state.payload.cancel)}</td>
                      </tr>
                      <tr>
                        <th>Service Charge</th>
                  <td align='right'>{numFormat(this.state.payload.service_charge)}</td>
                      </tr>
                      <tr>
                        <th>จ่ายเงินสด (บาท)</th>
                  <td align='right'>{numFormat(this.state.payload.cash)}</td>
                      </tr>
                      <tr>
                        <th>จ่ายโอน (บาท)</th>
                  <td align='right'>{numFormat(this.state.payload.transfer)}</td>
                      </tr>
                      <tr>
                        <th>จ่ายบัตร (บาท)</th>
                  <td align='right'>{numFormat(this.state.payload.card)}</td>
                      </tr>
                      <tr>
                        <th>ไทยชนะ</th>
                  <td align='right'>{numFormat(this.state.payload.ThaiChana)}</td>
                      </tr>
                      <tr>
                        <th>คนละครึ่ง</th>
                  <td align='right'>{numFormat(this.state.payload.halfHalf)}</td>
                      </tr>
                      <tr>
                        <th>G-Wallet</th>
                  <td align='right'>{numFormat(this.state.payload.gWallet)}</td>
                      </tr>
                      <tr>
                        <th>โอนเข้าห้อง (บาท)</th>
                  <td align='right'>{numFormat(this.state.payload.room)}</td>
                      </tr>
                      <tr>
                        <th>รายได้ (บาท)</th>
                  <td align='right'><b>{numFormat(this.state.payload.total)}</b></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
          <div className="col-md-6 col-11 container-t mt-3">
            <DailyShift />
          </div>
        </div>

      </div>
    )
  }
}

function SumBox (props){
  return(
    <div className="col-12">
      <div className="sumBox">
        <div className="row">
          <div className="col-md-7 col-12">
            <div className="row">
              <div className="col-12 sumBox-title">
                <b>{props.title}</b>
              </div>
            </div>
            <div className="row">
              <div className="col-12 sumBox-detail">
                <CountUp start={0} end={props.value} duration={1.5} separator=",">
                  {({ countUpRef }) => (
                    <div>
                      <span ref={countUpRef} />
                    </div>
                  )}
                </CountUp>
              </div>
            </div>
          </div>
          <div className="col-md-5 col-12">
            <FontAwesomeIcon icon={props.icon} size="3x" />
          </div>
        </div>
      </div>
    </div>
  )
}

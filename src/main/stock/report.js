import React from 'react'
import numeral from 'numeral'
import DatePicker from "react-datepicker";
import moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'

import { getReportByMonth } from './tunnel'

export default class Report extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      month: '',
      report: '',
      reportType: ''
    }
  }

  setMonth = month => {
    this.setState(() => ({month}))
  }

  getReportByMonthNType = () => {
    if(this.state.month === ''){
      alert('กรุณาเลือกเดือน')
      return
    }
    if(this.state.reportType === ''){
      alert('กรุณาเลือกประเภทรายงาน')
      return
    }
    getReportByMonth({date: this.state.month, reportType: this.state.reportType}, res => {
      if(res.status){
        window.open(res.uri)
      }else{
        alert(res.msg)
      }
    })
  }

  reportTypOnChange = (input) => {
    this.setState(() => ({
      reportType: input.value
    }))
  }

  render(){
    const reportTypeOptions = [
      {label: 'รายการจ่ายร้านค้า', value: 'รายการจ่ายร้านค้า'},
      {label: 'รายการค่าใช้จ่าย', value: 'รายการค่าใช้จ่าย'},
    ]
    return(
        <div className="row m-2">
            <div className="col-12 col-md-6">
              <label className="pr-2">เดือน: </label>
                <DatePicker
                  selected={this.state.month}
                  onChange={date => this.setMonth(date)}
                  dateFormat="MMM/yyyy"
                  showMonthYearPicker
                  className="form-control"
                />
            </div>
            <div className="col-12 col-md-3 mt-2 mt-md-0">
              <Select onChange={this.reportTypOnChange} options={reportTypeOptions} />
            </div>
            <div className="col-12 col-md-3 mt-2 mt-md-0">
              <buton onClick={this.getReportByMonthNType} className="btn btn-success btn-block">ค้นหา</buton>
            </div>
            {
              /*
              this.state.report !== '' &&
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th colspan="2">ยอดค่าใช้จ่าย {this.state.report.month}</th>
                      </tr>
                      <tr>
                        <th>เงินสด</th>
                        <td>{numeral(this.state.report.cash).format('0,0.00')} บาท</td>
                      </tr>
                      <tr>
                        <th>บัตรเครดิต</th>
                        <td>{numeral(this.state.report.card).format('0,0.00')} บาท</td>
                      </tr>
                      <tr>
                        <th>โอนเงิน</th>
                        <td>{numeral(this.state.report.transfer).format('0,0.00')} บาท</td>
                      </tr>
                      <tr>
                        <th>รวม</th>
                        <th>{numeral(this.state.report.card+this.state.report.cash+this.state.report.transfer).format('0,0.00')} บาท</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-6">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>รายการสินค้าที่สั่งภายในเดือนนี้</th>
                        <th>จำนวน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.report.items.map(x => (
                        <tr>
                          <td>{x.name}</td>
                          <td>{x.received}/{x.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          */
        }
        </div>
    )
  }
}

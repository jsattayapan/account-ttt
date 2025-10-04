// import React from 'react'
//
// export default class DailyShift extends React.Component {
//   constructor(props){
//     super(props)
//     this.state = {
//
//     }
//   }
//   render(){
//     return(
//       <div>
//
//       </div>
//     )
//   }
// }

import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import { SemipolarLoading } from 'react-loadingg';
import { restaurantGetDailyShift } from './tunnel'
import { TitleBar } from './components'
import { numFormat } from './functions'

export default class DailyShift extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      displayDate: 'ยังไม่ได้เลือก',
      date: '',
      loading: false,
      morning: {
        guests: '-',
        tables: '-',
        total: '-',
        cash: '-',
        card: '-',
        transfer: '-',
        room: '-',
        discount: '-',
        cancel: '-',
        service_charge: '-',
        ThaiChana: '-',
        halfHalf: '-',
        gWallet:'-',
        totalFood: '-',
        totalBeverage: '-'
      },
      afternoon: {
        guests: '-',
        tables: '-',
        total: '-',
        cash: '-',
        card: '-',
        transfer: '-',
        room: '-',
        discount: '-',
        cancel: '-',
        service_charge: '-',
        ThaiChana: '-',
        halfHalf: '-',
        gWallet:'-',
        totalFood: '-',
        totalBeverage: '-'
      }
    }
  }

  numFormat = number => {
    if(number === '-'){
      return number
    }else{
      return numeral(number).format('0,0')
    }
  }

  setDate = e => {
    const date = e.target.value;
    this.setState(() => ({date}))
  }

  getDate = () => {
    this.setState(() => ({loading: true}))
    restaurantGetDailyShift({date: this.state.date}, res => {
      this.setState(() => ({loading: false}))
      if(res.status){
        console.log(res);
        this.setState(() => ({
          displayDate: this.state.date,
          morning: res.morning,
          afternoon: res.afternoon
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return(
      <div className="row">
        <TitleBar title='รายงานร้านอาหารประจำวัน' />
      <br />
      <br />
      <br />
      <div className="col-2">
        <label>วันที่ : </label>
      </div>
      <div className="col-4">
        <input onChange={this.setDate} type='date' />
      </div>
      <div className="col-6">
        <button onClick={this.getDate} className="btn btn-success">ค้นหา</button>
      </div>
      <br />
    <div className="col-12">
        Date: <b>{moment(this.state.displayDate).format('dddd, MMMM Do YYYY') || 'ยังไม่ได้เลือก'}</b>
      </div>
    {this.state.loading ? <SemipolarLoading /> : <div className="col-12">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>รอบเช้า</th>
            <th>รอบเย็น</th>
            <th>รวม</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>จำนวนลูกค้า (คน)</th>
          <td align='right'>{numFormat(this.state.morning.guests)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.guests)}</td>
      <td align='right'>{this.numFormat(this.state.morning.guests + this.state.afternoon.guests)}</td>
          </tr>
          <tr>
            <th>จำนวนโต๊ะ</th>
          <td align='right'>{this.numFormat(this.state.morning.tables)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.tables)}</td>
      <td align='right'>{this.numFormat(this.state.morning.tables + this.state.afternoon.tables)}</td>
          </tr>
          <tr>
            <th>ส่วนลด (บาท)</th>
          <td align='right'>{this.numFormat(this.state.morning.discount)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.discount)}</td>
      <td align='right'>{this.numFormat(this.state.morning.discount + this.state.afternoon.discount)}</td>
          </tr>
          <tr>
            <th>อาหาร</th>
          <td align='right'>{this.numFormat(this.state.morning.totalFood)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.totalFood)}</td>
      <td align='right'>{this.numFormat(this.state.morning.totalFood + this.state.afternoon.totalFood)}</td>
          </tr>
          <tr>
            <th>เครื่องดื่ม</th>
          <td align='right'>{this.numFormat(this.state.morning.totalBeverage)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.totalBeverage)}</td>
      <td align='right'>{this.numFormat(this.state.morning.totalBeverage + this.state.afternoon.totalBeverage)}</td>
          </tr>
          <tr>
            <th>จำนวนยกเลิก (รายการ)</th>
          <td align='right'>{this.numFormat(this.state.morning.cancel)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.cancel)}</td>
      <td align='right'>{this.numFormat(this.state.morning.cancel + this.state.afternoon.cancel)}</td>
          </tr>
          <tr>
            <th>Service Charge</th>
          <td align='right'>{this.numFormat(this.state.morning.service_charge)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.service_charge)}</td>
      <td align='right'>{this.numFormat(this.state.morning.service_charge + this.state.afternoon.service_charge)}</td>
          </tr>
          <tr>
            <th>จ่ายเงินสด (บาท)</th>
          <td align='right'>{this.numFormat(this.state.morning.cash)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.cash)}</td>
      <td align='right'>{this.numFormat(this.state.morning.cash + this.state.afternoon.cash)}</td>
          </tr>
          <tr>
            <th>จ่ายโอน (บาท)</th>
          <td align='right'>{this.numFormat(this.state.morning.transfer)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.transfer)}</td>
      <td align='right'>{this.numFormat(this.state.morning.transfer + this.state.afternoon.transfer)}</td>
          </tr>
          <tr>
            <th>จ่ายบัตร (บาท)</th>
          <td align='right'>{this.numFormat(this.state.morning.card)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.card)}</td>
      <td align='right'>{this.numFormat(this.state.morning.card + this.state.afternoon.card)}</td>
          </tr>
          <tr>
            <th>ไทยชนะ</th>
          <td align='right'>{this.numFormat(this.state.morning.ThaiChana)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.ThaiChana)}</td>
      <td align='right'>{this.numFormat(this.state.morning.ThaiChana + this.state.afternoon.ThaiChana)}</td>
          </tr>
          <tr>
            <th>คนละครึ่ง</th>
          <td align='right'>{this.numFormat(this.state.morning.halfHalf)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.halfHalf)}</td>
      <td align='right'>{this.numFormat(this.state.morning.halfHalf + this.state.afternoon.halfHalf)}</td>
          </tr>
          <tr>
            <th>G-Wallet</th>
          <td align='right'>{this.numFormat(this.state.morning.gWallet)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.gWallet)}</td>
      <td align='right'>{this.numFormat(this.state.morning.gWallet + this.state.afternoon.gWallet)}</td>
          </tr>
          <tr>
            <th>โอนเข้าห้อง (บาท)</th>
          <td align='right'>{this.numFormat(this.state.morning.room)}</td>
        <td align='right'>{this.numFormat(this.state.afternoon.room)}</td>
      <td align='right'>{this.numFormat(this.state.morning.room + this.state.afternoon.room)}</td>
          </tr>

          <tr>
            <th>รายได้ (บาท)</th>
          <td align='right'><b>{this.numFormat(this.state.morning.total)}</b></td>
        <td align='right'><b>{this.numFormat(this.state.afternoon.total)}</b></td>
      <td align='right'><b>{this.numFormat(this.state.morning.total + this.state.afternoon.total)}</b></td>
          </tr>
        </tbody>
      </table>
    </div>}
      </div>
    )
  }
}

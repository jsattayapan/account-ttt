import React from 'react'
import { SemipolarLoading } from 'react-loadingg';
import { TitleBar } from './components'
import { getSoldItemsByMonth, getSoldItemsByDate } from './tunnel'
import { formatItemsReport, printerReport } from './functions'
import moment from 'moment'
import StaffsSale from './staffs-sale'

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default class DailySaleItems extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      date: '',
      loading: false,
      items: [],
      baverage: [],
      chicken: [],
      pork: [],
      beef: [],
      prawn: [],
      squid: [],
      crab: [],
      seafood:[],
      shell:[],
      vegetable:[],
      fish:[],
      else:[],
      selectMonth: new Date(),
      title: 'ยังไม่ได้เลือก',
      topDrink: [],
      topFood: []
    }
  }

  componentDidMount() {
    getSoldItemsByMonth({date: new Date()}, res => {
      this.setState(() => ({
        loading: false
      }))
      if(res.status){
        this.setState(() => ({
          title: `รายงานประจำเดือน ${moment(this.state.selectMonth).format('MM/YYYY')}`
        }))
        let vip = res.vipSum
        const staff = res.staffSum
        let customer = res.customerSum
        let result = formatItemsReport(vip, staff, customer)
        let food = result.filter(x => x.cat !== 'เครื่องดื่ม')
        console.log('Result: ', result);
        this.setState(() => ({
          baverage: result.filter(x => x.cat === 'เครื่องดื่ม').sort((a, b) => b.qty - a.qty),
          chicken: food.filter(x => x.meat === 'ไก่').sort((a, b) => b.qty - a.qty),
          pork: food.filter(x => x.meat === 'หมู').sort((a, b) => b.qty - a.qty),
          beef: food.filter(x => x.meat === 'เนื้อ').sort((a, b) => b.qty - a.qty),
          prawn: food.filter(x => x.meat === 'กุ้ง').sort((a, b) => b.qty - a.qty),
          squid: food.filter(x => x.meat === 'หมึก').sort((a, b) => b.qty - a.qty),
          crab: food.filter(x => x.meat === 'ปู').sort((a, b) => b.qty - a.qty),
          seafood: food.filter(x => x.meat === 'ทะเล').sort((a, b) => b.qty - a.qty),
          shell: food.filter(x => x.meat === 'หอย').sort((a, b) => b.qty - a.qty),
          vegetable: food.filter(x => x.meat === 'ผัก').sort((a, b) => b.qty - a.qty),
          fish: food.filter(x => x.meat === 'ปลา').sort((a, b) => b.qty - a.qty),
          else: food.filter(x => x.meat === null).sort((a, b) => b.qty - a.qty),
          topFood: res.topFood,
          topDrink: res.topDrink
        }))

      }else{
        alert(res.msg)
      }
    })
  }

  setMonth = (date) => {
    this.setState(() => ({
      selectMonth: date
    }))
  }

  printerReport = () => {
    if(this.state.title === 'ยังไม่ได้เลือก'){
      alert('กรุณาสรุป Report ก่อนพิมพ์')
      return
    }
    printerReport(this.state)
  }

  setDate = (e) => {
    const date = e.target.value
    this.setState(() => ({
      date
    }))
  }

  getByMonth = () => {
    this.setState(() => ({
      loading: true
    }))
    getSoldItemsByMonth({date: this.state.selectMonth}, res => {
      this.setState(() => ({
        loading: false
      }))
      if(res.status){
        this.setState(() => ({
          title: `รายงานประจำเดือน ${moment(this.state.selectMonth).format('MM/YYYY')}`
        }))
        let vip = res.vipSum
        const staff = res.staffSum
        let customer = res.customerSum
        let result = formatItemsReport(vip, staff, customer)
        let food = result.filter(x => x.cat !== 'เครื่องดื่ม')
        console.log('Result: ', result);
        this.setState(() => ({
          baverage: result.filter(x => x.cat === 'เครื่องดื่ม').sort((a, b) => b.qty - a.qty),
          chicken: food.filter(x => x.meat === 'ไก่').sort((a, b) => b.qty - a.qty),
          pork: food.filter(x => x.meat === 'หมู').sort((a, b) => b.qty - a.qty),
          beef: food.filter(x => x.meat === 'เนื้อ').sort((a, b) => b.qty - a.qty),
          prawn: food.filter(x => x.meat === 'กุ้ง').sort((a, b) => b.qty - a.qty),
          squid: food.filter(x => x.meat === 'หมึก').sort((a, b) => b.qty - a.qty),
          crab: food.filter(x => x.meat === 'ปู').sort((a, b) => b.qty - a.qty),
          seafood: food.filter(x => x.meat === 'ทะเล').sort((a, b) => b.qty - a.qty),
          shell: food.filter(x => x.meat === 'หอย').sort((a, b) => b.qty - a.qty),
          vegetable: food.filter(x => x.meat === 'ผัก').sort((a, b) => b.qty - a.qty),
          fish: food.filter(x => x.meat === 'ปลา').sort((a, b) => b.qty - a.qty),
          else: food.filter(x => x.meat === null).sort((a, b) => b.qty - a.qty),
          topFood: res.topFood,
          topDrink: res.topDrink
        }))

      }else{
        alert(res.msg)
      }
    })
  }

  getByDate = () => {
    const date = this.state.date
    if(date === ''){
      alert('กรุณาระบุวันที่ต้องการดู Report')
      return
    }
    this.setState(() => ({
      loading: true
    }))
    getSoldItemsByDate({date}, res => {
      this.setState(() => ({
        loading: false
      }))
      if(res.status){
        this.setState(() => ({
          title: `รายงานประจำวันที่ ${moment(date).format('DD/MM/YYYY')}`
        }))
        let vip = res.vipSum
        const staff = res.staffSum
        let customer = res.customerSum
        let result = formatItemsReport(vip, staff, customer)
        result = result.sort((a, b) => a.code - b.code)
        let food = result.filter(x => x.cat !== 'เครื่องดื่ม')
        console.log('Result: ', result);
        this.setState(() => ({
          baverage: result.filter(x => x.cat === 'เครื่องดื่ม').sort((a, b) => b.qty - a.qty),
          chicken: food.filter(x => x.meat === 'ไก่').sort((a, b) => b.qty - a.qty),
          pork: food.filter(x => x.meat === 'หมู').sort((a, b) => b.qty - a.qty),
          beef: food.filter(x => x.meat === 'เนื้อ').sort((a, b) => b.qty - a.qty),
          prawn: food.filter(x => x.meat === 'กุ้ง').sort((a, b) => b.qty - a.qty),
          squid: food.filter(x => x.meat === 'หมึก').sort((a, b) => b.qty - a.qty),
          crab: food.filter(x => x.meat === 'ปู').sort((a, b) => b.qty - a.qty),
          seafood: food.filter(x => x.meat === 'ทะเล').sort((a, b) => b.qty - a.qty),
          shell: food.filter(x => x.meat === 'หอย').sort((a, b) => b.qty - a.qty),
          vegetable: food.filter(x => x.meat === 'ผัก').sort((a, b) => b.qty - a.qty),
          fish: food.filter(x => x.meat === 'ปลา').sort((a, b) => b.qty - a.qty),
          else: food.filter(x => x.meat === null).sort((a, b) => b.qty - a.qty),
          topFood: res.topFood,
          topDrink: res.topDrink
        }))

      }else{
        alert(res.msg)
      }
    })
  }

  setMeat = (e) => {
    const value = e.target.value
    const name = e.target.name
    let items = this.state.items
    items = items.map(x => {
      if(x.code === name){
        x['meat'] = value
      }
      return x
    })
    this.setState(() => ({
      items
    }))
  }

  render(){
    return(
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-md-5 col-11 ml-3">
              <div className="row mb-4">
                <div className="col-12">
                  <h3>{this.state.title}</h3>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-4">
                    <label>วันที่: </label>
                  </div>
                  <div className="col-5">
                    <input onChange={this.setDate} type='date' />
                  </div>
                  <div className="col-3">
                    <button onClick={this.getByDate} className="btn btn-success">สรุปรายวัน</button>
                  </div>
              </div>
              <div className="row mb-4">
                <div className="col-4">
                    <label>เดือน: </label>
                  </div>
                  <div className="col-5">
                    <DatePicker
                      selected={this.state.selectMonth}
                      onChange={date => this.setMonth(date)}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                    />
                  </div>
                  <div className="col-3">
                    <button onClick={this.getByMonth} className="btn btn-success">สรุปรายเดือน</button>
                  </div>
              </div>
              <div className="row">
                <div className="col-1"></div>
                <div className="col-10">
                  <button style={{width: '100%'}} onClick={this.printerReport} className="btn btn-info">พิมพ์</button>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-11 container-t">
              <div className="row">
                <div className="col-12">
                  Top 10 อาหาร
                </div>
              </div>
              {
                this.state.topFood.map((x, i) => (
                  <div className="row">
                    <div className="col-3">
                      {i+1}.
                    </div>
                    <div className="col-9">
                      {x.name}
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="col-md-3 col-11 container-t">
              <div className="row">
                <div className="col-12">
                  Top 10 เครื่องดื่ม
                </div>
              </div>
              {
                this.state.topDrink.map((x, i) => (
                  <div className="row">
                    <div className="col-3">
                      {i+1}.
                    </div>
                    <div className="col-9">
                      {x.name}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="row mt-4 ml-3 mr-3">
            <div className="col-md-5 col-11 container-t">
              <StaffsSale />
            </div>
            {this.state.loading ? <div className="col-6 container-t"><SemipolarLoading /></div> : <div className="col-md-6 col-11 container-t">
              <br />
              <h3>เครื่องดื่ม</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.baverage.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <h3>ไก่</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.chicken.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            <h3>หมู</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.pork.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            <h3>เนื้อ</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.beef.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            <h3>กุ้ง</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.prawn.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            <h3>หมึก</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.squid.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            <h3>ปู</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.crab.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            <h3>ทะเล</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.seafood.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            <h3>หอย</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.shell.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            <h3>ผัก</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.vegetable.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            <h3>ปลา</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.fish.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            <h3>อื่นๆ</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>รายการ</th>
                    <th>ลูกค้า</th>
                    <th>พนักงาน</th>
                    <th>VIP</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.else.map(x => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.qty || 0}</td>
                      <td>{x.staffQty || 0}</td>
                      <td>{x.vipQty || 0}</td>
                    <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

// const Container = () => <SemipolarLoading />;

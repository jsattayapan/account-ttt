import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { getSevenDays, insertReport, getTotalGraph } from './tunnel'
import validator from 'validator'
import {Bar} from 'react-chartjs-2';
import LazyManager from './lazy-hotel-manager'
import Voucher from './voucher-manager'
import ConfirmationGenerator from './confirmation-generator'
import CreateQuotation from './create-quotation'

export default class ResortView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'daily-report'
    }
  }
  linkClicked = (page) => {
    this.setState(() => ({currentPage:page}))
  }
  render(){
    return(
      <div className="row">
        <div className="col-12">
          <ul className="ul-menu-bar">
            <li onClick={() => this.linkClicked('daily-report')}>Daily Report</li>
            <li onClick={() => this.linkClicked('confirmation-generator')}>Confirmation Generator</li>
            <li onClick={() => this.linkClicked('create-quotation')}>สร้างใบเสนอราคากรุ๊ป</li>
          {/* <li onClick={() => this.linkClicked('voucher-manager')}>Voucher Manager</li> */}
            {/* <li onClick={() => this.linkClicked('lazy-sandals')}>Lazy Hotel Manager</li> */}
          </ul>
        </div>
        <div className="col-12">
          {this.state.currentPage === 'daily-report' && <DailyReport />}
          {this.state.currentPage === 'lazy-sandals' && <LazyManager />}
          {this.state.currentPage === 'voucher-manager' && <Voucher />}
          {this.state.currentPage === 'confirmation-generator' && <ConfirmationGenerator />}
          {this.state.currentPage === 'create-quotation' && <CreateQuotation />}
        </div>
      </div>
    )
  }
}

class DailyReport extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            showAddReport: false,
            avatara: [],
            pavilion: [],
            lazy: [],
            loading: true,
            date: new Date(),
            monthlyData: [],
            monthlyTitle: []
        }
    }

    closeInsert = () => {
      this.setState(() => ({
        showAddReport: false
      }))
      this.componentDidMount()
    }

    backADay = () => {
      let date = this.state.date
      date.setDate(date.getDate() - 1)
      getSevenDays({date}, res => {
          if(res.status){
              this.setState(() => ({
                avatara: resultformating(res.avatara),
                pavilion: resultformating(res.pavilion),
                lazy: resultformating(res.lazy),
                loading: false,
                date
              }))
          }else{
              alert(res.msg)
          }
      })
    }

    forwardADay = () => {
      let date = this.state.date
      date.setDate(date.getDate() + 1)
      getSevenDays({date}, res => {
          if(res.status){
              this.setState(() => ({
                avatara: resultformating(res.avatara),
                pavilion: resultformating(res.pavilion),
                lazy: resultformating(res.lazy),
                loading: false,
                date
              }))
          }else{
              alert(res.msg)
          }
      })
    }

    componentDidMount(){
        getSevenDays({date: new Date()}, res => {
            if(res.status){
                this.setState(() => ({
                  avatara: resultformating(res.avatara),
                  pavilion: resultformating(res.pavilion),
                  lazy: resultformating(res.lazy),
                  loading: false
                }))
            }else{
                alert(res.msg)
            }
        })
        getTotalGraph(res => {
          if(res.status){
            this.setState(() => ({
              monthlyData: res.payload.map(x => parseInt(x.total)).reverse(),
              monthlyTitle: res.payload.map(x => x.date).reverse()
            }))
          }else{
            alert(res.msg)
          }
        })
    }

    toggleShowAddReport = () => {
        this.setState(() => ({
            showAddReport: !this.state.showAddReport
        }))
    }

    render(){
        let showAddReport = this.state.showAddReport
        return (
            <div className="row">
                <div className="col-12 mb-4">
                   <div className="row mb-3">
                       <div className="col-4">
                           <button onClick={this.toggleShowAddReport} className="btn btn-link">{showAddReport ? '-' : '+'} เพิ่มยอดสรุปรีอสร์ทรายวัน</button>
                       </div>
                   </div>
                    { showAddReport &&
                     <div className="row mb-4">
                        <div className="col-12">
                        <InsertReportRevenue closeInsert={this.closeInsert}/>
                        </div>
                    </div>}
                    {!this.state.loading && <div className="row">
                        <div className="col-2">
                          <button onClick={this.backADay} className="btn btn-dark">- 1 วัน</button>
                        </div>
                        <div className="col-10">
                          <button onClick={this.forwardADay} className="btn btn-dark">+ 1 วัน</button>
                        </div>
                        <PropertyReport data={this.state.avatara} name="Avatara"  />
                        <PropertyReport data={this.state.pavilion} name="Samed Pavilion"  />
                        <PropertyReport data={this.state.lazy} name="Lazy Sandals"  />
                    </div>}
                    <br />
                  <div className="row">
                    <div className="col-12">
                      <Bar data={
                  {labels: this.state.monthlyTitle,
                  datasets: [
                    {
                      label:'ยอดขาย',
                      data: this.state.monthlyData,
                    borderWidth: 1
                    }
                  ]}
                  }
                  width={100}
                  height={250}
                  options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className="col-12">
                      {numeral(this.state.monthlyData.reduce((t, i) => t + i, 0)).format('0,0')}
                    </div>
                  </div>
                </div>
            </div>
        )
    }
}

function isWeekend(text){
  if(text === 'Sat' || text === 'Sun'){
    return {
      backgroundColor: '#C52232'
    }
  }else{
    return {}
  }
}

const PropertyReport = props => {
      return (
          <div className="col-12">
                              <table className="table resort-report-table">
                                  <tbody>
                                      <tr>
                                        <th><b>{props.name}</b></th>
                                        {props.data.date.map(x => (
                                        <th style={isWeekend(moment(x).format('ddd'))} className='text-center'>
                                          <span className="tb-lg">{moment(x).format('MMM')}</span><br/>
                                          <span className="tb-sm">{moment(x).format('D')}</span><br/>
                                          <span className="tb-lg">{moment(x).format('ddd')}</span>
                                        </th>
                                        ))}
                                      </tr>
                                      <tr>
                                        <th>จำนวนห้องพัก</th>
                                        {props.data.roomOccupency.map(x => (
                                        <td className="text-center">{x !== 'N/A' ? numeral(x).format('0,0') : 'N/A'}</td>
                                        ))}
                                      </tr>
                                      <tr>
                                        <th>ผู้เข้าพัก</th>
                                        {props.data.guests.map(x => (
                                        <td className="text-center">{x !== 'N/A' ? numeral(x).format('0,0') : 'N/A'}</td>
                                        ))}
                                      </tr>

                                      <tr>
                                        <th>Average Room Rate</th>
                                        {props.data.averageRoomRate.map(x => (
                                        <td className="text-center"><b>{x !== 'N/A' ? numeral(x).format('0,0.00') : 'N/A'}</b></td>
                                        ))}
                                      </tr>
                                      <tr>
                                        <th>รายได้ห้องพัก</th>
                                        {props.data.roomRevenue.map(x => (
                                        <td className="text-center">{x !== 'N/A' ? numeral(x).format('0,0') : 'N/A'}</td>
                                        ))}
                                      </tr>
                                      <tr>
                                        <th>รายได้อาหารเช้า</th>
                                        {props.data.breakfastRevenue.map(x => (
                                        <td className="text-center">{x !== 'N/A' ? numeral(x).format('0,0') : 'N/A'}</td>
                                        ))}
                                      </tr>
                                      <tr>
                                        <th>รายได้อื่นๆ</th>
                                        {props.data.otherRevenue.map(x => (
                                        <td className="text-center">{x !== 'N/A' ? numeral(x).format('0,0') : 'N/A'}</td>
                                        ))}
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
      )

}

class InsertReportRevenue extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            occupencyAva: 0,
            occupencyPav: 0,
            occupencyLaz: 0,
            guestAva: 0,
            guestPav: 0,
            guestLaz: 0,
            roomRevenueAva: 0,
            roomRevenuePav: 0,
            roomRevenueLaz: 0,
            bFRevenueAva: 0,
            bFRevenuePav: 0,
            bFRevenueLaz: 0,
            otherRevenueAva: 0,
            otherRevenuePav: 0,
            otherRevenueLaz: 0,
            date: ''
        }
    }

    onTextChange = e => {

        const name = e.target.name;
        const value = e.target.value;
        if(validator.isFloat(value) || value === ''){
          this.setState(() => ({
              [name]: value
          }))
        }

    }

    onIntChange = e => {

        const name = e.target.name;
        const value = e.target.value;
        if(validator.isNumeric(value) || value === ''){
          this.setState(() => ({
              [name]: value
          }))
        }

    }

    setDate = e => {
        const date = e.target.value
        this.setState(() => ({
            date
        }))
    }

    submitReport = () => {
        if(this.state.date === ''){
            alert('กรุณาระบุวันที่')
            return
        }
        if(this.state.occupencyAva === ''){
          alert('กรุณาใส่จำนวนห้องพักของ Avatara')
          return
        }
        if(this.state.occupencyPav === ''){
          alert('กรุณาใส่จำนวนห้องพักของ Pavilion')
          return
        }
        if(this.state.occupencyLaz === ''){
          alert('กรุณาใส่จำนวนห้องพักของ Lazy')
          return
        }

        if(this.state.guestAva === ''){
          alert('กรุณาใส่จำนวนลูกค้าของ Avatara')
          return
        }
        if(this.state.guestPav === ''){
          alert('กรุณาใส่จำนวนลูกค้าของ Pavilion')
          return
        }
        if(this.state.guestLaz === ''){
          alert('กรุณาใส่จำนวนลูกค้าของ Lazy')
          return
        }

        if(this.state.roomRevenueAva === ''){
          alert('กรุณาใส่รายได้ห้องพักของ Avatara')
          return
        }
        if(this.state.roomRevenuePav === ''){
          alert('กรุณาใส่รายได้ห้องพักของ Pavilion')
          return
        }
        if(this.state.roomRevenueLaz === ''){
          alert('กรุณาใส่รายได้ห้องพักของ Lazy')
          return
        }

        if(this.state.bFRevenueAva === ''){
          alert('กรุณาใส่รายได้อาหารเช้าของ Avatara')
          return
        }
        if(this.state.bFRevenuePav === ''){
          alert('กรุณาใส่รายได้อาหารเช้าของ Pavilion')
          return
        }
        if(this.state.bFRevenueLaz === ''){
          alert('กรุณาใส่รายได้อาหารเช้าของ Lazy')
          return
        }

        if(this.state.otherRevenueAva === ''){
          alert('กรุณาใส่รายได้อาหารอื่นๆของ Avatara')
          return
        }
        if(this.state.otherRevenuePav === ''){
          alert('กรุณาใส่รายได้อาหารอื่นๆของ Pavilion')
          return
        }
        if(this.state.otherRevenueLaz === ''){
          alert('กรุณาใส่รายได้อาหารอื่นๆของ Lazy')
          return
        }
        insertReport({
          occupencyAva: this.state.occupencyAva,
          occupencyPav: this.state.occupencyPav,
          occupencyLaz: this.state.occupencyLaz,
          guestAva: this.state.guestAva,
          guestPav: this.state.guestPav,
          guestLaz: this.state.guestLaz,
          roomRevenueAva: this.state.roomRevenueAva,
          roomRevenuePav: this.state.roomRevenuePav,
          roomRevenueLaz: this.state.roomRevenueLaz,
          bFRevenueAva: this.state.bFRevenueAva,
          bFRevenuePav: this.state.bFRevenuePav,
          bFRevenueLaz: this.state.bFRevenueLaz,
          otherRevenueAva: this.state.otherRevenueAva,
          otherRevenuePav: this.state.otherRevenuePav,
          otherRevenueLaz: this.state.otherRevenueLaz,
          date: this.state.date
        }, res => {
          if(res.status){
            alert("ข้อมูลถูกบันทึก")
            this.props.closeInsert()
          }else{
            alert(res.msg)
          }
        })
    }

    render(){
        return (
            <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th width="40%">วันที่</th>
                                        <th width="20%">Avatara</th>
                                        <th width="20%">Samed Pavilion</th>
                                        <th width="20%">Lazy Sandals</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>จำนวนห้องพัก: </th>
                                        <td><input onChange={this.onIntChange} value={this.state.occupencyAva} name="occupencyAva" type="text" /></td>
                                        <td><input onChange={this.onIntChange} value={this.state.occupencyPav} name="occupencyPav" type="text" /></td>
                                        <td><input onChange={this.onIntChange} value={this.state.occupencyLaz} name="occupencyLaz" type="text" /></td>
                                    </tr>
                                    <tr>
                                        <th>จำนวนลูกค้า: </th>
                                        <td><input onChange={this.onIntChange} value={this.state.guestAva} name="guestAva" type="text" /></td>
                                        <td><input onChange={this.onIntChange} value={this.state.guestPav} name="guestPav" type="text" /></td>
                                        <td><input onChange={this.onIntChange} value={this.state.guestLaz} name="guestLaz" type="text" /></td>
                                    </tr>
                                    <tr>
                                        <th>รายได้ค่าห้อง: </th>
                                        <td><input onChange={this.onTextChange} value={this.state.roomRevenueAva} name="roomRevenueAva" type="text" /></td>
                                        <td><input onChange={this.onTextChange} value={this.state.roomRevenuePav} name="roomRevenuePav" type="text" /></td>
                                        <td><input onChange={this.onTextChange} value={this.state.roomRevenueLaz} name="roomRevenueLaz" type="text" /></td>
                                    </tr>
                                    <tr>
                                        <th>รายได้อาหารเช้า: </th>
                                        <td><input onChange={this.onTextChange} value={this.state.bFRevenueAva} name="bFRevenueAva" type="text" /></td>
                                        <td><input onChange={this.onTextChange} value={this.state.bFRevenuePav} name="bFRevenuePav" type="text" /></td>
                                        <td><input onChange={this.onTextChange} value={this.state.bFRevenueLaz} name="bFRevenueLaz" type="text" /></td>
                                    </tr>
                                    <tr>
                                        <th>รายได้อื่นๆ: </th>
                                        <td><input onChange={this.onTextChange} value={this.state.otherRevenueAva} name="otherRevenueAva" type="number" /></td>
                                        <td><input onChange={this.onTextChange} value={this.state.otherRevenuePav} name="otherRevenuePav" type="number" /></td>
                                        <td><input onChange={this.onTextChange} value={this.state.otherRevenueLaz} name="otherRevenueLaz" type="number" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-4">
                            <input onChange={this.setDate} type="date" />
                        </div>
                        <div className="col-4">
                            <button onClick={this.submitReport} className="btn btn-success">บันทึก</button>
                        </div>
                    </div>
        )
    }
}

const resultformating = (list) => {
  let date = []
  let roomOccupency = []
  let guests = []
  let roomRevenue = []
  let breakfastRevenue = []
  let otherRevenue = []
  let averageRoomRate = []
  let data = list.sort((a, b) => new Date(a.date) > new Date(b.date))
  data.forEach(x => {
    date = [ ...date, x.date]
    roomOccupency = [ ...roomOccupency, x.roomOccupency]
    guests = [ ...guests, x.guests]
    roomRevenue = [ ...roomRevenue, x.roomRevenue]
    breakfastRevenue = [ ...breakfastRevenue, x.breakfastRevenue]
    otherRevenue = [ ...otherRevenue, x.otherRevenue]
    let arr = x.roomRevenue/x.roomOccupency
    averageRoomRate = [ ...averageRoomRate, arr]
  })
  return {
    date,
    roomOccupency,
    guests,
    roomRevenue,
    breakfastRevenue,
    otherRevenue,
    averageRoomRate
  }
}

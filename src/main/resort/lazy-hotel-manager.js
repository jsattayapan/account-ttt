import React from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import moment from 'moment'

export default class LazyManager extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'main'
    }
  }
  changePage = (page) => {
    this.setState(() => ({currentPage:page}))
  }
  render(){

    if(this.state.currentPage === 'main'){
      return(
        <div className="row">
          <div className="col-3">
            <div onClick={() => this.changePage('bookings')} className="lazy-menu-item">
              Bookings
            </div>
          </div>
          <div className="col-3">
            <div className="lazy-menu-item">
              Rooms
            </div>
          </div>
          <div className="col-3">
            <div className="lazy-menu-item">
              Guest Profiles
            </div>
          </div>
        </div>
      )
    }
    if(this.state.currentPage === 'bookings'){
      return(
        <div className="row">
          <div className="col-9">
            <div className="row">
              <div className="col-4">
                  <label className="form-label">Check-in Date:</label>
                  <input className="form-control" />
              </div>
              <div className="col-4">
                  <label className="form-label">ค้นหา:</label>
                <input placeholder="ชื่อผู้เข้าพัก, Booking#, reference#" className="form-control" />
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="row">
              <div className="col-12">
                <button className="btn btn-success">Reload</button>
              </div>
              <div className="col-12">
                <button onClick={() => this.changePage('createBooking')} className="btn btn-info">สร้าง Bookings</button>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="col-12">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Check-In</th>
                <th>Check-Out</th>
                  <th>Name</th>
                  <th>Room Type</th>
                <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10/11/2020</td>
                <td>12/11/2020</td>
                  <td>Natee Matra</td>
                <td>Standard</td>
              <td>2,112.00.-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    if(this.state.currentPage === 'createBooking'){
      return (
        <CreateBooking changePage={this.changePage} />
      )
    }
  }
}

class CreateBooking extends React.Component{
  constructor(props){
    let today = new Date()
    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    super(props)
    this.state = {
      bookingType: '',
      reference: '',
      breakfastInclude: false,
      breakfastPrice: 0,
      checkIn: today,
      checkOut: tomorrow,
      numberOfGuest: 1,
      roomType: '',
      paymentType: '',
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequest: '',
      total: 0,
      groupName: '',
      creditCard: '',
      agentId: '123'
    }
  }

  submit = () => {
    let input = this.state
    if(input.bookingType === ''){
      alert('กรุณาระบุ Booking Type')
      return
    }else{
      if(input.bookingType === 'Group'){
        if(input.groupName === ''){
          alert('กรุณาระบุ Group name')
          return
        }
      }
      if(input.bookingType === 'Travel Agent'){
        if(input.agentId === ''){
          alert('กรุณาระบุ Travel Agent')
          return
        }
        if(input.reference === ''){
          alert('กรุณาระบุ reference #')
          return
        }
      }
      if(input.bookingType === 'Direct'){
        input.reference = ''
        input.agentId = ''
        input.groupName = ''
      }
    }
    if(input.title === ''){
      alert('กรุณาระบุ Title ผู้เข้าพัก')
      return
    }
    if(input.firstName === ''){
      alert('กรุณาระบุ First name ผู้เข้าพัก')
      return
    }
    if(input.lastName === ''){
      alert('กรุณาระบุ Last name ผู้เข้าพัก')
      return
    }
    if(input.checkIn === null){
      alert('กรุณาระบุ วันที่เข้าพัก')
      return
    }
    if(input.checkOut === null){
      alert('กรุณาระบุ วันที่กลับ')
      return
    }
    if(input.numberOfGuest === '' || isNaN(input.numberOfGuest)){
      alert('กรุณาระบุ จำนวนผู้เข้าพักให้ถูกต้อง')
      return
    }
    if(input.roomType === ''){
      alert('กรุณาระบุ Room type')
      return
    }
    if(input.breakfastInclude === ''){
      alert('กรุณาระบุ Breakfast included')
      return
    }
    if(input.breakfastInclude){
      if(input.breakfastPrice === '' || isNaN(input.breakfastPrice)){
        alert('กรุณาระบุราคา Breakfast ให้ถูกต้อง')
        return
      }
    }
    if(input.paymentType === ''){
      alert('กรุณาระบุ Status การจ่ายเงิน')
      return
    }
    alert('Success')

    console.log(input);
  }

  bookingTypeOnChange = input => {
    this.setState(() => ({
      bookingType: input.value
    }))
  }

  paymentTypeOnChange = input => {
    this.setState(() => ({
      paymentType: input.value
    }))
  }

  breakfastIncludeOnChange = input => {
    this.setState(() => ({
      breakfastInclude: input.value
    }))
  }

  stayPeriodOnChange = input => {
    console.log(input);
    const [start, end] = input
    this.setState(() => ({
      checkIn: start,
      checkOut: end
    }))
  }

  onTextChange = (e) => {
    const { name, value } = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  render(){
    const bookingTypeOptions = [
      {label: 'Direct', value: 'Direct'},
      {label: 'Group', value: 'Group'},
      {label: 'Travel Agent', value: 'Travel Agent'},
    ]
    const guestTitleOptions = [
      {label: 'Mr.', value: 'Mr.'},
      {label: 'Mrs.', value: 'Mrs.'},
      {label: 'Miss', value: 'Miss'},
      {label: 'Khun', value: 'Khun'},
    ]
    const roomTypeOptions = [
      {label: 'Standard', value: 'Standard'},
    ]
    const paymentStatusOptions = [
      {label: 'Await', value: 'await'},
      {label: 'Cash', value: 'cash'},
      {label: 'Bank Transfer', value: 'backTransfer'},
      {label: 'Credit card', value: 'creditCard'},
      {label: 'By Agent', value: 'agent'},
    ]
    const agentOptions = [
      {label: 'Booking.com', value: 'Booking.com'},
      {label: 'Agoda', value: 'Agoda'},
      {label: 'Hotel Beds', value: 'Hotel Beds'},
    ]

    let roomNight = moment(this.state.checkOut).diff(moment(this.state.checkIn), 'days')
    return (
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <h3>Booking Company</h3>
              <p>แหล่งที่มาของข้อมูลการจองห้องพัก</p>
            </div>
            <div className="col-3">
              <label className="label-control">Booking Type:</label>
            <Select onChange={this.bookingTypeOnChange} options={bookingTypeOptions} className="" />
            </div>
            {
              this.state.bookingType === 'Travel Agent' &&
              <div className="col-3">
                <label className="label-control">Agent Profile:</label>
              <Select options={agentOptions} className="" />
              </div>
            }
            {
              this.state.bookingType === 'Group' &&
              <div className="col-3">
                <label className="label-control">Group Name:</label>
              <input
                className="form-control"
                type='text'
                name='groupName' value={this.state.groupName}
                onChange={this.onTextChange} />
              </div>
            }
            <div className="col-3">
              <label className="label-control">Reference #:</label>
              <input className="form-control" type="text"
                name='reference' value={this.state.reference}
                onChange={this.onTextChange} />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12">
              <h3>Guests</h3>
              <p>ข้อมูลผู้เข้าพัก</p>
            </div>
            <div className="col-3">
              <label className="label-control">Title:</label>
            <Select
              onChange={input => {this.setState(() => ({title: input.value}))}}
               options={guestTitleOptions} className="" />
            </div>
            <div className="col-3">
              <label className="label-control">First name:</label>
            <input className="form-control" type="text"
              name='firstName' value={this.state.firstName}
              onChange={this.onTextChange} />
            </div>
            <div className="col-3">
              <label className="label-control">Last name:</label>
            <input className="form-control" type="text"
              name='lastName' value={this.state.lastName}
              onChange={this.onTextChange}
            />
            </div>
            <div className="col-3">
            </div>
            <div className="col-3">
              <label className="label-control">Email:</label>
            <input className="form-control" type="text"
              name='email' value={this.state.email}
              onChange={this.onTextChange}
             />
            </div>
            <div className="col-3">
              <label className="label-control">Phone:</label>
            <input className="form-control"
              name='phone' value={this.state.phone}
              onChange={this.onTextChange}
               type="text" />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12">
              <h3>Accomodation details</h3>
              <p>ข้อมูลห้องพัก</p>
            </div>
            <div className="col-3">
              <label className="label-control">Stay Period :</label>
              <DatePicker
                onChange={this.stayPeriodOnChange}
                startDate={this.state.checkIn}
                endDate={this.state.checkOut}
                minDate={new Date()}
                selectsRange
                inline
              />
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-6">
                  <p>Check In :</p>
                  <h4>{moment(this.state.checkIn).format('dddd, DD MMMM YYYY')}</h4>
                </div>
                <div className="col-6">
                  <p>Check Out :</p>
                  <h4>{this.state.checkOut !== null ? moment(this.state.checkOut).format('dddd, DD MMMM YYYY') : '-'}</h4>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  Room Night: <h4>{roomNight}</h4>
                </div>
              </div>
            </div>
            <div className="col-3">
            </div>
            <div className="col-3">
              <label className="label-control">Number of guest:</label>
            <input className="form-control" type="text"
              name='numberOfGuest' value={this.state.numberOfGuest}
              onChange={this.onTextChange} />
            </div>
            <div className="col-3">
              <label className="label-control">Room Type:</label>
            <Select
              onChange={input => {this.setState(() => ({roomType: input.value}))}}
               options={roomTypeOptions} className="" />
            </div>
            <div className="col-6">
            </div>
            <div className="col-3">
              <label className="label-control">Breakfast included:</label>
            <Select
              onChange={input => {this.setState(() => ({breakfastInclude: input.value}))}}
              options={[{label: 'Yes', value: true}, {label: 'No', value: false}]} className="" />
            </div>
            <div className="col-3">
              <label className="label-control">Breakfast price:</label>
            <input className="form-control"
              name='breakfastPrice' value={this.state.breakfastPrice}
              onChange={this.onTextChange}type="text" disabled={!this.state.breakfastInclude} />
            </div>
            <div className="col-6">
            </div>
            <div className="col-6">
              <label className="label-control">Special Request:</label>
            <input className="form-control"
              name='specialRequest' value={this.state.specialRequest}
              onChange={this.onTextChange}
              type="text" />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12">
              <h3>Payment</h3>
            <p>ข้อมูลการชำระเงิน</p>
            </div>
            <div className="col-3">
              <label className="label-control">Status:</label>
            <Select onChange={this.paymentTypeOnChange} options={paymentStatusOptions} className="" />
            </div>
            {
              this.state.paymentType === 'creditCard' &&
              <div className="col-3">
                <label className="label-control">Credit Card Number:</label>
                <input className="form-control"
                  name='creditCard' value={this.state.creditCard}
                  onChange={this.onTextChange}
                   type="text" />
              </div>
            }
            <br />
            <div className="col-3">
              <label className="label-control">Total amount:</label>
              <input className="form-control"
                name='total' value={this.state.total}
                onChange={this.onTextChange} type="text" />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-2">
              <button onClick={this.submit} className="btn btn-success">ยืนยัน</button>
            </div>
            <div className="col-2">
              <button onClick={() => this.props.changePage('bookings')} className="btn btn-danger">ยกเลิก</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

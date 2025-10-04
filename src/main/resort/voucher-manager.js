import React from 'react'
import moment from 'moment';
import numeral from 'numeral'
import ImageResize from 'image-resize';
import alertify from 'alertifyjs'
import Select from 'react-select'
import validator from 'validator'
import 'alertifyjs/build/css/alertify.min.css'
import 'alertifyjs/build/css/themes/default.min.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';


const { makePostRequest, makeGetRequest } = require('./../../function-helpers')
const { IP } = require('./../../constanst')



export default class Voucher extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      page: 'main',
      selectedId: ''
    }
  }

  changePage = (page) => {
    this.setState(() => ({ page }))
  }

  openVoucher = (id) => {
    this.setState(() => ({ page: 'voucherDetail', selectedId: id }))
  }

  render(){
    return (
      <div className="row">
        {
          this.state.page === 'main' &&
          <VoucherMain changePage={this.changePage} openVoucher={this.openVoucher} />
        }
        {
          this.state.page === 'createVoucher' &&
          <CreateVoucher changePage={this.changePage} openVoucher={this.openVoucher} />
        }
        {
          this.state.page === 'blackOutDate' &&
          <BlackOutDate changePage={this.changePage} />
        }
        {
          this.state.page === 'voucherDetail' && this.state.selectedId !== '' &&
          <VoucherDetail changePage={this.changePage} id={this.state.selectedId} />
        }
      </div>
    )
  }
}

class BlackOutDate extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      date: moment(),
      blackOutDate: ''
    }
  }

  componentDidMount(){
    makePostRequest('resort/getVoucherBlackOutDate',{date: this.state.date}, res => {
      if(res.status){
        this.setState(() => ({
          blackOutDate: res.payload
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  displayDates = () => {
    let dates = []
    for(let x = 0; x < 7; x++){
      let newDate = moment(this.state.date).add(x, 'days').format('DD/MM/YYYY')
      console.log(newDate);
      dates = [ ...dates, <td>{newDate}</td> ]
    }
    return dates
  }

  updateBlackOutDate = (action, date, property, roomType) => {
    makePostRequest('resort/updateVoucherBlackOutDate',{action, date, property, roomType }, res => {
      if(res.status){
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }

  displayBlackOutable = (property, roomType) => {
    let list = []
    for(let x = 0; x < 7; x++){
      let newDate = moment(this.state.date).add(x, 'days').format('DD/MM/YYYY')
      let found = this.state.blackOutDate.find(x => x.date === newDate)
      found = found !== undefined ? found.blackOutDateList.find(x => (x.property === property && x.roomType ===roomType)) : null
      if(found){
        list = [...list, <td><button onClick={() => this.updateBlackOutDate('remove', newDate, property, roomType)} className="btn btn-dark">เต็ม</button></td>]
      }else{
        list = [...list, <td><button onClick={() => this.updateBlackOutDate('add', newDate, property, roomType)} className="btn btn-success">ว่าง</button></td>]
      }
    }
    return list
  }

  changeDateBtn = (action) => {
    if(action === 'pre'){
      this.setState(() => ({
        date: moment(this.state.date).subtract(7, 'days')
      }), () => {
        this.componentDidMount()
      })
    }else{
      this.setState(() => ({
        date: moment(this.state.date).add(7, 'days')
      }), () => {
        this.componentDidMount()
      })
    }
  }

  render(){
    return(
      <div className="col-12">
        <div className="row justify-content-center">
          <div className="col-2">
            <button onClick={() => this.changeDateBtn('pre')} className="btn btn-dark">Pre</button>
          </div>
          <div className="col-2">
            <h4>
              {this.state.date.format('DD/MM/YYYY')}
            </h4>
          </div>
          <div className="col-2">
            <button onClick={() => this.changeDateBtn('next')} className="btn btn-dark">Next</button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <table className="table table-striped">
              <tbody>
                <tr>
                  <th>Avatara Resort</th>
                {
                  this.displayDates()
                }
                </tr>
                <tr>
                  <th>Deluxe Double</th>
                {
                  this.state.blackOutDate !== '' && this.displayBlackOutable('Avatara Resort', 'Deluxe Double')
                }
                </tr>
                <tr>
                  <th>Deluxe Twin</th>
                  {
                    this.state.blackOutDate !== '' && this.displayBlackOutable('Avatara Resort', 'Deluxe Twin')
                  }
                </tr>
                <tr>
                  <th>Deluxe Triple</th>
                  {
                    this.state.blackOutDate !== '' && this.displayBlackOutable('Avatara Resort', 'Deluxe Triple')
                  }
                </tr>
                <tr>
                  <th>Samed Pavilion Resort</th>
                  {
                    this.displayDates()
                  }
                </tr>
                <tr>
                  <th>Deluxe Double</th>
                  {
                    this.state.blackOutDate !== '' && this.displayBlackOutable('Samed Pavilion Resort', 'Deluxe Double')
                  }
                </tr>
                <tr>
                  <th>Deluxe Twin</th>
                  {
                    this.state.blackOutDate !== '' && this.displayBlackOutable('Samed Pavilion Resort', 'Deluxe Twin')
                  }
                </tr>
                <tr>
                  <th>Deluxe Triple</th>
                  {
                    this.state.blackOutDate !== '' && this.displayBlackOutable('Samed Pavilion Resort', 'Deluxe Triple')
                  }
                </tr>
                <tr>
                  <th>Deluxe Family</th>
                  {
                    this.state.blackOutDate !== '' && this.displayBlackOutable('Samed Pavilion Resort', 'Deluxe Family')
                  }
                </tr>
                <tr>
                  <th>Lazy Sandals Hostel</th>
                  {
                    this.displayDates()
                  }
                </tr>
                <tr>
                  <th>Deluxe Double</th>
                  {
                    this.state.blackOutDate !== '' && this.displayBlackOutable('Lazy Sandals Hostel', 'Deluxe Double')
                  }
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

class VoucherDetail extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      id: '',
      title: '',
      firstName: '',
      lastName: '',
      property: '',
      phone: '',
      packageType: '',
      remark: '',
      paymentType: '',
      price: 0,
      paymentReference: '',
      status: '',
      bookingReference: '',
      createBy: '',
      timestamp: '',
      email: '',
      numberOfNight: '',
      paymentVerify: '',
      checkInDetail: '',
      number: '',
      name: '',
      expiry: ''
    }
  }

  componentDidMount(){
    makePostRequest('resort/getVoucherById', {id: this.props.id}, res => {
      console.log(res);
      if(res.status){
        this.setState(() => ({
          id: res.voucher.id,
          title: res.voucher.title,
          firstName: res.voucher.firstName,
          lastName: res.voucher.lastName,
          property: res.voucher.property,
          phone: res.voucher.phone,
          packageType: res.voucher.packageType,
          remark: res.voucher.remark,
          price: res.voucher.price,
          paymentType: res.voucher.paymentType,
          paymentReference: res.voucher.paymentReference,
          status: res.voucher.status,
          bookingReference: res.voucher.bookingReference,
          createBy: res.voucher.createBy,
          timestamp: res.voucher.timestamp,
          email: res.voucher.email,
          numberOfNight: res.voucher.numberOfNight,
          paymentVerify: res.voucher.paymentVerify,
          checkInDetail: res.voucher.checkInDetail || '',
          number: res.voucher.number,
          name: res.voucher.name,
          expiry: res.voucher.expiry
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  sendEmail = () => {
    alertify.confirm('คุณต้องการส่งใบ Voucher ให้ลูกค้า', () => {
      makePostRequest('resort/sendVoucherEmail', {id: this.state.id}, res => {
        if(res.status){
          alertify.success('E-Voucher ได้ถูกส่งให้ลูกค้าแล้ว');
        }else{
          alertify.error(res.msg);
        }
      })
    }, () => {

    }).set({title:"ส่ง Voucher ให้ลูกค้าทาง Email"}).set({labels:{ok:'ตกลง', cancel: 'ยกเลิก'}})
  }

  cancelVoucher = () => {
    const voucherId = this.props.id
    const reset = this
    alertify.prompt("กรุณาใส่หมายเหตุที่ต้องการยกเลิก Voucher นี้","", function(evt, value ){
      makePostRequest('resort/cancelVoucher', {id: voucherId, remark: value}, (res) => {
        if(res.status){
          alertify.success(`Voucher id:${voucherId} ทำการยกเลิกแล้ว`);
          reset.componentDidMount()
        }else{
          alertify.error(res.msg)
        }
      })
  }, () => {
  }).set({title:"ยกเลิก Voucher"}).set({labels:{ok:'ยืนยัน', cancel: 'ยกเลิก'}})
  }

  insertBookingReference = () => {
    const voucherId = this.props.id
    const reset = this
    alertify.prompt("กรุณาใส่ Reference ของ Booking ที่ใช้ Voucher นี้","", function(evt, value ){
      makePostRequest('resort/insertBookingReference', {id: voucherId, bookingReference: value}, (res) => {
        if(res.status){
          alertify.success(`Voucher id:${voucherId} ทำการสำรองห้องแล้ว`);
          reset.componentDidMount()
        }else{
          alertify.error(res.msg)
        }
      })
  }, () => {
  }).set({title:"สำรองห้องพัก"}).set({labels:{ok:'ยืนยัน', cancel: 'ยกเลิก'}})
  }

  confirmPayment = () => {
    const username = 'olotem321'
    makePostRequest('resort/confirmPayment', {id: this.props.id, username }, res => {
      if(res.status){
        alertify.success(`Voucher id:${this.props.id} ยืนยันการจ่ายเงิน`);
        this.componentDidMount()
      }else{
        alertify.error(res.msg)
      }
    })
  }

  displayCheckInDate = (input, night) => {
    let checkOut = new Date(input)
    checkOut.setDate(checkOut.getDate() + night)
    const publicHoliday = [
      '26/02/2021',
      '27/02/2021',
      '10/04/2021',
      '11/04/2021',
      '12/04/2021',
      '13/04/2021',
      '14/04/2021',
      '15/04/2021',
      '16/04/2021',
      '17/04/2021',
      '01/05/2021',
      '02/05/2021',
      '03/05/2021',
      '24/07/2021',
      '25/07/2021',
      '23/10/2021',
      '24/10/2021',
      '04/12/2021',
      '05/12/2021',
      '10/12/2021',
      '11/12/2021',
    ]
    let total = 0

    let weekend = 0
    let longWeekend = 0
    let holiday = 0

    for(let x = 0; x < night; x++){
      let date = new Date(input)
      date.setDate(date.getDate() + x)
      let day = date.getDay()
      let found = publicHoliday.find(x => x === moment(date).format('DD/MM/YYYY'))
      if(found){
        if(day === 5 || day === 6){
          total += 1500
          longWeekend++
        }else {
          total += 1000
          holiday++
        }
      }else{
        if(day === 5 || day === 6){
          total += 500
          weekend++
        }
    }
  }
    let text = ''
    if(weekend > 0){
      text = text + weekend + ' Weekend '
    }
    if(holiday > 0){
      text = text + ', ' + holiday + ' Holiday '
    }
    if(longWeekend > 0){
      text = text + ', ' + longWeekend + ' Long Weekend '
    }
    if(total > 0){
      text = text + ' (ส่วนต่าง ' + total + ' บาท)'
    }
    console.log('total', total);
    return `${moment(input).format('DD MMM YYYY')} - ${moment(checkOut).format('DD MMM YYYY')} ${total > 0 ? text  : ''}`
}

  render(){
    let numberOfGuest =
        (this.state.packageType === 'Deluxe Double' || this.state.packageType === 'Deluxe Twin') ?
        2 : this.state.packageType === 'Deluxe Triple' ?
         3 : 4
    return (
      <div className="col-12">
        <div className="row mb-3">
          <div className="col-12">
            <button onClick={() => this.props.changePage('main')} className="btn btn-primary">{'<'}</button>
          </div>
        </div>
        <div className='row'>
          <div className="col-12">
            <Tabs>
    <TabList>
      <Tab>Voucher Info.</Tab>
    {this.state.checkInDetail !== '' && <Tab>Check-in Info.</Tab>}
    </TabList>

    <TabPanel>
      <div className="row">
        <div className="col-12">
          <h3>
            ข้อมูล Voucher
          </h3>
        </div>
        <div className="col-12">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Voucher Id :</th>
              <td>{this.state.id}</td>
              </tr>
              <tr>
                <th>Status :</th>
              <td>
                {this.state.status === 'Valid' && <span class="badge bg-success">Valid</span>}
                {this.state.status === 'Cancel' && <span class="badge bg-danger">Cancel</span>}
                {this.state.status === 'Complete' && <span class="badge bg-secondary">Complete</span>}
                {this.state.status === 'Request' && <span class="badge bg-warning">Request</span>}
                {this.state.status === 'Await' && <span class="badge bg-warning">Await</span>}
              </td>
              </tr>
              <tr>
                <th>ชื่อลูกค้า</th>
              <td>{this.state.title} {this.state.firstName} {this.state.lastName}</td>
              </tr>
              <tr>
                <th>Package</th>
              <td>{this.state.property} - {this.state.packageType}</td>
              </tr>
              <tr>
                <th>จำนวนคืน</th>
              <td>{this.state.numberOfNight}</td>
              </tr>
              <tr>
                <th>Contact No</th>
              <td>{this.state.phone}</td>
              </tr>
              <tr>
                <th>Email</th>
              <td>{this.state.email}</td>
              </tr>
              <tr>
                <th>Remark</th>
              <td>{this.state.remark}</td>
              </tr>
              <tr>
                <th>ยอดชำระ</th>
              <td>{this.state.price}</td>
              </tr>
              <tr>
                <th>ชำระเงินโดย</th>
              <td>{this.state.paymentType} <br />
                {
                  this.state.paymentType === 'creditCard' &&
                  <div>
                    <Cards
                  expiry={this.state.expiry}
                  name={this.state.name}
                  number={this.state.number}
                />
                  </div>
                  }
                  {
                    this.state.paymentType === 'bankTransfer' &&
                    <img alt='Transfer Receipt' src={IP+'/public/paymentReference/'+this.state.paymentReference} width='500' />
                    }
          </td>
              </tr>
              <tr>
                <th>Booking Reference</th>
              <td>
                {
                  this.state.status === 'Request' ? <button onClick={this.insertBookingReference} className="btn btn-info">Insert Booking Reference</button> : this.state.bookingReference
                }
              </td>
              </tr>
              <tr>
                <th>สร้างโดย</th>
              <td>{this.state.createBy}</td>
              </tr>
              <tr>
                <th>วันที่สร้าง</th>
              <td>{moment(this.state.timestamp).format('YT')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row justify-content-center">
        {
          (this.state.status === 'Valid' &&
          this.state.paymentVerify) ?
          <div className="col-6 col-md-3">
            <button onClick={this.sendEmail} className="btn btn-info">Send E-Voucher to Customer</button>
          </div>
          :''
        }
        {
          (this.state.status === 'Valid' || this.state.status === 'Await') &&
          !this.state.paymentVerify &&
          <div className="col-6 col-md-3">
            <button onClick={this.confirmPayment} className="btn btn-success">ยืนยันการชำระเงิน</button>
          </div>
        }
        {
          (this.state.status === 'Valid' || this.state.status === 'Await') &&
          <div className="col-6 col-md-3">
            <button onClick={this.cancelVoucher} className="btn btn-danger">ยกเลิก Voucher นี้</button>
          </div>
        }
      </div>
    </TabPanel>
    {this.state.checkInDetail !== '' && <TabPanel>
      <div className="row">
        <div className="col-12">
          <h3>ข้อมูล Check-in</h3>
        </div>
        <div className="col-12">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>วันที่เข้าพัก</th>
              <td>{this.displayCheckInDate(this.state.checkInDetail.guestCheckIn, this.state.numberOfNight)}</td>
              </tr>
              <tr>
                <th>Extra</th>
              <td>
                {
                  this.state.checkInDetail.total > 0 ?
                  <ul>
                  {this.state.checkInDetail.addFerry ?
                    <li>เรือเฟอรี่ไปกลับสำหรับ {numberOfGuest} ท่าน (+{numeral(numberOfGuest*300).format('0,0')} บาท)</li> : ''
                  }
                  {this.state.checkInDetail.addBreakfast ?
                    <li>อาหารเช้าสำหรับ {numberOfGuest} ท่าน {this.state.numberOfNight} วัน (+{
                  numeral(numberOfGuest*200*this.state.numberOfNight).format('0,0')} บาท)</li> : ''
                  }
                  {this.state.checkInDetail.addBirthdayRoomSet ?
                    <li>Birthday Room Set (+1,200 บาท)</li> : ''
                  }
                  {this.state.checkInDetail.addHoneyMoonRoomSet ?
                    <li>Honey Moon Room Set (+1,200 บาท)</li> : ''
                  }
                  {this.state.checkInDetail.addMotorbike ?
                    <li>มอเตอร์ไซเช่า 1 วัน (+300 บาท)</li> : ''
                  }
                  {this.state.checkInDetail.addSupVoucher ?
                    <li>Voucher Stand-Up Paddle Board 1 ชั่วโมง (+350 บาท)</li> : ''
                  }
                  {this.state.checkInDetail.addWindsurfVoucher ?
                    <li>Voucher Windsurfing Lesson 2 ชั่วโมง (+2,200 บาท)</li> : ''
                  }
                  </ul>
                  : '-'
                }
              </td>
              </tr>
              <tr>
                <th>ราคาที่ต้องชำระเพิ่ม</th>
              <td>{numeral(this.state.checkInDetail.total).format('0,0')} บาท</td>
              </tr>
              {
                this.state.checkInDetail.total > 0 &&
                <tr>
                  <th>ชำระโดย</th>
                <td>
                  <div><b>{this.state.checkInDetail.guestPaymentType === 'creditCard' ? 'บัตรเครดิต' : 'โอนเงิน'}</b></div>
                {
                  this.state.checkInDetail.guestPaymentType === 'creditCard' &&
                  <div>
                    <Cards
                  expiry={this.state.checkInDetail.cardExpiry}
                  name={this.state.checkInDetail.cardName}
                  number={this.state.checkInDetail.cardNumber}
                />
                  </div>
                }
                {
                  this.state.checkInDetail.guestPaymentType === 'bankTransfer' &&
                  <img alt='Transfer Receipt' src={IP+'/public/paymentReference/'+this.state.checkInDetail.guestPaymentReference} width='500' />
                }
              </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </TabPanel>}
  </Tabs>
          </div>
        </div>

      </div>
    )
  }

}


class CreateVoucher extends React.Component {


  constructor(props){
    super(props)
    this.state = {
      title: '',
      firstName: '',
      lastName: '',
      packageType: '',
      paymentType: '',
      phone: '',
      property: '',
      remark: '',
      paymentReference: '',
      price: '',
      email: '',
      numberOfNight: 1
    }
  }

  onTextChange = e => {
    const {value, name} = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  onNumberChange = e => {
    const {value, name} = e.target
    if(validator.isInt(value) || value === ''){
      this.setState(() => ({
        [name]: value
      }))
    }
  }

  paymentTypeOnChange = input => {
    this.setState(() => ({
      paymentType: input.value,
      paymentReference: ''
    }))
  }

  onSubmit = () => {
    let {
      title, firstName, lastName, packageType, paymentType, phone, paymentReference, remark, price, property, email, numberOfNight
    } = this.state
    if(title === ''){
      alert(`กรุณาระบุ Title`)
      return
    }
    if(firstName.trim() === ''){
      alert(`กรุณาระบุ First name`)
      return
    }
    if(lastName.trim() === ''){
      alert(`กรุณาระบุ Last name`)
      return
    }
    if(phone.trim() === ''){
      alert(`กรุณาระบุ เบอร์โทรศัพท์`)
      return
    }
    if(!validator.isEmail(email)){
      alert(`กรุณาระบุ Email ให้ถูกต้อง`)
      return
    }
    if(property === ''){
      alert(`กรุณาระบุ Property`)
      return
    }
    if(packageType === ''){
      alert(`กรุณาระบุ Package`)
      return
    }
    if(numberOfNight === '' || numberOfNight < 1){
      alert(`กรุณาระบุจำนวนวันให้ถูกต้อง`)
      return
    }
    if(price === '' || price <= 0){
      alert(`กรุณาระบุ ราคาให้ถูกต้อง`)
      return
    }
    if(paymentType === ''){
      alert(`กรุณาระบุ ช่องทางการชำระเงิน`)
      return
    }else{
      if(paymentType === 'creditCard'){
        if(paymentReference.trim() === ''){
          alert(`กรุณาระบุ หมายเลขบัตรเครดิต`)
          return
        }
      }
      if(paymentType === 'bankTransfer'){
        if(paymentReference === ''){
          alert(`กรุณาระบุ หลักฐานการโอนเงิน`)
          return
        }
      }
    }
    if(paymentType === 'bankTransfer'){
      const formData = new FormData();
      formData.append('title', title);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('packageType', packageType);
      formData.append('paymentType', paymentType);
      formData.append('phone', phone);
      formData.append('remark', remark);
      formData.append('price', price);
      formData.append('property', property);
      formData.append('email', email);
      formData.append('numberOfNight', numberOfNight);
      formData.append('paymentReference', paymentReference);
      makePostRequest('resort/createVoucherWithImage', formData, res => {
        if(res.status){
          this.props.openVoucher(res.id)
        }else{
          alertify.error(res.msg);
        }
      })
    }else{
      makePostRequest('resort/createVoucher', this.state, res => {
        if(res.status){
          this.props.openVoucher(res.id)
        }else{
          alertify.error(res.msg);
        }
      })
    }
  }

  onPriceChange = e => {
    let value = e.target.value
    if(validator.isFloat(value) || value === ''){
      this.setState(() => ({ price: value }))
    }
  }

  uploadPaymentReceipt = (e) => {
    const imageFile = e.target.files[0]
    const name = e.target.files[0].name
    var imageResize = new ImageResize({
      format: 'png',
      width: 500,
      quantity: 1
    });
    let dataURLtoFile = (dataurl, filename) => {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)

      while(n--){
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime})
    }
    imageResize.play(URL.createObjectURL(imageFile)).then(res => {
      let file = dataURLtoFile(res,name)
      this.setState(() => ({
        paymentReference: file
      }))
    })
  }

  render(){
    const guestTitleOptions = [
      {label: 'Mr.', value: 'Mr.'},
      {label: 'Mrs.', value: 'Mrs.'},
      {label: 'Miss', value: 'Miss'},
      {label: 'Khun', value: 'Khun'},
    ]

    const packageOptions = [
      {label: 'Deluxe Double', value: 'Deluxe Double'},
      {label: 'Deluxe Twin', value: 'Deluxe Twin'},
      {label: 'Deluxe Triple', value: 'Deluxe Triple'},
    ]

    const paymentOptions = [
      {label: 'Cash', value: 'cash'},
      {label: 'Bank Transfer', value: 'bankTransfer'},
      {label: 'Credit card', value: 'creditCard'},
    ]
    const propertyOptions = [
      {label: 'Avatara Resort', value: 'AVA'},
      {label: 'Samed Pavilion Resort', value: 'PAV'},
      {label: 'Lazy Sandels', value: 'LAZ'},
    ]
    return (
      <div className="col-12">
        <div className="row">
          <div className="col-12">
            <h3>Voucher# : 12354</h3>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12">
            <h3>ข้อมูลลูกค้า</h3>
          </div>
          <div className="col-12 col-md-2">
            <label className="label-control">Title:</label>
            <Select
            onChange={input => {this.setState(() => ({title: input.value}))}}
             options={guestTitleOptions} className="" />
          </div>
          <div className="col-12 col-md-3">
            <label className="label-control">
              First name
            </label>
            <input name="firstName" onChange={this.onTextChange} value={this.state.firstName} type="text" className="form-control" />
          </div>
          <div className="col-12 col-md-3">
            <label className="label-control">
              Last name
            </label>
            <input name="lastName" onChange={this.onTextChange} value={this.state.lastName} type="text" className="form-control" />
          </div>
          <div className="col-12 col-md-3">
            <label className="label-control">
              เบอร์โทรศัพท์
            </label>
            <input name="phone" onChange={this.onTextChange} value={this.state.phone} type="text" className="form-control" />
          </div>
          <div className="col-12 col-md-3">
            <label className="label-control">
              Email
            </label>
            <input name="email" onChange={this.onTextChange} value={this.state.email} type="text" className="form-control" />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12">
            <h3>ข้อมูล Package</h3>
          </div>
          <div className="col-12 col-md-3">
            <label className="label-control">
              Package
            </label>
            <Select
            onChange={input => {this.setState(() => ({property: input.value}))}}
             options={propertyOptions} className="" />
          </div>
          <div className="col-12 col-md-3">
            <label className="label-control">
              Package
            </label>
            <Select
            onChange={input => {this.setState(() => ({packageType: input.value}))}}
             options={packageOptions} className="" />
          </div>
          <div className="col-12 col-md-2">
            <label className="label-control">
              จำนวนคืน
            </label>
            <input name="numberOfNight" onChange={this.onNumberChange} value={this.state.numberOfNight} type="text" className="form-control" />
          </div>
          <div className="col-12 col-md-3">
            <label className="label-control">
              Remark
            </label>
            <input name="remark" onChange={this.onTextChange} value={this.state.remark} type="text" className="form-control" />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12">
            <h3>
              ข้อมูลการชำระเงิน
            </h3>
          </div>
          <div className="col-12 col-md-3">
            <label className="label-control">
              ราคา
            </label>
            <input value={this.state.price} onChange={this.onPriceChange} type="text" className="form-control" />
          </div>
          <div className="col-12 col-md-3">
            <label className="label-control">ชำระโดย:</label>
          <Select onChange={this.paymentTypeOnChange} options={paymentOptions} className="" />
          </div>
          {
            this.state.paymentType === 'bankTransfer' &&
            <div className="col-12 col-md-3">
              <label className="label-control">
                Payment Reference:
              </label>
                <input id="paymentImage" type="file" onChange={this.uploadPaymentReceipt} accept="image/*" />
            </div>
          }
          {
            this.state.paymentType === 'creditCard' &&
            <div className="col-12 col-md-3">
              <label className="label-control">
                หมายเลขบัตร:
              </label>
              <input name="paymentReference" onChange={this.onTextChange} value={this.state.paymentReference} type="text" className="form-control" />
            </div>
          }
        </div>
        <hr />
        <BookingConditions />
        <div className="row mt-4">
          <div className="col-6 col-md-3">
            <button onClick={this.onSubmit} className="btn btn-success">
              บันทึก
            </button>
          </div>
          <div className="col-6 col-md-3">
            <button onClick={() => this.props.changePage('main')} className="btn btn-danger">
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const BookingConditions = () =>
<div className="row">
  <div className="col-12">
    <h3>เงื่อนไขและข้อกำหนด</h3>
  <ol>
    <li>บัตรห้องพักสามารถใช้ได้ตั้งแต่วันที่ 15 มกราคม - 24 ธันวาคม 2564</li>
  <li>เข้าพักคืนวันศุกร์และเสาร์ชำระเพิ่ม 500 บาท / ห้อง / คืน</li>
<li>ชำระเพิ่ม 1000 บาท / ห้อง / คืน เมื่อเข้าพักช่วงวันหยุดยาวต่อเนื่อง ได้แก่ คืนวันที่ 26-27 กุมภาพันธ์, 10-17 เมษายน, 1-3 พฤษภาคม, 24-25 กรกฎาคม, 23-24 ตุลาคม, 4-5 และ 10-11 ธันวาคม 2564</li>
<li>กรุณาสำรองห้องพักล่วงหน้าอย่างน้อย 14 วันก่อนเข้าพัก และการยืนยันห้องพักขึ้นอยู่กับสถานะห้องว่าง ณ วันทำการจอง</li>
<li>กรุณาแจ้งหมายเลขบัตรห้องพักแก่พนักงานเมื่อทำการจองห้องพัก</li>
<li>บัตรห้องพักนี้สามารถใช้ได้เพียง 1 ครั้ง เท่านั้น และต้องมอบบัตรตัวจริงนี้แก่พนักงานเมื่อเข้าพัก</li>
<li>บัตรห้องพักนี้ไม่สามารถเปลี่ยนเป็นเงินสดได้ และไม่สามารถออกบัตรใหม่ทดแทนให้ในกรณีบัตรสูญหายหรือถูกขโมย</li>
<li>ราคานี้ไม่สามารถใช้ได้กับการเข้าพักแบบหมู่คณะหรือกรุ๊ปทัวร์ได้</li>
  </ol>
  </div>
</div>

class VoucherMain extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      search: '',
      voucherList: []
    }
  }

  onSearchChange = (e) => {
    const value = e.target.value
    this.setState(() => ({
      search: value
    }))
  }

  componentDidMount(){
    makeGetRequest('resort/getVouchers', res => {
      if(res.status){
        const voucherList = res.payload.sort((x, y) => {
              return new Date(y.timestamp) - new Date(x.timestamp);
        })
        console.log(res);
        this.setState(() => ({
          voucherList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return (
        <div className="
          col-12">
          <div className="row mt-4">
            <div className="col-12 col-md-4">
              <button
                onClick={() => this.props.changePage('createVoucher')}
                 className="btn btn-success">
                สร้าง Voucher ใหม่
              </button>
            </div>
            <div className="col-12 col-md-4">
              <button
                onClick={() => this.props.changePage('blackOutDate')}
                 className="btn btn-dark">
                กำหนดห้องพัก
              </button>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12 col-md-5">
              <label className="label-control">
                ค้นหา
              </label>
              <input onChange={this.onSearchChange} value={this.state.search} type="text" className="form-control" />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>รหัส Voucher</th>
                    <th>ชื่อลูกค้า</th>
                      <th>Voucher Package</th>
                    <th>Status</th>
                  <th>ราคา</th>
                  <th>สร้างเมื่อ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.voucherList.filter(x => {
                    let name = `${x.title}  ${x.firstName} ${x.lastName}`
                    name = name.toLowerCase()
                    let search = this.state.search.toLowerCase()
                    if(this.state.search === ''){
                      return true
                    }
                    if(name.includes(search)){
                      return true
                    }
                    if(x.id.toLowerCase().includes(search)){
                      return true
                    }
                    return false
                  }).map(voucher =>
                    <tr onClick={() =>this.props.openVoucher(voucher.id)}>
                      <td>{voucher.id}</td>
                    <td>{`${voucher.title} ${voucher.firstName} ${voucher.lastName}`}</td>
                  <td>{`${voucher.property} - ${voucher.packageType}`}</td>
                <td align="center">
                  <h5>
                    {voucher.status === 'Valid' && <span className="badge badge-success">Valid</span>}
                    {voucher.status === 'Complete' && <span className="badge badge-secondary">Complete</span>}
                    {voucher.status === 'Cancel' && <span className="badge badge-danger">Cancel</span>}
                    {voucher.status === 'Request' && <span className="badge badge-warning">Request</span>}
                    {voucher.status === 'Await' && <span className="badge badge-warning">Await</span>}
                  </h5>
                </td>
                <td align="right">{numeral(voucher.price).format('0,0')}.-</td>
                    <td>{moment(voucher.timestamp).format('DD/MM/YYYY HH:mm')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    )
  }
}


import React from 'react'
import DatePicker from "react-datepicker";
import Select from 'react-select'
import ReactDOMServer from 'react-dom/server'
import moment from 'moment'
import numeral from 'numeral'
import ImageResize from 'image-resize';

import avataraLogo from './logos/avatara-logo.png'
import samedPavilionLogo from './logos/samed-pavilion-logo.png'
import lazyLogo from './logos/lazy-logo.png'
import jepLogo from './logos/jep-logo.png'

import { addNewCompany, getCompanyList, notifyNewDirectBooking } from './tunnel.js'

function App() {
  return (
    <div className="App">
      <MainSection />
    </div>
  );
}

class MainSection extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      title: 'Khun',
      bookingId: '',
      firstName:'',
      lastName: '',
      checkIn: new Date(),
      checkOut: new Date(),
      property: 'Avatara Resort',
      avaDbl: 0,
      avaTwin: 0,
      avaTriple: 0,
      pavDbl:0,
      pavTwin:0,
      pavTriple: 0,
      pavFamily: 0,
      pavFamilyConnect: 0,
      pavCattliyaSuite: 0,
      jepStd: 0,
      jepSuper: 0,
      lazyStd:0,
      total: 0,
      breakfast: true,
      paymentType: 'transfer',
      extra: 0,
      extraChild: 0,
      request: '',
      receiptImage: '',
      receiptImage2: '',
      fullyPaid: 100,
      fullAmount: 0,
      mobile: '',

      showAddCompany: false,
      textCompany: '',
      companyList: [],
      selectedCompany: ''
    }
  }

  componentDidMount(){
    getCompanyList(res => {
      if(res.status){
        this.setState(() => ({
          companyList: res.companyList
        }))
      }
    })
  }

  titleOnChange = input => {
    this.setState(() => ({
      title: input.value
    }))
  }

  propertyOnChange = input => {
    this.setState(() => ({
      property: input.value,
      avaDbl: 0,
      avaTwin: 0,
      avaTriple: 0,
      pavDbl:0,
      pavTwin:0,
      jepStd: 0,
      jepSuper: 0,
      pavTriple: 0,
      pavFamily: 0,
      lazyStd:0,
      pavFamilyConnect: 0,
      pavCattliyaSuite: 0,
    }))
  }

  submitOnClick = () => {
    const {
      breakfast,
      total, paymentType, jepStd, jepSuper, extra, extraChild, request, fullyPaid, fullAmount, pavFamilyConnect, pavCattliyaSuite,
      property, title, firstName, lastName, bookingId, checkIn, checkOut, avaDbl, avaTwin, lazyStd, avaTriple,pavDbl, pavTwin, pavTriple, pavFamily} = this.state
    const logo = property === 'Avatara Resort' ? avataraLogo : property === 'Samed Pavilion Resort' ? samedPavilionLogo : property === 'Jep Bungalow' ? jepLogo: lazyLogo
    const confirmWindow = window.open("Confirm", '', "width=595,height=842");
    let style = property === 'Avatara Resort' ? {marginTop: '-20px'} : {}

    let numberOfRoom = 0;
    let numberOfGuest = 0;
    let roomList = []
    if(property === 'Avatara Resort'){
      roomList = [
        {type: 'Deluxe Double', quantity: parseInt(avaDbl)},
        {type: 'Deluxe Twin', quantity: parseInt(avaTwin)},
        {type: 'Deluxe Triple', quantity: parseInt(avaTriple)},
      ]
      roomList = roomList.filter(x => x.quantity !== 0)
      numberOfRoom = roomList.reduce((total, x) => total += x.quantity, 0)
    }

    if(property === 'Samed Pavilion Resort'){
      roomList = [
        {type: 'Deluxe Double', quantity: parseInt(pavDbl)},
        {type: 'Deluxe Twin', quantity: parseInt(pavTwin)},
        {type: 'Deluxe Triple', quantity: parseInt(pavTriple)},
        {type: 'Deluxe Family', quantity: parseInt(pavFamily)},
        {type: 'Family Connected', quantity: parseInt(pavFamilyConnect)},
        {type: 'Cattleya Suite', quantity: parseInt(pavCattliyaSuite)},
      ]
      roomList = roomList.filter(x => x.quantity !== 0)
      numberOfRoom = roomList.reduce((total, x) => total += x.quantity, 0)
    }

    if(property === 'Jep Bungalow'){
      roomList = [
        {type: 'Standard', quantity: parseInt(jepStd)},
        {type: 'Superior', quantity: parseInt(jepSuper)},
      ]
      roomList = roomList.filter(x => x.quantity !== 0)
      numberOfRoom = roomList.reduce((total, x) => total += x.quantity, 0)
    }


    if(property === 'Lazy Sandals Hotel'){
      roomList = [
        {type: 'Standard Double', quantity: parseInt(lazyStd)},
      ]
      numberOfRoom = parseInt(lazyStd)
    }

    if(parseInt(extra) !== 0){
      roomList = [...roomList, {type: 'Extra Adult', quantity: parseInt(extra)}]
    }

    if(parseInt(extraChild) !== 0){
      roomList = [...roomList, {type: 'Extra Child', quantity: parseInt(extraChild)}]
    }


    numberOfGuest = roomList.reduce((total, x) => {
      let people = 0
      if(x.type === 'Standard' || x.type === 'Deluxe Double' || x.type === 'Deluxe Twin' || x.type === 'Standard Double'){
        return total += (2 * x.quantity)
      }
      if(x.type === 'Deluxe Triple'){
        return total += (3 * x.quantity)
      }
      if(x.type === 'Superior' || x.type === 'Deluxe Family' || x.type === 'Family Connected' || x.type === 'Cattleya Suite'){
        return total += (4 * x.quantity)
      }
      if(x.type === 'Extra Adult' || x.type === 'Extra Child'){
        return total += x.quantity
      }
      return total
    }, 0)

    let contacts = property === 'Avatara Resort' ? 'email rsvn@avatararesort.com or visit www.avatararesort.com' :
    property === 'Samed Pavilion Resort' ? 'email rsvn@samedpavilionresort.com or visit www.samedpavilionresort.com'
: property === 'Jep Bunglow' ? 'mobile +66 89 097 1114'
    : 'mobile +66 81 853 3121'

    moment.locale('en');

    const confirmHtml = ReactDOMServer.renderToStaticMarkup(
          <div style={{fontFamily: 'Kanit', fontSize: '90%'}}>
            <div style={{textAlign: 'center'}}>
              <img alt="logo" src={logo} width="200px" />
            <p style={style}>Confirmation Letter</p>
            </div>
          <p>{moment().format('dddd, MMMM Do YYYY')}</p>
        <p><b>Dear {title} {firstName} {lastName}</b></p>
      <p>Thank you for choosing {property} on Samed Island, Rayong province. We are pleased to confirm your reservation details as follows</p>

  <table>
    <tbody style={{fontSize: '90%'}}>
      <tr>
        <td>Name</td>
      <td>: {title} {firstName} {lastName}</td>
      </tr>
      <tr>
        <td>Number of Guest</td>
      <td>: {numberOfGuest} People ({numberOfGuest - parseInt(extraChild)} Adults, {parseInt(extraChild)} Children)</td>
      </tr>
      <tr>
        <td>Number of Room</td>
      <td>: {numberOfRoom} Room/s</td>
      </tr>
      <tr>
        <td>Confirmation Number</td>
      <td>: {bookingId}</td>
      </tr>
      <tr>
        <td>Arrival Date</td>
      <td>: {moment(checkIn).format('DD MMMM YYYY')}</td>
      </tr>
      <tr>
        <td>Departure Date</td>
      <td>: {moment(checkOut).format('DD MMMM YYYY')}</td>
      </tr>
      <tr>
        <td style={{verticalAlign: 'top'}}>Room type/s</td>
      <td>{roomList.map(x =>
          <div>: {x.quantity} x {x.type} <br /></div>
          )}</td>
      </tr>
      <tr>
        <td>Special Request</td>
      <td>: {request !== '' ? request : '-'}</td>
      </tr>
      <tr>
        <td >Included breakfast</td>
      <td>: {breakfast? 'Yes' : 'No'}</td>
      </tr>
      <tr style={{verticalAlign: 'top'}}>
        <td>Inclusions</td>
      <td>: - Welcome drink upon arrival<br />
    : - Free Wi-Fi in room and resort's public area<br />
  : - Complimentary drinking water<br />
: - Complimentary coffee and tea set in room<br />
  </td>
      </tr>
      <tr>
        <td><b>Payment</b></td>
      <td><b>: {fullyPaid === 100 ?
          `Already paid by ${paymentType === 'transfer' ? 'bank transfer' : 'credit card'} total baht ${numeral(total).format('0,0')} net (Fully paid)`
          : fullyPaid === 50 ?
          `Already paid by ${paymentType === 'transfer' ? 'bank transfer' : 'credit card'} total baht ${numeral(total).format('0,0')} net (50% deposit)`
          :
          `Already paid by ${paymentType === 'transfer' ? 'bank transfer' : 'credit card'} total baht ${numeral(total).format('0,0')} deposite (Full amount: ${numeral(fullAmount).format('0,0')})`
         }</b></td>
      </tr>
    </tbody>

  </table>
  <p>Cancellation Policy: This booking is Non-Refundable.</p>
<p>Please Note: Resort required deposit at Baht 1,000.- per room upon check-in, this amount will be returned to guest upon check-out.</p>
<p>Child policy: Complimentary, child age 0 - 4.99 years old sharing a room with parent on existing bedding. Children age between 5 – 11.99 years old will be charged 650 Baht inclusive of breakfast and a small extra bed (futon). Children age over 12 years old will be charged as an extra person with 1,000 Baht net per person.</p>
<p>We look forward to welcoming you to {property}, Samed Island. For any enquiries or more information, please feel free to contact us via {contacts} to find out more information on our facilities and services.</p>
<p>Please note that National Park does not allow entry after 9PM to the island. Please plan your trip in advance.</p>

          </div>
    );
    confirmWindow.document.title = 'Reservation Confirmation-' + bookingId;
    confirmWindow.document.write(confirmHtml);
  }

  paymentWindowClick = () => {

    const { selectedCompany, receiptImage, receiptImage2, mobile, title, jepStd, jepSuper, firstName, pavFamilyConnect, pavCattliyaSuite, bookingId, lastName, checkIn, checkOut, breakfast, extra, extraChild, total, paymentType, fullAmount, fullyPaid, property, avaDbl, avaTwin, avaTriple, pavDbl, pavTwin,pavTriple, pavFamily, lazyStd} = this.state
let roomList = []
    if(property === 'Avatara Resort'){
      roomList = [
        {type: 'Deluxe Double', quantity: parseInt(avaDbl)},
        {type: 'Deluxe Twin', quantity: parseInt(avaTwin)},
        {type: 'Deluxe Triple', quantity: parseInt(avaTriple)},
      ]
      roomList = roomList.filter(x => x.quantity !== 0)
    }

    const logo = property === 'Avatara Resort' ? avataraLogo : property === 'Samed Pavilion Resort' ? samedPavilionLogo : property === 'Jep Bungalow' ? jepLogo: lazyLogo
    let style = property === 'Avatara Resort' ? {marginTop: '-20px'} : {}

    if(property === 'Samed Pavilion Resort'){
      roomList = [
        {type: 'Deluxe Double', quantity: parseInt(pavDbl)},
        {type: 'Deluxe Twin', quantity: parseInt(pavTwin)},
        {type: 'Deluxe Triple', quantity: parseInt(pavTriple)},
        {type: 'Deluxe Family', quantity: parseInt(pavFamily)},
        {type: 'Family Connected', quantity: parseInt(pavFamilyConnect)},
        {type: 'Cattleya Suite', quantity: parseInt(pavCattliyaSuite)},
      ]
      roomList = roomList.filter(x => x.quantity !== 0)
    }


    if(property === 'Lazy Sandals Hotel'){
      roomList = [
        {type: 'Standard Double', quantity: parseInt(lazyStd)},
      ]
    }

    if(property === 'Jep Bungalow'){
      roomList = [
        {type: 'Standard', quantity: parseInt(jepStd)},
        {type: 'Superior', quantity: parseInt(jepSuper)},
      ]

    }

    if(parseInt(extra) !== 0){
      roomList = [...roomList, {type: 'Extra Adult', quantity: parseInt(extra)}]
    }

    if(parseInt(extraChild) !== 0){
      roomList = [...roomList, {type: 'Extra Child', quantity: parseInt(extraChild)}]
    }

    notifyNewDirectBooking({
      bookingId,
      totalText: `${numeral(total).format('0,0')}.-THB ${fullyPaid === 100 ? '(Fully paid)' : fullyPaid === 50 ? '(50% deposit)' : `Deposit (Full amount: ${numeral(fullAmount).format('0,0')})` }`,
      paymentType: `${paymentType === 'transfer'? 'Bank Transfer':'Credit card'}`,
      selectedCompany,
      property,
      roomList,
      checkIn: `${moment(checkIn).format('DD MMMM YYYY')}`,
      checkOut: `${moment(checkOut).format('DD MMMM YYYY')}`,
      breakfast: `${breakfast? 'Yes' : 'No'}`
    }, res => {})

    const paymentWindow = window.open("Payment", '', "width=595,height=842");
    const paymentHtml = ReactDOMServer.renderToStaticMarkup(
          <html>
            <head>
              <title>{firstName} {lastName}-{bookingId}</title>
            </head>
            <body>
              <div style={{fontFamily: 'Kanit', textAlign: 'center'}}>
                <div style={{textAlign: 'center'}}>
                  <img alt="logo" src={logo} width="200px" />
                  <p style={style}>Hotel Direct Payment</p>
                </div>
                <table>
                  <tbody>
                    <tr>
                    <td><b>Created By</b></td>
                  <td>Reservation Team</td>
                <td><b>Created Date</b></td>
              <td>{moment().format('DD/MM/YYYY')}</td>
            </tr>
            <tr>
            <td><b>Amount</b></td>
          <td>{numeral(total).format('0,0')}.-THB {fullyPaid === 100 ? '(Fully paid)' : fullyPaid === 50 ? '(50% deposit)' : `Deposit (Full amount: ${numeral(fullAmount).format('0,0')})` }</td>
        <td><b>Payment Type</b></td>
        <td>{paymentType === 'transfer'? 'Bank Transfer':'Credit card'}</td>
    </tr>

                  </tbody>
                </table>
                <img alt="receipt" src={receiptImage} width='250px' height="400px" />
                {
                  receiptImage2 !== '' && <img alt="receipt" src={receiptImage2} width='250px' height="400px" />
                }
              <table>
                <tr>
                  <td>Company</td>
                <td>: {selectedCompany}</td>
                </tr>
                <tr>
                  <td>Guest Name</td>
                <td>{title} {firstName} {lastName}</td>
                </tr>
                <tr>
                  <td>Mobile Phone</td>
                <td>{mobile}</td>
                </tr>
                <tr>
                  <td>Property</td>
                <td>{property}</td>
                </tr>
                <tr>
                  <td>Booking ID</td>
                <td>{bookingId}</td>
                </tr>
                <tr>
                  <td>Arrival Date</td>
                <td>{moment(checkIn).format('DD MMMM YYYY')}</td>
                </tr>
                <tr>
                  <td>Departure Date</td>
                <td>{moment(checkOut).format('DD MMMM YYYY')}</td>
                </tr>
                <tr>
                  <td>Included breakfast</td>
                <td>{breakfast? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td>Room type's</td>
                <td>{roomList.map(x =>
                    <div>: {x.quantity} x {x.type} <br /></div>
                    )}</td>
                </tr>
                <tr>
                  <td>Grand Total</td>
                <td>{numeral(total).format('0,0')}.-THB {fullyPaid === 100 ? '(Fully paid)' : fullyPaid === 50 ? '(50% deposit)' : `Deposit (Full amount: ${numeral(fullAmount).format('0,0')})` }</td>
                </tr>
              </table>
              </div>
            </body>
          </html>
    );
    paymentWindow.addEventListener("load", function() {
            paymentWindow.document.title = 'dfsadsf';
        });
      paymentWindow.document.write(paymentHtml);
  }

  checkInOnChange = (input) => {
    this.setState(() => ({
      checkIn: input
    }))
  }

  checkOutOnChange = (input) => {
    this.setState(() => ({
      checkOut: input
    }))
  }

  paymentTypeOnChange = (input) => {
    this.setState(() => ({
      paymentType: input.value
    }))
  }

  breakfastOnChange = input => {
    this.setState(() => ({
      breakfast: input.value
    }))
  }

  fullyPaidOnChange = input => {
    this.setState(() => ({
      fullyPaid: input.value
    }))
  }

  receiptOnChange = e => {
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
    let name = e.target.files[0].name
    imageResize.play(URL.createObjectURL(e.target.files[0])).then(res => {
      let file = dataURLtoFile(res,name)
      let imageList = this.state.imageList
      imageList = URL.createObjectURL(file)
      this.setState(() => ({
        receiptImage: imageList
      }))
    })
  }

  receiptOnChange2 = e => {
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
    let name = e.target.files[0].name
    imageResize.play(URL.createObjectURL(e.target.files[0])).then(res => {
      let file = dataURLtoFile(res,name)
      let imageList = this.state.imageList
      imageList = URL.createObjectURL(file)
      this.setState(() => ({
        receiptImage2: imageList
      }))
    })
  }

  roomOnChange = input => {
    const { value, name } = input.target
    console.log(value, name);
    this.setState(() => ({
      [name]: value
    }))
  }

  toggleShowAddCompany = input => {
    this.setState(() => ({
      showAddCompany: input
    }))
  }

  submitNewCompany = () => {
    const { textCompany, companyList } = this.state;
    if( textCompany.trim() === ''){
      alert('กรุณาใส่ชื่อ Company ให้ถูกต้อง')
      return
    }

    const found = companyList.filter(x => x.name === textCompany)
    if(found.length === 0){
      addNewCompany({textCompany}, res => {
        if(res.status){
          this.setState(() => ({
            showAddCompany: false
          }))
          this.componentDidMount()
        }else{
          alert(res.msg)
        }
      })
    }else{
      alert('ชื่อ Company ซ้ำ กรุณาลองใหม่')
      return
    }

  }

  companyOnChange = (input) => {
    this.setState(() => ({
      selectedCompany: input.value
    }))
  }

  render(){
    const titleOptions = [
      {label: 'Khun', value: 'Khun'},
      {label: 'Miss', value: 'Miss'},
      {label: 'Mr.', value: 'Mr.'},
      {label: 'Mrs.', value: 'Mrs.'},
    ]

    const propertyOptions = [
      {label: 'Avatara Resort', value: 'Avatara Resort'},
      {label: 'Samed Pavilion Resort', value: 'Samed Pavilion Resort'},
      {label: 'Lazy Sandals Hotel', value: 'Lazy Sandals Hotel'},
      {label: 'Jep Bungalow', value: 'Jep Bungalow'},
    ]

    const paymentTypes = [
      {label: 'โอนเงิน', value: 'transfer'},
      {label: 'บัตรเครดิต', value: 'creditCard'},
    ]

    const companyListSelection = this.state.companyList.map(x => {
      return {label: x.name, value: x.name}
    })

    return (
      <div className="container">
        <div className="row">
          <div className="col-6">
            <div class="form-group">
              <label for="exampleInputEmail1">Booking ID:</label>
              <input type="text" className="form-control" value={this.state.bookingId} name="bookingId" onChange={this.roomOnChange} />
            </div>
          </div>
          <div className="col-6">
        {  !this.state.showAddCompany ?
          <div className="row">
          <div className="col-6">
            <div class="form-group">
              <label for="exampleInputEmail1">Company:</label>
              <Select onChange={this.companyOnChange} options={companyListSelection} />
            </div>
          </div>
          <div className="col-6">
            <button className="btn btn-link" onClick={() => this.toggleShowAddCompany(true)}>+ Company</button>
          </div>
          </div>
          :
          <div className="row">
            <div className="col-6">
            <div class="form-group">
              <label for="exampleInputEmail1">Company:</label>
            <input type="text" className="form-control" value={this.state.textCompany} name="textCompany" onChange={this.roomOnChange} />
            </div>
          </div>
          <div className="col-3">
          <button className="btn btn-success" onClick={this.submitNewCompany}>Save</button>
          </div>
          <div className="col-3">
          <button className="btn btn-danger" onClick={() => this.toggleShowAddCompany(false)}>Close</button>
          </div>
          </div>
        }
        </div>
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">First Name:</label>
            <input type="text" className="form-control" value={this.state.firstName} name="firstName" onChange={this.roomOnChange} />
            </div>
          </div>
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">Last Name:</label>
            <input type="text" className="form-control" value={this.state.lastName} name="lastName" onChange={this.roomOnChange} />
            </div>
          </div>
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">Mobile:</label>
            <input type="text" className="form-control" value={this.state.mobile} name="mobile" onChange={this.roomOnChange} />
            </div>
          </div>
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">Check-in:</label>
            <DatePicker selected={this.state.checkIn} onChange={this.checkInOnChange} />
            </div>
          </div>
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">Check-out:</label>
            <DatePicker selected={this.state.checkOut} onChange={this.checkOutOnChange} />
            </div>
          </div>
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">Property:</label>
            <Select onChange={this.propertyOnChange} options={propertyOptions} />
            </div>
          </div>
        </div>
        {
          this.state.property === 'Avatara Resort' &&
          <div className="row">
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">Deluxe Double:</label>
            <input value={this.state.avaDbl} name="avaDbl" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">Deluxe Twin:</label>
            <input value={this.state.avaTwin} name="avaTwin" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">Deluxe Triple:</label>
            <input value={this.state.avaTriple} name="avaTriple" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
        </div>}
        {
          this.state.property === 'Jep Bungalow' &&
          <div className="row">
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">Standard:</label>
            <input value={this.state.jepStd} name="jepStd" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
          <div className="col-4">
            <div class="form-group">
              <label for="exampleInputEmail1">Superior:</label>
            <input value={this.state.jepSuper} name="jepSuper" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
        </div>}
        {
          this.state.property === 'Samed Pavilion Resort' &&
          <div className="row">
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Deluxe Double:</label>
            <input  value={this.state.pavDbl} name="pavDbl" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Deluxe Twin:</label>
            <input  value={this.state.pavTwin} name="pavTwin" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Deluxe Triple:</label>
            <input value={this.state.pavTriple} name="pavTriple" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Deluxe Family:</label>
            <input  value={this.state.pavFamily} name="pavFamily" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Family Connected</label>
            <input  value={this.state.pavFamilyConnect} name="pavFamilyConnect" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Cattleya Suite</label>
            <input  value={this.state.pavCattliyaSuite} name="pavCattliyaSuite" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
        </div>}
        {
          this.state.property === 'Lazy Sandals Hotel' &&
          <div className="row">
          <div className="col-34">
            <div class="form-group">
              <label for="exampleInputEmail1">Standard Double:</label>
            <input  value={this.state.lazyStd} name="lazyStd" onChange={this.roomOnChange} className="form-control" type="number" />
            </div>
          </div>
        </div>}
        <div className="row">
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Extra Adult:</label>
            <input className="form-control" value={this.state.extra} onChange={this.roomOnChange} name="extra" />
            </div>
          </div>
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Extra Child:</label>
            <input className="form-control" value={this.state.extraChild} onChange={this.roomOnChange} name="extraChild" />
            </div>
          </div>
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Included Breakfast:</label>
            <Select onChange={this.breakfastOnChange} options={[{label:'Yes', value: true}, {label:'No', value: false}]} />
            </div>
          </div>
          <div className="col-6">
            <div class="form-group">
              <label for="exampleInputEmail1">Special Request:</label>
            <input type="text" className="form-control" value={this.state.request} name="request" onChange={this.roomOnChange} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">ยอดที่ทำการจ่าย:</label>
            <input className="form-control" value={this.state.total} onChange={this.roomOnChange} name="total" />
            </div>
          </div>
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">จ่ายโดย:</label>
            <Select onChange={this.paymentTypeOnChange} options={paymentTypes} />
            </div>
          </div>
<div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Fully paid? :</label>
            <Select onChange={this.fullyPaidOnChange} options={[{label:'100%', value: 100}, {label:'50%', value: 50}, {label:'มัดจำเป็นจำนวนเงิน', value: 0}]} />
            </div>
          </div>
          { this.state.fullyPaid === 0 &&
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">ยอดเต็มที่ต้องชำระ:</label>
            <input className="form-control" value={this.state.fullAmount} onChange={this.roomOnChange} name="fullAmount" />
            </div>
          </div>
        }
          <div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Payment Receipt:</label>
              <input className="form-control" onChange={this.receiptOnChange} type="file" />
            </div>
          </div><div className="col-3">
            <div class="form-group">
              <label for="exampleInputEmail1">Payment Receipt 2:</label>
              <input className="form-control" onChange={this.receiptOnChange2} type="file" />
            </div>
          </div>
        </div>
        <div className="row">
        <div className="col-6"><button onClick={this.submitOnClick} className="btn btn-success">สร้างใบคอนเฟริม</button></div>
      <div className="col-6"><button onClick={this.paymentWindowClick} className="btn btn-success">สร้างใบโอนเงิน</button></div>
    </div>
    <div className="row">
    <div className="col-6">Reservation Confirmation-{this.state.bookingId}</div>
  <div className="col-6">{this.state.firstName} {this.state.lastName}-{this.state.bookingId}</div>
</div>

      </div>
    )
  }
}

export default App;

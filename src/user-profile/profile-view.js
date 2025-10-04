import React from 'react'

import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import numeral from 'numeral'
import { IP,
  getEmployeeProfileByLineId,
  updatePhoneByUserId,
} from './tunnel'

import { BottomNav } from './index.js'

import {
  faChevronCircleRight, faChevronCircleLeft, faArrowUp, faArrowDown,faUsersCog,
  faBuilding, faSave, faCloudSun, faBed,faExclamationTriangle, faCoffee, faUndoAlt,
  faUser, faCalendarAlt, faHome, faTools, faFileInvoiceDollar,faBullhorn, faPencilAlt, faLocationArrow,faChevronDown
 } from '@fortawesome/free-solid-svg-icons'

export default class ProfileView extends React.Component {
  constructor(props){
    super(props)
    let phone = this.props.phone
    this.state = {
      phone
    }
  }

  editPhone = async () => {
    let phoneInput = await Swal.fire({
      'title': 'เบอร์ติดต่อ',
      'input': 'text',
      color: 'white',
      background: '#333',
      inputPlaceholder: 'required',
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'กลับ',
      showCancelButton: true,
      inputValidator: (value) => new Promise((resolve, reject) => {
        if(value === ''){
          resolve('กรุณาเบอร์ติดต่อ')
        }else{
          resolve()
        }
      })
    })
    if(phoneInput.isConfirmed){
      updatePhoneByUserId({id: this.props.id, phone: phoneInput.value}, res => {
        if(res.status){
          Swal.fire({
            'title': 'เบอร์ติดต่อของคุณได้เปลี่ยนแล้ว',
            'icon': 'success',
            color: 'white',
            background: '#333',
            confirmButtonText: 'ปิด',
          })
          this.setState(() => ({
            phone: phoneInput.value
          }))
        }else{
          Swal.fire({
            'title': res.msg,
            'icon': 'success',
            color: 'white',
            background: '#333',
            confirmButtonText: 'ปิด',
          })
        }
      })
    }
  }

  render(){
    moment(this.props.startJob, 'DD/MM/YYYY')
    var start = moment(this.props.startJob, 'DD/MM/YYYY');
    var end = moment()

    var years = end.diff(start, 'year');
    start.add(years, 'years');

    var months = end.diff(start, 'months');
    start.add(months, 'months');

    var days = end.diff(start, 'days');
    let workSince = years + ' years ' + months + ' months ' + days + ' days'
    return (
      <div className="row px-3">
        <div className="mt-4 d-flex flex-column justify-content-center align-items-center">
          <img id="profile-image" src={`${IP}/public/employee/${this.props.imageUrl !== null ? this.props.imageUrl : 'person.png'}`} width="120px" height="120px" />
          <h5 className="mt-2">{this.props.name}</h5>
          <span className="mt-2" style={{ fontWeight: 'bold', background: '#f2c66f',color: 'black', padding: '5px 10px', borderRadius: '5px' }}>{this.props.id}</span>
        </div>
        <div className="d-flex justify-content-center">
          <table style={{width: '80%'}} className="">
            <tbody>
              <tr>
                <td className="pro-title">Phone:</td>
                <td className="pro-value">{this.state.phone}</td>
              </tr>
              <tr>
                <td className="pro-title">DOB:</td>
                <td className="pro-value">{this.props.dob}</td>
              </tr>
              <tr>
                <td className="pro-title">Employee Since:</td>
                <td className="pro-value">{workSince}</td>
              </tr>
              <tr>
                <td className="pro-title">Department:</td>
                <td className="pro-value">{this.props.department}</td>
              </tr>
              <tr>
                <td className="pro-title">Position:</td>
                <td className="pro-value">{this.props.role} {this.props.jobDescription ? <button onClick={() => this.props.changePage('jobDescription')} className="btn btn-light btn-sm">อ่านเพิ่ม!</button> : ''}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{height:'200px', width: '50px'}}>

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

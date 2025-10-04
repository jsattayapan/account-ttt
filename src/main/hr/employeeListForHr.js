import React from 'react'
import Select from 'react-select'
import validator from 'validator';
import numeral from 'numeral'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import {DocumentSection, WarningSection} from './staff-profile'
import AccountSection from './staff-account'
import Modal from 'react-modal'
import {
  faPen,
  faSave,
  faUndoAlt
 } from '@fortawesome/free-solid-svg-icons'

import {
  getEmployeeListForHr,
  updateEmployeeAttribute
 } from './tunnel'
 import { EmployeeTimeHistrory } from '../dept-manager/employee-time-histrory'
 import { IP } from './../../constanst'

export default class EmployeeListForHr extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      employeeId: ''
    }
  }

  setEmployee = (id = '') => {
    this.setState(() => ({
      employeeId: id
    }))
  }

  render(){
    let { employeeId } = this.state
    return(
      <div className="container">
        { employeeId === '' ?
          <Main
            setEmployee={this.setEmployee}
            />
          :
          <Profile
            employeeId={employeeId}
            user={this.props.user}
            backBtn={this.setEmployee}
             />
        }
      </div>
    )
  }
}

const SubMenuList = props => (
  <li
    className="subMenuLi"
    onClick={() => props.onClick(props.text)}
    style={{display: 'inline', padding: '13px', borderBottom: props.text === props.subPage ? '4px solid orange': ''}}
    >
    {props.text}
  </li>
)

class Profile extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      subPage: 'Profile',
      employeeInfo: '',
      openTimeHistroryById: ''
    }
  }

  componentDidMount(){
    getEmployeeListForHr({employeeId: this.props.employeeId},res => {
      if(res.status){
        console.log(this.props.user);
        this.setState(() => ({
          employeeInfo: res.list[0]
        }))
      }
    })
  }


  openTimeTableHistrory = () => {

    this.setState(() => ({
      openTimeHistroryById: this.props.employeeId
    }))
  }

  setSubPage = subPage => {
    this.setState(() => ({
      subPage
    }))
  }

  render(){
    let {backBtn} = this.props
    let {subPage, employeeInfo} = this.state
    let subPageList = ['Profile',  'เอกสาร', 'ใบเตือน', 'เงินหัก']
    const customStyles = {
      input:() => ({
        background: '#1e1e1e', border: 'none', borderRadius: 0
      })
    }
    return(
      <div className="row">
        {
          this.state.openTimeHistroryById !== '' &&
          <Modal
            isOpen={this.state.openTimeHistroryById !== ''}
            style={customStyles}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={true}>
            <EmployeeTimeHistrory closeModal={() => this.setState(() => ({openTimeHistroryById: ''}))} employee={employeeInfo} />
          </Modal>
        }
        <div className="col-10 mt-3">
          <ul className="p-3" style={{borderBottom: '1px solid #e3e3e3'}}>
            {
              subPageList.map(page => <SubMenuList onClick={this.setSubPage} text={page} subPage={subPage} />)
            }
          </ul>
        </div>
        <div className="col-2 mt-3">
          <button onClick={() => backBtn()}  className="btn btn-danger">กลับ</button>
        </div>
        <div className="col-3 text-center mt-3">
          <img
            src={employeeInfo.imageUrl ? IP + '/public/employee/' + employeeInfo.imageUrl : IP + '/public/employee/person.png'}
            className={employeeInfo.active ? "personIconActive" : "personIconInactive"}
            alt="Smiley face"
            height="80"
            width="80" />
          <h5 className="mt-2">{employeeInfo.id}</h5>
          <p style={{fontSize: '15px'}}>{employeeInfo.name}</p>
        </div>
        <div className="col-9">
          {
            subPage === 'Profile' && <SubProfile employeeInfo={employeeInfo} openTimetable={this.openTimeTableHistrory} />
          }
          {
            subPage === 'เอกสาร' && <DocumentSection user={this.props.user} employeeId={employeeInfo.id} />
          }
          {
            subPage === 'ใบเตือน' && <WarningSection user={this.props.user} employeeId={employeeInfo.id} employee={employeeInfo}/>
          }
          {
            subPage === 'เงินหัก' && <AccountSection user={this.props.user} employeeId={employeeInfo.id} employee={employeeInfo}/>
          }

        </div>
      </div>
    )
  }
}


class SubProfile extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  submitChange = (attribute, value, callback) => {
    console.log(attribute, value);
    updateEmployeeAttribute({employeeId: this.props.employeeInfo.id, attribute, value } ,res => {
      if(res.status){
        callback(res)
      }else{
        Swal.fire({
          title: res.msg,
          icon: 'error'
        })
      }
    })
  }

  render(){
    let {employeeInfo} = this.props
    return( employeeInfo !== undefined && <div className="row">
        <InputTextField submitChange={this.submitChange} title='เบอร์โทร' value={employeeInfo.phone} name="phone" />
        <TextField title='เริ่มทำงาน' value={employeeInfo.startJob} />
        <div className='mt-3'></div>
        <div className="col-6">
        </div>
        <InputTextField submitChange={this.submitChange} title='วันเกิด' value={employeeInfo.dob} name="dob" />
        <div className='mt-3'></div>
        <TextField title='Department' value={employeeInfo.departmentName} />
        <TextField title='ตำแหน่ง' value={employeeInfo.role} />
        <button className="btn btn-info" onClick={this.props.openTimetable}>ตารางเวลา</button>
      </div>
    )
  }
}

const TextField = props => (
  <div className="col-6">
    <label>{props.title} : </label>&nbsp;<span>{props.value}</span>
  </div>
)

class InputTextField extends React.Component {
  constructor(props){
    super(props)
    console.log(this.props);
    this.state = {
      inputValue: '',
      showEdit: false,
      savedValue: ''
    }
  }

  submitValueChange = () => {
    let { inputValue } = this.state
    let {title, submitChange, name} = this.props
    if(inputValue === ''){
      Swal.fire({
        title:'กรุณาใส่'+title,
        icon: 'error'
      })
      return
    }
    submitChange(name, inputValue, res => {
      if(res.status){
        this.setState(() => ({
          showEdit: false,
          savedValue: inputValue
        }))
      }
    })
  }

  textOnChange = (e) => {
    let { value } = e.target
    this.setState(() => ({
      inputValue: value
    }))
  }

  toggleShowEdit = () => {
    this.setState(() => ({
      showEdit: !this.state.showEdit,
      inputValue: '',
    }))
  }

  render(){
    let {showEdit, inputValue, savedValue} = this.state
    let {title, value} = this.props
    let displayValue = savedValue !== '' ? savedValue : value
    return(
      <div className="col-6">
        <label>{title} : </label>&nbsp;
        {!showEdit ? <span>{displayValue}</span> : <input placeholder={displayValue} onChange={this.textOnChange} value={inputValue}  />}&nbsp;&nbsp;
        {!showEdit ?
          <span onClick={this.toggleShowEdit} className="subMenuLi"><FontAwesomeIcon icon={faPen} /></span>
            :
            <span>
            <span onClick={this.submitValueChange} className="subMenuLi"><FontAwesomeIcon color='green' icon={faSave} /></span>
            &nbsp;
            <span onClick={this.toggleShowEdit} className="subMenuLi"><FontAwesomeIcon color='red' icon={faUndoAlt} /></span>
          </span>
        }

      </div>
    )
  }
}


class Main extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      employeeList: []
    }
  }

  componentDidMount(){
    getEmployeeListForHr({}, res => {
      if(res.status){
        console.log(res.list[0]);
        this.setState(() => ({
          employeeList: res.list
        }))
      }
    })
  }

  render(){
    let { employeeList } = this.state
    let {setEmployee} = this.props
    employeeList = employeeList.filter(x => x.active)
    return(
      <div className="row">
        <div className='col-12'>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{width: '10%'}}></th>
                <th style={{width: '40%'}}>พนักงาน</th>
                <th style={{width: '20%'}}>เข้าทำงาน</th>
                <th style={{width: '10%'}}>เบอร์โทร</th>
                <th style={{width: '10%'}}>สัญชาติ</th>
                <th style={{width: '10%'}}></th>
              </tr>
            </thead>
            <tbody>
              {
                employeeList.map(emp => (
                  <tr>
                    <td className="align-middle" style={{width: '10%'}}>{emp.id}</td>
                    <td className="align-middle" style={{width: '40%'}}>
                      <div className="row">
                        <div className="col-2">
                          <img
                            src={emp.imageUrl ? IP + '/public/employee/' + emp.imageUrl : IP + '/public/employee/person.png'}
                            className={emp.active ? "personIconActive" : "personIconInactive"}
                            alt="Smiley face"
                            height="60"
                            width="60" />
                        </div>
                        <div className="col-10">
                          <div className="col-12">
                            {emp.name}
                          </div>
                          <div className="col-12">
                            {emp.departmentName} - {emp.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle" style={{width: '10%'}}>{emp.startJob}</td>
                    <td className="align-middle" style={{width: '20%'}}>{emp.phone}</td>
                    <td className="align-middle" style={{width: '10%'}}>{emp.nationality}</td>
                    <td className="align-middle" style={{width: '10%'}}>
                      <button onClick={() => setEmployee(emp.id)} className="btn btn-success">Profile</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

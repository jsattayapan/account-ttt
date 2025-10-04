import React from 'react'
import DatePicker from "react-datepicker";
import moment from 'moment'
import Modal from 'react-modal'
import Select from 'react-select'
import { getEmployeeTimetableOneWeekByDepartmentId, submitEmployeeTimetable, deleteEmployeeTimetable, insertMutipleEmployeeTimetable } from './tunnel'
import { IP } from './../../constanst'

import { EmployeeTimeHistrory } from './employee-time-histrory'

const DateDisplayInput = ({value, onClick}) => (
  <button onClick={onClick} className="btn btn-secondary">
    {value}
  </button>
)

class TdTimetable extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      saveStartTime: null,
      saveBreakTime: null,
      saveContinueTime: null,
      saveEndTime: null,
      startTime: null,
      breakTime: null,
      continueTime: null,
      endTime: null,
      settingTime: false,
      includeBreak: false,
      pastToday: false,
      dayOff: false,
      nightShift: false,
      loading: false,
      showDayOff: false
    }
  }

  componentDidMount(){
    const full_access = 'olotem321'
    let startTimeT = this.props.startTime ? new Date(this.props.startTime) : null
    let endTimeT = this.props.endTime ? new Date(this.props.endTime) : null
    let breakTimeT = this.props.breakTime ? new Date(this.props.breakTime) : null
    let continueTimeT = this.props.continueTime ? new Date(this.props.continueTime) : null
    let includeBreak = breakTimeT ? true : false
    let dateArray = this.props.date.split('/')
    let dateFormat = new Date(dateArray[2], dateArray[1] - 1, dateArray[0])
    dateFormat = moment(dateFormat)
    let today = moment()
    let pastToday = this.props.departmentManagerId === full_access ? true : dateFormat.isAfter(today, 'day');
    let dayOff = this.props.dayOff
    let nightShift = this.props.nightShift

    this.setState(() => (
      {
        saveStartTime: startTimeT,
        saveBreakTime: breakTimeT,
        saveContinueTime: continueTimeT,
        saveEndTime: endTimeT,
        startTime: startTimeT,
        breakTime: breakTimeT,
        continueTime: continueTimeT,
        endTime: endTimeT,
        settingTime: false,
        includeBreak,
        pastToday: !pastToday,
        dayOff,
        nightShift,
        loading: false
      }
    ))

  }


  saveTime = () => {
    const startTime = this.state.startTime
    const continueTime = this.state.continueTime
    const breakTime = this.state.breakTime
    const endTime = this.state.endTime
    const nightShift = this.state.nightShift

    if(!nightShift){
      if(!this.state.startTime || !this.state.endTime ){
        alert('กรุณาระบุเวลาเข้า-ออกงาน')
        return
      }

      if(startTime.getTime() > endTime.getTime()){
        alert('รูปแบบเวลาไม่ถูกต้อง')
        return
      }
      if(startTime.getHours() === endTime.getHours()){
        alert('รูปแบบเวลาไม่ถูกต้อง')
        return
      }
      if(this.state.includeBreak){
        if(!this.state.breakTime || !this.state.continueTime ){
          alert('กรุณาระบุเวลาพัก')
          return
        }
        if(startTime.getTime() > continueTime.getTime() ||
        startTime.getTime() > breakTime.getTime() ||
        endTime.getTime() < breakTime.getTime() ||
        endTime.getTime() < continueTime.getTime() ||
        breakTime.getTime() > continueTime.getTime()
        ){
          alert('รูปแบบเวลาไม่ถูกต้อง')
          return
        }
        if(
          startTime.getHours() === continueTime.getHours() ||
          startTime.getHours() === breakTime.getHours() ||
          endTime.getHours() === continueTime.getHours() ||
          endTime.getHours() === breakTime.getHours()
      ){
          alert('รูปแบบเวลาไม่ถูกต้อง')
          return
        }
      }
    } else {
      if(startTime.getTime() < endTime.getTime()){
        alert('รูปแบบเวลาไม่ถูกต้อง')
        return
      }
      if(startTime.getHours() === endTime.getHours()){
        alert('รูปแบบเวลาไม่ถูกต้อง')
        return
      }
    }

    this.setState(() => ({loading: true}))
    submitEmployeeTimetable({
      employeeId: this.props.employeeId,
      date: this.props.date,
      startTime,
      breakTime,
      continueTime,
      endTime,
      nightShift,
      type: 'mobile'
    }, res => {
      if(res.status){
        this.setState(() => ({
          settingTime: false,
          saveStartTime: this.state.startTime,
          saveBreakTime: this.state.breakTime,
          saveContinueTime: this.state.continueTime,
          saveEndTime: this.state.endTime,
          includeBreak: false
        }))
        this.setState(() => ({loading: false}))
      }else{
        alert(res.msg)
        this.setState(() => ({loading: false}))
      }
    })
  }

  cancelTime = () => {
    this.setState(() => ({loading: true}))
    deleteEmployeeTimetable({ employeeId: this.props.employeeId, date: this.props.date} , res => {
      if(res.status){
        this.setState(() => ({
          settingTime: false,
          startTime: '',
          breakTime: '',
          continueTime: '',
          endTime: '',
          saveStartTime: '',
          saveBreakTime: '',
          saveContinueTime: '',
          saveEndTime: '',
          includeBreak: false,
          nightShift: false,
        }))
        this.setState(() => ({loading: false}))
      }else{
        alert(res.msg)
        this.setState(() => ({loading: false}))
      }
    })
  }

  toggleNightShift = () => {
    let nightShift = this.state.nightShift
    if(!nightShift){
      this.setState(() => ({
        breakTime: '',
        continueTime: '',
        includeBreak: false
      }))
    }
    this.setState(() => ({
      nightShift: !nightShift
    }))
  }


  setStartTime = (date) => {
    this.setState(() => ({ startTime: date }))
  }
  setEndTime = (date) => {
    this.setState(() => ({ endTime: date }))
  }

  setBreakTime = (date) => {
    this.setState(() => ({ breakTime: date }))
  }

  setContinueTime = (date) => {
    this.setState(() => ({ continueTime: date }))
  }

  toggleSettingTime = () => {
      this.setState(() => ({
        settingTime: true,
      }))
  }

  toggleBreakTime = () => {
    if(this.state.includeBreak){
      this.setState(() => ({
        breakTime: '',
        continueTime: ''
      }))
    }
    this.setState(() => ({ includeBreak: !this.state.includeBreak }))
  }

  clickOpenDayOff = () => {
    const {showDayOff} = this.state
    this.setState(() => ({
      showDayOff: !showDayOff
    }))
  }

  render(){
    return(   this.state.settingTime ?
      <td>
        {
          this.state.loading &&
          <div className="top-layer">
            <div className="loader"></div>
          </div>
        }
        <div className="row">
          {
            this.state.nightShift ?
            <div className="col-12 text-center">
              <button style={{width: '100%'}} onClick={this.toggleNightShift} className="btn btn-dark">Night Shift</button>
            </div>
            :
            <div className="col-12 text-center">
              <button style={{width: '100%'}} onClick={this.toggleNightShift} className="btn btn-light">Day Shift</button>
            </div>
          }
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6 text-left">
            เข้างาน:
          </div>
          <div className="col-12 col-md-6">
            <DatePicker
              selected={this.state.startTime}
              onChange={date => this.setStartTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={60}
              timeCaption="Time"
              dateFormat="HH:mm"
              timeFormat="HH:mm"
              customInput={<DateDisplayInput />}
            />
          </div>
        </div>
        { this.state.includeBreak &&
          <div className="row mb-3 col-md-12">
            <div className="col-12 col-md-6 text-center">
              <DatePicker
                selected={this.state.breakTime}
                onChange={date => this.setBreakTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                customInput={<DateDisplayInput />}
              />
            </div>
            <div className="col-12 col-md-6 text-center">
              <DatePicker
                selected={this.state.continueTime}
                onChange={date => this.setContinueTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                customInput={<DateDisplayInput />}
              />
            </div>
          </div>
        }
        <div className="row mb-3">
          <div className="col-12 col-md-6 text-left">
          ออกงาน:
          </div>
          <div className="col-6">
            <DatePicker
              selected={this.state.endTime}
              onChange={date => this.setEndTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={60}
              timeCaption="Time"
              dateFormat="HH:mm"
              timeFormat="HH:mm"
              customInput={<DateDisplayInput />}
            />
          </div>
        </div>
        <div className="row mb-3">
          { !this.state.nightShift &&
            <div className="col-12 text-center">
              <button style={{width: '100%'}} onClick={this.toggleBreakTime} className="btn btn-warning">Break</button>
            </div>
          }

        </div>
        <div className="row ">
          <div className="col-12 col-md-6 text-center">
            <button onClick={this.saveTime} style={{width: '100%'}} className="btn btn-success">บันทึก</button>
          </div>
          <div className="col-12 col-md-6 text-center">
            <button style={{width: '100%'}} onClick={this.cancelTime} className="btn btn-danger">ยกเลิก</button>
          </div>
        </div>
      </td>:
      this.state.showDayOff ?
      <td>
        <LeaveForm cancel={this.clickOpenDayOff} />
      </td>
    :
      this.state.saveStartTime ?
      <td>
        {
          this.state.saveBreakTime ?
          <div className="row mb-3">
            <div className="col-12">
              <div className="row mb-3">
                <div className="col-12 col-md-5">
                  <button disabled className="btn btn-secondary">
                    {moment(this.state.saveStartTime).format('LT')}
                  </button>
                </div>
                <div className="col-12 col-md-2 text-center">
                  -
                </div>
                <div className="col-12 col-md-5">
                  <button disabled className="btn btn-secondary">
                    {moment(this.state.saveBreakTime).format('LT')}
                  </button>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12 text-center">
                  {this.state.nightShift ? <span className="badge badge-secondary">Night Shift</span> : <span className="badge badge-light">Day Shift</span>}
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-5">
                  <button disabled className="btn btn-secondary">
                    {moment(this.state.saveContinueTime).format('LT')}
                  </button>
                </div>
                <div className="col-12 col-md-2 text-center">
                  -
                </div>
                <div className="col-12 col-md-5">
                  <button disabled className="btn btn-secondary">
                    {moment(this.state.saveEndTime).format('LT')}
                  </button>
                </div>
              </div>
            </div>
          </div> :
          <div className="row mb-3">
            <div className="col-12 col-md-4">
              <button disabled className="btn btn-secondary">
                {moment(this.state.saveStartTime).format('LT')}
              </button>
            </div>
            <div className="col-12 col-md-4 text-center">
              {this.state.nightShift ? <span className="badge badge-secondary">Night Shift</span> : <span className="badge badge-light">Day Shift</span>}
            </div>
            <div className="col-12 col-md-4">
              <button disabled className="btn btn-secondary">
                {moment(this.state.saveEndTime).format('LT')}
              </button>
            </div>
          </div>
        }
        { !this.state.pastToday && <div className="row">
          <div className="col-12 text-center">
            <button style={{width: '100%'}} onClick={this.toggleSettingTime} className="btn btn-warning">แก้ไข</button>
          </div>
        </div>}
      </td>
       : !this.state.pastToday ?
       (this.state.dayOff.status || this.props.weeklyDayOff)?
       <td align="center">
         <button onClick={this.toggleSettingTime} className="btn btn-dark" disabled>{this.props.weeklyDayOff? 'วันหยุดประจำสัปดาห์':this.state.dayOff.type}</button>
       </td>
       :
      <td align="center">
        <button onClick={this.toggleSettingTime} className="btn btn-info">กำหนดเวลา</button>
      <br />
    <br />
  {/* <button onClick={this.clickOpenDayOff} className="btn btn-success">หยุด/ลา</button> */}
      </td> :
      this.state.dayOff.status ?
      <td align="center">
        <button onClick={this.toggleSettingTime} className="btn btn-dark" disabled>{this.state.dayOff.type}</button>
      </td>
      :
      <td align="center">
        ไม่มีข้อมูลการทำงาน
      </td>
    )
  }
}

class LeaveForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      leaveType: '',
      remark: ''
    }
  }

  leaveOnChange = (input) => {
    this.setState(() => ({
      leaveType: input.value
    }))
  }

  isNotPass = () => {
    const {leaveType, remark} = this.state

    if(leaveType === ''){
      return true
    }

    if(leaveType !== 'วันหยุด' && remark === ''){
      return true
    }

    return false
  }

  remarkChange = (e) => {
    const {value} = e.target
    this.setState(() => ({
      remark: value
    }))
  }

  render(){
    const leaveOptions = [{value: 'วันหยุด', label: 'วันหยุด'},{value: 'ลาป่วย', label: 'ลาป่วย'},{value: 'ลากิจ', label: 'ลากิจ'}]
    return (
      <div className="row mb-3 justify-content-around">
        <div className="col-12 mb-3">
          <Select onChange={this.leaveOnChange} options={leaveOptions} />
        </div>
        {(this.state.leaveType === 'ลากิจ' || this.state.leaveType === 'ลาป่วย') && <div className="col-12 mb-3">
          <label className="label-control">หมายเหตุ</label>
        <input value={this.state.remark} onChange={this.remarkChange} className="form-control" />
        </div>}
        <div className="col-6">
          <button className="btn btn-success" disabled={this.isNotPass()}>บันทึก</button>
        </div>
        <div className="col-6">
          <button onClick={this.props.cancel} className="btn btn-danger">ยกเลิก</button>
        </div>
      </div>
    )
  }
}

export default class StaffTimetableManager extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      employeeList: [],
      dates: [],
      currentDate: new Date(),
      showAddMultiple: false,
      searchName: '',
      openTimeHistroryById: ''
    }
  }

  closeAddMultiple = () => {
    this.setState(() => ({
      showAddMultiple: false,
    }))
    let today = new Date(this.state.currentDate)
    let newDay = today
    getEmployeeTimetableOneWeekByDepartmentId({departmentId: this.props.user.departmentManagerId, date: newDay}, res => {
      if(res.status){
        this.setState(() => ({
          employeeList: [],
          dates: res.dates,
          currentDate: newDay
        }))
        this.setState(() => ({
          employeeList: res.employeeList,
        }))
      }else{
        alert(res.msg)
      }
    })
  }
  componentDidMount(){
    getEmployeeTimetableOneWeekByDepartmentId({departmentId: this.props.user.departmentManagerId, date: new Date()}, res => {
      if(res.status){
        console.log(res);
        this.setState(() => ({
          employeeList: res.employeeList,
          dates: res.dates
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  addMultipleOnClick = () => {
    this.setState(() => ({
      showAddMultiple: true
    }))
  }

  backADay = () => {
    let today = new Date(this.state.currentDate)
    let newDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
    getEmployeeTimetableOneWeekByDepartmentId({departmentId: this.props.user.departmentManagerId, date: newDay}, res => {
      if(res.status){
        this.setState(() => ({
          employeeList: [],
          dates: res.dates,
          currentDate: newDay
        }))
        this.setState(() => ({
          employeeList: res.employeeList,
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  forwardADay = () => {
    let today = new Date(this.state.currentDate)
    let newDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)
    getEmployeeTimetableOneWeekByDepartmentId({departmentId: this.props.user.departmentManagerId, date: newDay}, res => {
      if(res.status){
        console.log(res.employeeList);
        this.setState(() => ({
          employeeList: [],
          dates: res.dates,
          currentDate: newDay
        }))
        this.setState(() => ({
          employeeList: res.employeeList,
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  isWeekend = (input) => {
    let data = input.split('/')
    let date = new Date(parseInt(data[2]), parseInt(data[1])-1, parseInt(data[0]))
    let day = date.getDay()
    if(day === 6 || day === 0){
      return 'weekend'
    }
    return ''
  }

  searchNameOnChange = e => {
    const { value } = e.target
    this.setState(() => ({
      searchName: value
    }))
  }

  openEmployeeTimeHistrory = id => {
    this.setState(() => ({
      openTimeHistroryById: id
    }))
  }

  render(){
    let display_employee_list = this.state.employeeList.filter(emp => (
      emp.name.includes(this.state.searchName) ||
      emp.id.includes(this.state.searchName) ||
      this.state.searchName === ''
    ))

    const customStyles = {
      input:() => ({
        background: '#1e1e1e', border: 'none', borderRadius: 0
      })
    }
    return (
      <div className="row">
        {
          this.state.openTimeHistroryById !== '' &&
          <Modal
            isOpen={this.state.openTimeHistroryById !== ''}
            style={customStyles}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={true}>
            <EmployeeTimeHistrory closeModal={() => this.setState(() => ({openTimeHistroryById: ''}))} employee={this.state.openTimeHistroryById} />
          </Modal>
        }
        <div className="col-12">
          <div className="row mb-3">
            <div className="col-2">
              <button onClick={this.addMultipleOnClick} className="btn btn-info">กำหนดหลายคน</button>
            </div>
            <div className="col-2 text-right">
              <button onClick={this.backADay} className="btn btn-warning">&larr;</button>
            </div>
            <div className="col-4 text-center">
              <button className="btn btn-dark">{this.state.dates[0]}</button>
            </div>
            <div className="col-4">
              <button onClick={this.forwardADay} className="btn btn-warning">&rarr;</button>
            </div>
          </div>
              <Modal isOpen={this.state.showAddMultiple} >
                <AddMultiple employeeList={this.state.employeeList} closeAddMultiple={this.closeAddMultiple} />
              </Modal>
            </div>
            <div className="col-12">
              <input type='text' value={this.state.searchName} onChange={this.searchNameOnChange} placeholder='ค้นหา' />
            </div>
        <div className="col-12">
          <table className="table table-bordered table-hover table-active">
            <thead>
              <tr>
                <th>ชื่อ</th>
                {
                  this.state.dates.map(x =>
                    <td align="center" className={`${this.isWeekend(x)}`}>{x}</td>
                  )
                }
              </tr>
            </thead>
            <tbody>
              {
                display_employee_list.length !== 0 ?
                display_employee_list.map((x) =>
                  <tr>
                    <td>
                      <div className="row">
                        <div className="col-12 text-center">
                          <b>{x.imageUrl ? <img src={IP + '/public/employee/' + x.imageUrl} className="personIcon" alt="Smiley face" height="80" width="80" /> : <img src={IP + '/public/employee/person.png'} className="personIcon" alt="Smiley face" height="80" width="80" />}</b>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <b>{x.name}</b>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          {x.role}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          {x.id}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <button onClick={() => this.openEmployeeTimeHistrory(x)} className="btn btn-info btn-block">ดูประวัติการเข้างาน</button>
                        </div>
                      </div>
                    </td>
                    {
                      x.timetable.map(y =>
                        <TdTimetable
                          employeeId={x.id}
                          departmentManagerId={this.props.user.departmentManagerId}
                          date={y.date}
                          startTime={y.startTime}
                          breakTime={y.breakTime}
                          continueTime={y.continueTime}
                          endTime={y.endTime}
                          dayOff={y.dayOff}
                          weeklyDayOff={y.weeklyDayOff}
                          nightShift={y.nightShift}
                          />
                      )
                    }
                  </tr>
                ):
                <tr>
                  <td colSpan="9">ไม่พบข้อมูล</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

class AddMultiple extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      date: new Date(Date.now() + 86400000), // 86400000 ms = 1 day,
      breakTime: '',
      continueTime: '',
      includeBreak: false,
      nightShift: false,
      startTime:  null,
      breakTime: null,
      continueTime: null,
      endTime: null,
      selectedEmployeeList: [],
      loading: false,
      endDate: new Date(Date.now() + 86400000), // 86400000 ms = 1 day,
    }
  }


  componentDidMount(){
  }

  setDate = (date) => {
    if(date.getTime() > this.state.endDate.getTime()){
      this.setState(() => ({
        endDate: date
      }))
    }
    this.setState(() => ({
      date
    }))
  }

  setEndDate = (date) => {
    this.setState(() => ({
      endDate: date
    }))
  }

  toggleNightShift = () => {
    let nightShift = this.state.nightShift
    if(!nightShift){
      this.setState(() => ({
        breakTime: '',
        continueTime: '',
        includeBreak: false
      }))
    }
    this.setState(() => ({
      nightShift: !nightShift
    }))
  }

  setStartTime = (date) => {
    this.setState(() => ({ startTime: date }))
  }
  setEndTime = (date) => {
    this.setState(() => ({ endTime: date }))
  }

  setBreakTime = (date) => {
    this.setState(() => ({ breakTime: date }))
  }

  setContinueTime = (date) => {
    this.setState(() => ({ continueTime: date }))
  }

  closeAddMultiple = () => {
    this.props.closeAddMultiple()
  }

  toggleBreakTime = () => {
    if(this.state.includeBreak){
      this.setState(() => ({
        breakTime: '',
        continueTime: ''
      }))
    }
    this.setState(() => ({ includeBreak: !this.state.includeBreak }))
  }

  employeeOnClick = (id) => {
    let found = this.state.selectedEmployeeList.filter(x => x === id)
    if(found.length === 0){
      let selectedEmployeeList = [ ...this.state.selectedEmployeeList, id]
      this.setState(() => ({
        selectedEmployeeList
      }))
    }else{
      let selectedEmployeeList = this.state.selectedEmployeeList.filter(x => x !== id)
      this.setState(() => ({
        selectedEmployeeList
      }))
    }
  }

  isEmployeeSelected = (id) => {
    let found = this.state.selectedEmployeeList.filter(x => x === id)
    if(found.length === 0){
      return false
    }else{
      return true
    }
  }

  saveTime = () => {
    const startTime = this.state.startTime
    const continueTime = this.state.continueTime
    const breakTime = this.state.breakTime
    const endTime = this.state.endTime
    const nightShift = this.state.nightShift

    if(this.state.selectedEmployeeList.length === 0){
      alert('กรุณาระบุพนักงาน')
      return
    }

    if(!nightShift){
      if(!this.state.startTime || !this.state.endTime ){
        alert('กรุณาระบุเวลาเข้า-ออกงาน')
        return
      }

      if(startTime.getTime() > endTime.getTime()){
        alert('รูปแบบเวลาไม่ถูกต้อง')
        return
      }
      if(startTime.getHours() === endTime.getHours()){
        alert('รูปแบบเวลาไม่ถูกต้อง')
        return
      }
      if(this.state.includeBreak){
        if(!this.state.breakTime || !this.state.continueTime ){
          alert('กรุณาระบุเวลาพัก')
          return
        }
        if(startTime.getTime() > continueTime.getTime() ||
        startTime.getTime() > breakTime.getTime() ||
        endTime.getTime() < breakTime.getTime() ||
        endTime.getTime() < continueTime.getTime() ||
        breakTime.getTime() > continueTime.getTime()
        ){
          alert('รูปแบบเวลาไม่ถูกต้อง')
          return
        }
        if(
          startTime.getHours() === continueTime.getHours() ||
          startTime.getHours() === breakTime.getHours() ||
          endTime.getHours() === continueTime.getHours() ||
          endTime.getHours() === breakTime.getHours()
      ){
          alert('รูปแบบเวลาไม่ถูกต้อง')
          return
        }
      }
    } else {
      if(startTime.getTime() < endTime.getTime()){
        alert('รูปแบบเวลาไม่ถูกต้อง')
        return
      }
      if(startTime.getHours() === endTime.getHours()){
        alert('รูปแบบเวลาไม่ถูกต้อง')
        return
      }
    }
    this.setState(() => ({
      loading: true
    }))

    insertMutipleEmployeeTimetable({
      selectedEmployeeList: this.state.selectedEmployeeList,
      date: this.state.date,
      startTime,
      breakTime,
      continueTime,
      endTime,
      nightShift,
      endDate: this.state.endDate
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.closeAddMultiple()
      }else{
        alert(res.msg)
        this.setState(() => ({
          loading: false
        }))
      }
    })

  }

  render(){
    return (
      <div className="row">
        {
          this.state.loading &&
          <div className="top-layer">
            <div className="loader"></div>
          </div>
        }
        <div className="col-12">
          <h4>กรุณาเลือกพนักงาน</h4>
        </div>
        <div className="col-6 my-3 employeeSelection">
          <div className="row px-2">
            {
              this.props.employeeList.map(x =>
                <div onClick={() => this.employeeOnClick(x.id)} className="col-12 my-1 py-1" style={{background: this.isEmployeeSelected(x.id) ?  '#56c9ff' : '#f9c91b'}}>
                  {x.name} ({x.id})
                </div>
              )
            }
          </div>
        </div>
        <div className="col-12">
          <label className="label-control">เลือกวันที่: </label>
          <DatePicker
            selected={this.state.date}
            onChange={date => this.setDate(date)}
            minDate={new Date(Date.now() + 86400000)}
          />
        </div>
        <div className="col-12">
          <label className="label-control">ถึงวันที่: </label>
          <DatePicker
            selected={this.state.endDate}
            onChange={date => this.setEndDate(date)}
            minDate={this.state.date}
          />
        </div>
        <div className="col-12">
            <div className="row">
              {
                this.state.nightShift ?
                <div className="col-6 text-center">
                  <button style={{width: '100%'}} onClick={this.toggleNightShift} className="btn btn-dark">Night Shift</button>
                </div>
                :
                <div className="col-6 text-center">
                  <button style={{width: '100%'}} onClick={this.toggleNightShift} className="btn btn-light">Day Shift</button>
                </div>
              }
            </div>
            <div className="row mb-3">
              <div className="col-3 col-md-6 text-left">
                เข้างาน:
              </div>
              <div className="col-9 col-md-6">
                <DatePicker
                  selected={this.state.startTime}
                  onChange={date => this.setStartTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={60}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  customInput={<DateDisplayInput />}
                />
              </div>
            </div>
            { this.state.includeBreak &&
              <div className="row mb-3 col-md-12">
                <div className="col-3 col-md-6">
                พักงาน:
                </div>
                <div className="col-9  mb-3 col-md-6">
                  <DatePicker
                    selected={this.state.breakTime}
                    onChange={date => this.setBreakTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={60}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    customInput={<DateDisplayInput />}
                  />
                </div>
                <div className="col-3 col-md-6">
                ต่องาน:
                </div>
                <div className="col-9 col-md-6">
                  <DatePicker
                    selected={this.state.continueTime}
                    onChange={date => this.setContinueTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={60}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    customInput={<DateDisplayInput />}
                  />
                </div>
              </div>
            }
            <div className="row mb-3">
              <div className="col-3 col-md-6 text-left">
              ออกงาน:
              </div>
              <div className="col-9">
                <DatePicker
                  selected={this.state.endTime}
                  onChange={date => this.setEndTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={60}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  customInput={<DateDisplayInput />}
                />
              </div>
            </div>
            <div className="row mb-3">
              { !this.state.nightShift &&
                <div className="col-6 text-center">
                  <button style={{width: '100%'}} onClick={this.toggleBreakTime} className="btn btn-warning">Break</button>
                </div>
              }

            </div>
            <div className="row ">
              <div className="col-6 col-md-6 text-center">
                <button onClick={this.saveTime} style={{width: '100%'}} className="btn btn-success">บันทึก</button>
              </div>
              <div className="col-12">

              </div>
              <div className="col-6 col-md-6 text-center">
                <button style={{width: '100%'}} onClick={this.closeAddMultiple} className="btn btn-danger">ปิด</button>
              </div>
            </div>
        </div>
      </div>
    )
  }
}

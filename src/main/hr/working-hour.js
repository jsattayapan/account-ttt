import React from 'react'
import {
  getWorkingTimeSummary,
  getDepartments,
  downloadTimescanBydepartmentAndMonth,
  getNotQualifyTimetableByMonth
} from './tunnel'
import { displaySchedule } from './tools'
import Select from 'react-select'
import moment from 'moment'
import CalculateSalaryPage from './calculate_salary_page'
import { AddTimetableSection,AddTimeSection } from './staff-finger-scan-time'
import DatePicker from 'react-datepicker'



export default class WorkingHour extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      month: new Date(),
      departmentId: '',
      departmentOptions:[],
      result: [],
      dismatchMonth: new Date(),
      dismatchEmployeeTime: [],
      sub_page: 'fix_timetable_page'
    }
  }
  componentDidMount(){
    getDepartments(res => {
      if(res.status){
        const departmentOptions = res.departments.map(x => ({value: x.id, label: x.name}))
        console.log(res);
        this.setState(() => ({
        departmentOptions
        }))
      }
    })
  }

  departmentOnChange = input => {
    this.setState(() => ({
      departmentId: input.value
    }))
  }

  setStartDate = (date) => {
    this.setState(() => ({
      month: date
    }))
  }
  findBtn = () => {
    const {departmentId, month} = this.state
    if(month === ''){
      alert('กรุณาระบุเดือน')
      return
    }
    if(departmentId === ''){
      alert('กรุณาระบุแผนก')
      return
    }
    downloadTimescanBydepartmentAndMonth({departmentId, month}, res => {
      if(res.status){
        console.log(res.uri)
        window.open(res.uri)

      }else{
        alert(res.msg)
      }
    })
  }
  render(){
    return (
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-3 p-3">
              <label className="label-control">
                เดือน
              </label>
              <DatePicker
              selected={this.state.month}
              onChange={(date) => this.setStartDate(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
    />
            </div>
            <div className="col-3 p-3">
              <label className="label-control">
                แผนก
              </label>
              <Select options={this.state.departmentOptions} onChange={this.departmentOnChange} />
            </div>
            <div className="col-3 p-3">
              <button onClick={this.findBtn} className="btn btn-success">ค้นหา</button>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className='col-3'>
              <button onClick={() => this.setState(() => ({sub_page: 'fix_timetable_page'}))} className="btn btn-link btn-block">เวลาที่ต้องแก้ไข</button>
            </div>
            <div className='col-3'>
              <button onClick={() => this.setState(() => ({sub_page: 'calculate_salary_page'}))} className="btn btn-link btn-block">ประมวลเงินเดือน</button>
            </div>
          </div>
        </div>
        { this.state.sub_page === 'fix_timetable_page' &&
          <DismatchTime />
        }
        {
          this.state.sub_page === 'calculate_salary_page'&&
          <CalculateSalaryPage />
        }
      </div>
    )
  }
}

class DismatchTime extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      dismatchMonth: new Date(),
      dismatchEmployeeTime: [],
    }
  }

  reload = () => {
    this.componentDidMount()
  }

  componentDidMount() {
    getNotQualifyTimetableByMonth({month: this.state.dismatchMonth}, res => {
      if(res.status){
        this.setState(() => ({
          dismatchEmployeeTime: res.payload
        }))
        console.log(res.payload);
      }
    })
  }

  changeDate = status => {
    let date = this.state.dismatchMonth
    let newDate
    if(status){
      newDate = new Date(date.getFullYear(), date.getMonth()+ 1)
    }else{
      newDate = new Date(date.getFullYear(), date.getMonth() - 1)
    }

    getNotQualifyTimetableByMonth({month: newDate}, res => {
      if(res.status){
        this.setState(() => ({
          dismatchEmployeeTime: res.payload,
          dismatchMonth: newDate
        }))
      }
    })
  }

  render() {
    return (
      <div className="col-12">
        <div className="row">
          <div className="col-12">
            <div className="row mb-3">
              <div className="col-3 text-right">
                <button onClick={() => this.changeDate(false)} className="btn btn-warning">&larr;</button>
              </div>
              <div className="col-3 text-center">
                <button className="btn btn-dark">{moment(this.state.dismatchMonth).format('MMM/YYYY')}</button>
              </div>
              <div className="col-3">
                <button onClick={() => this.changeDate(true)}  className="btn btn-warning">&rarr;</button>
              </div>
            </div>
          </div>
          {
          this.state.dismatchEmployeeTime.map(emp => (
            <div className="col-12">
              <table className="table table-bordered">
              <thead>
              <tr>
                <th colSpan="6">{emp.id}<br />{emp.name}</th>
              </tr>
              <tr>
                <th>วันที่</th>
                <th>เข้า</th>
                <th>พัก</th>
                <th>กลับเข้า</th>
                <th>ออก</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
                {
                  emp.dismatchTimeList.map(time => {
                    let startTime = time.scanTime.find(x => x.type === 'start')
                    let breakTime = time.scanTime.find(x => x.type === 'break')
                    let continueTime = time.scanTime.find(x => x.type === 'continue')
                    let endTime = time.scanTime.find(x => x.type === 'end')
                    return (
                      <tr>
                        <td>{time.date}<br />({displaySchedule(time.timetable)})</td>
                        <td>{startTime ? startTime.time : '-'}</td>
                        <td>{breakTime ? breakTime.time : '-'}</td>
                        <td>{continueTime ? continueTime.time : '-'}</td>
                        <td>{endTime ? endTime.time : '-'}</td>
                        <EditStaffTime reload={this.reload} employeeId={emp.id} date={time.date} />
                      </tr>
                    )
                  })
                }
              </tbody>
              </table>
            </div>
          ))
        }
        </div>
      </div>
    )
  }
}

class EditStaffTime extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showAction: '',

    }
  }

  reload = () => {
      this.setState(() => ({showAction: ''}))
      this.props.reload()
    }

  setAction = action => {
    this.setState(() => ({
      showAction: action
    }))
  }

  render(){
    return(
      <td>
        <button onClick={() => this.setAction('fingerTime')} className='btn btn-success mr-2'>⍝</button>
        <button onClick={() => this.setAction('timetable')} className='btn btn-warning'>📅</button>
        <br />
        {
          this.state.showAction === 'timetable' &&
          <AddTimetableSection successfulSubmitTime={this.reload} toggleAddTimetable={() => this.setAction('')} employeeId={this.props.employeeId} date={this.props.date} />
        }

        {
          this.state.showAction === 'fingerTime' &&
          <AddTimeSection successfulSubmitTime={this.reload} employeeId={this.props.employeeId} date={this.props.date} />
        }

      </td>
    )
  }
}

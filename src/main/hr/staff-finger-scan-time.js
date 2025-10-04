import React from 'react'
import moment from 'moment'
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";

import {
  getMonthlyTimeScanByEmployeeId,
  submitEmployeeScanTimeManual,
  getEmployeeHourSalary,
  deleteFingerScanTimeByDate
} from './tunnel'

import { displaySchedule } from './tools'

import { submitEmployeeTimetable } from './../dept-manager/tunnel'

export default class FingerScanTimeSection extends React.Component{
  constructor(props){
    super(props)
    let currentMonth = moment()
    if(parseInt(moment().format('DD')) > 20 ){
      currentMonth = currentMonth.add(12, 'days')
    }
    this.state = {
      timeList: [],
      currentMonth,
      showAddTime: false,
      showAddTimetable: false,
      earning: ''
    }
  }
  componentDidMount() {
    getMonthlyTimeScanByEmployeeId({employeeId: this.props.employee.id, inputMonth: this.state.currentMonth}, res => {
      if(res.status){
        console.log(res);
        this.setState(() => ({
          timeList: res.payload,
        }))
      }
    })
    getEmployeeHourSalary({employeeId: this.props.employee.id, month: this.state.currentMonth}, res => {
      if(res.status){
        this.setState(() => ({
          earning: res.payload.earning
        }))
      }
    })
  }

  changeMonth = forward => {
    let currentMonth = this.state.currentMonth
    let newMonth = ''
    if(forward){
      newMonth = currentMonth.add(1, 'months')
    }else{
      newMonth = currentMonth.add(-1, 'months')
    }
    this.setState(() => ({currentMonth: newMonth}), () => {
      this.componentDidMount()
    })

  }


  calculateWorkingTime = minutes => {
    let day = parseInt(minutes/(600))
    let dayR = minutes%600
    let hr = parseInt(dayR/60)
    let hrR = dayR%60
    return day + ' Days ' + hr + ' Hr ' + hrR + ' m'
    // return parseInt(minutes/(10*60))+ ' D '+ parseInt(minutes/(60) + ' Hr'
  }


minutesToDisplay = minutes => {
  if(minutes === '***'){
    return '***'
  }else{
  return  parseInt(minutes/60) + ' Hr ' + minutes % 60 + ' mins'
  }
}

toggleAddTime = () => {
  this.setState(() => ({
    showAddTime: !this.state.showAddTime,
    showAddTimetable: false
  }))
}

toggleAddTimetable = () => {
  this.setState(() => ({
    showAddTime: false,
    showAddTimetable: !this.state.showAddTimetable
  }))
}

successfulSubmitTime = () => {
  this.setState(() => ({
    showAddTime: false,
    showAddTimetable: false
  }))
  this.componentDidMount()
}

  calculateTimeList = () => {
    const tempTimeList = this.state.timeList
    let payload = this.state.timeList.map((ea, index) => {
      let countableWorkingTime = 0;
      let diffStart = null;
      let diffBreak = null;
      let diffContinue = null;
      let diffEnd = null;

      ea['diffStart'] = diffStart
      ea['diffBreak'] = diffBreak
      ea['diffContinue'] = diffContinue
      ea['diffEnd'] = diffEnd

      if(!ea.timetable){
        ea['countableWorkingTime'] = '***'
        return ea
      }

      if(ea.start && ea.timetable.startTime !== null){
        const fingerTime = moment(ea.start.time, 'hh:mm');
        let schduleTime = moment(moment(ea.timetable.startTime).format('kk:mm'), 'hh:mm')
        let diff = moment.duration(schduleTime.diff(fingerTime))
        diffStart = diff.asMinutes()
      }
      if(ea.break && ea.timetable.breakTime !== null){
        const fingerTime = moment(ea.break.time, 'hh:mm');
        let schduleTime = moment(moment(ea.timetable.breakTime).format('kk:mm'), 'hh:mm')
        let diff = moment.duration(fingerTime.diff(schduleTime))
        diffBreak = diff.asMinutes()
      }
      if(ea.continue && ea.timetable.continueTime !== null){
        const fingerTime = moment(ea.continue.time, 'hh:mm');
        let schduleTime = moment(moment(ea.timetable.continueTime).format('kk:mm'), 'hh:mm')
        let diff = moment.duration(schduleTime.diff(fingerTime))
        diffContinue = diff.asMinutes()
      }
      if(ea.end && ea.timetable.endTime !== null){
        const fingerTime = moment(ea.end.time, 'hh:mm');
        let schduleTime = moment(moment(ea.timetable.endTime).format('kk:mm'), 'hh:mm')
        let diff = moment.duration(fingerTime.diff(schduleTime))
        diffEnd = diff.asMinutes()
      }

      ea['diffStart'] = diffStart
      ea['diffBreak'] = diffBreak
      ea['diffContinue'] = diffContinue
      ea['diffEnd'] = diffEnd

      // CALCULATE NIGHT SHIFT
        if(!ea.start){
          ea['countableWorkingTime'] = '***'
          return ea
        }
        if(!ea.end){
          ea['countableWorkingTime'] = '***'
          return ea
        }
        if(!ea.continue && ea.break){
          ea['countableWorkingTime'] = '***'
          return ea
        }

        if(!ea.break){
        //2
        if(!ea.timetable){
          ea['countableWorkingTime'] = '***'
          return ea
        }

        const start = moment(ea.start.time, "hh:mm");
        const end = moment(ea.end.time, "hh:mm");
        const schduleStart = moment(moment(ea.timetable.startTime).format('kk:mm'), 'hh:mm')
        const schduleEnd = moment(moment(ea.timetable.endTime).format('kk:mm'), 'hh:mm')

        let startSet
        let endSet

        if(start.isSameOrAfter(schduleStart, 'minute')){
          startSet = start
        }else{
          startSet = schduleStart
        }

        if(end.isSameOrBefore(schduleEnd, 'minute')){
          endSet = end
        }else{
          endSet = schduleEnd
        }
        const diff = moment.duration(endSet.diff(startSet));
        const minutes = diff.asMinutes()
        ea['countableWorkingTime'] = minutes
        return ea
        // return {minutes , value: parseInt(minutes/60) + ' Hr ' + minutes % 60 + ' mins'} ;
      }else{
        if(!ea.timetable){
          ea['countableWorkingTime'] = '***'
          return ea
        }
        //4
        const start = moment(ea.start.time, "hh:mm");
        const tbreak = moment(ea.break.time, "hh:mm");
        const tcontinue = moment(ea.continue.time, "hh:mm");
        const end = moment(ea.end.time, "hh:mm");
        const schduleStart = moment(moment(ea.timetable.startTime).format('kk:mm'), 'hh:mm')
        const schduleEnd = moment(moment(ea.timetable.endTime).format('kk:mm'), 'hh:mm')

        let startSet
        let endSet
        if(start.isSameOrAfter(schduleStart, 'minute')){
          startSet = start
        }else{
          startSet = schduleStart
        }

        if(end.isSameOrBefore(schduleEnd, 'minute')){
          endSet = end
        }else{
          endSet = schduleEnd
        }

        if(ea.timetable.breakTime === null){

          const diff = moment.duration(tbreak.diff(startSet));
          const diff2 = moment.duration(endSet.diff(tcontinue));
          const minutes = diff.asMinutes() + diff2.asMinutes()
          ea['countableWorkingTime'] = minutes
          return ea
        }else{
          const schduleBreak = moment(moment(ea.timetable.breakTime).format('kk:mm'), 'hh:mm')
          const schduleContinue = moment(moment(ea.timetable.continueTime).format('kk:mm'), 'hh:mm')
          let breakSet
          let continueSet
          if(tbreak.isSameOrBefore(schduleBreak, 'minute')){
            breakSet = tbreak
          }else{
            breakSet = schduleBreak
          }

          if(tcontinue.isSameOrAfter(schduleContinue, 'minute')){
            continueSet = tcontinue
          }else{
            continueSet = schduleContinue
          }
          const diff = moment.duration(breakSet.diff(startSet));
          const diff2 = moment.duration(endSet.diff(continueSet));
          const minutes = diff.asMinutes() + diff2.asMinutes()
          ea['countableWorkingTime'] = minutes
          return ea
        }


        // return {minutes , value: parseInt(minutes/60) + ' Hr ' + minutes % 60 + ' mins'} ;
      }

    })
    return payload
  }

  deleteFingerScanTimeByDate = (scanType, date, employeeId) => {
    console.log(scanType, date, employeeId);
    var r = window.confirm(scanType, date, employeeId);
    if(r){
      deleteFingerScanTimeByDate({scanType, date, employeeId},res => {
        if(!res.status){
          alert(res.msg)
        }else{
          this.componentDidMount()
        }
      })
    }
  }

  render() {
    // var duration = moment.duration(totalWorkingTime, 'minutes');
    let newTimeList = this.calculateTimeList()
    let totalWorkingTime = newTimeList.reduce((total, ea) => {
      if(ea.countableWorkingTime !== '***'){
        return total + ea.countableWorkingTime
      }else{
        return total
      }
    }, 0)
    return(
      <div className="col-12 mt-3">

        <div className="row mb-3">
          <div className="col-12 col-md-4 d-flex justify-content-center text-center">
            <button onClick={this.toggleAddTime} className="btn btn-info btn-block">ใส่เวลานิ้วมือ</button>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-center text-center">
            <button onClick={this.toggleAddTimetable} className="btn btn-info btn-block">ใส่ตารางาน</button>
          </div>
        </div>
        { this.state.showAddTime &&
          <AddTimeSection successfulSubmitTime={this.successfulSubmitTime} toggleAddTime={this.toggleAddTime} employeeId={this.props.employee.id} />
        }
        { this.state.showAddTimetable &&
          <AddTimetableSection successfulSubmitTime={this.successfulSubmitTime} toggleAddTimetable={this.toggleAddTimetable} employeeId={this.props.employee.id} />
        }
        <div className="row">
          <div className="col-4 text-right">
            <button onClick={() => this.changeMonth(false)} className="btn btn-warning">{'<'}</button>
          </div>
          <div className="col-4 text-center">
            {this.state.currentMonth.format('MMM YYYY')}
          </div>
          <div className="col-4 text-left">
            <button onClick={() => this.changeMonth(true)} className="btn btn-warning">{'>'}</button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mt-3">
            <table className="table table-bordered">
              <thead>
                <tr>

                  <th className="text-right" colSpan="4" style={{color:'green', fontSize: '24px'}}>
                    {
                      this.calculateWorkingTime(totalWorkingTime)
                    }
                  </th>
                  <th className="text-right" colSpan="2">
                    {this.state.earning} บาท
                  </th>
                </tr>
                <tr>
                  <th>วันที่</th>
                  <th>เข้า</th>
                  <th>พัก</th>
                  <th>กลับเข้า</th>
                  <th>ออก</th>
                  <th>รวม</th>
                </tr>
              </thead>
              <tbody>
                {

                  newTimeList.reverse().map(x =>{
                      return (<tr>
                        <td>{x.date}<br />({displaySchedule(x.timetable)})</td>
                        <td>{x.start ? <button onClick={() => this.deleteFingerScanTimeByDate('start', x.date, this.props.employee.id)} className="btn btn-danger">{x.start.time}</button> : '-'} {(x.diffStart !== null && x.diffStart < 0) && <span style={{color: 'red'}}>({x.diffStart})</span> }</td>
                        <td>{x.break ? <button onClick={() => this.deleteFingerScanTimeByDate('break', x.date, this.props.employee.id)} className="btn btn-danger">{x.break.time}</button> : '-'} {(x.diffBreak !== null && x.diffBreak < 0) && <span style={{color: 'red'}}>({x.diffBreak})</span> }</td>
                        <td>{x.continue ? <button onClick={() => this.deleteFingerScanTimeByDate('continue', x.date, this.props.employee.id)} className="btn btn-danger">{x.continue.time}</button> : '-'} {(x.diffContinue !== null && x.diffContinue < 0) && <span style={{color: 'red'}}>({x.diffContinue})</span> }</td>
                        <td>{x.end ? <button onClick={() => this.deleteFingerScanTimeByDate('end', x.date, this.props.employee.id)} className="btn btn-danger">{x.end.time}</button> : '-'} {(x.diffEnd !== null && x.diffEnd < 0) && <span style={{color: 'red'}}>({x.diffEnd})</span> }</td>
                        <td>{this.minutesToDisplay(x.countableWorkingTime)}</td>
                      </tr>)
                    }
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export class AddTimetableSection extends React.Component {
  constructor(props){
    super(props)
    let date;
    if(this.props.date){
      date = moment(this.props.date, 'DD/MM/YYYY').toDate()
    }else{
      date = new Date()
    }
    this.state = {
      date,
      startTime: null,
      breakTime: null,
      continueTime: null,
      endTime: null,
      nightShift: false
    }
  }

  submitTime = () => {
    const { date, startTime, breakTime, continueTime, endTime, nightShift } = this.state
    if(!startTime || !endTime ){
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
    if(breakTime || continueTime){
      if(!breakTime || !continueTime ){
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
    submitEmployeeTimetable({
      employeeId: this.props.employeeId,
      date: moment(date).format('DD/MM/YYYY'),
      startTime,
      breakTime,
      continueTime,
      endTime,
      nightShift,
      type: 'service'
    },res => {
      console.log(res);
      if(res.status){
        this.props.successfulSubmitTime()
        alert('ข้อมูลถูกบันทึก')
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return(
      <div className="row">
      {
        this.props.date === undefined && <div className="col-12">
        <div className="form-group">
          <label className="form-label" for="exampleFormControlInput1">วันที่</label>
          <DatePicker
            selected={this.state.date}
            onChange={date => {this.setState(() => ({date:date}))}}
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>
      }
      <div className="col-12">
        <div className="form-group">
          <label className="form-label" for="exampleFormControlInput1">เข้า</label>
          <DatePicker
          selected={this.state.startTime}
          onChange={date => {this.setState(() => ({startTime:date}))}}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeCaption="Time"
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          />
        </div>
      </div>
      <div className="col-12">
        <div className="form-group">
          <label className="form-label" for="exampleFormControlInput1">พัก</label>
          <DatePicker
          selected={this.state.breakTime}
          onChange={date => {this.setState(() => ({breakTime:date}))}}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeCaption="Time"
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          />
        </div>
      </div>
      <div className="col-12">
        <div className="form-group">
          <label className="form-label" for="exampleFormControlInput1">กลับเข้า</label>
          <DatePicker
          selected={this.state.continueTime}
          onChange={date => {this.setState(() => ({continueTime:date}))}}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeCaption="Time"
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          />
        </div>
      </div>
      <div className="col-12">
        <div className="form-group">
          <label className="form-label" for="exampleFormControlInput1">ออก</label>
          <DatePicker
          selected={this.state.endTime}
          onChange={date => {this.setState(() => ({endTime:date}))}}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeCaption="Time"
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          />
        </div>
      </div>
      <div className="col-12">
        <button onClick={this.submitTime} className="btn btn-success">
          บันทึก
        </button>
      </div>
      <div className="col-12 col-md-2">
        <button onClick={this.props.toggleAddTimetable} className="btn btn-danger">
          ปิด
        </button>
      </div>
      </div>
    )
  }
}

export class AddTimeSection extends React.Component {
  constructor(props){
    super(props)
    const selectTime = this.props.date ? moment(this.props.date, 'DD/MM/YYYY').toDate() : new Date()
    this.state = {
      selectTime,
      timeType: ''
    }
  }

  submitTime = () => {
    const {selectTime, timeType} = this.state
    const id =  this.props.employeeId
    if( selectTime === '' || timeType === ''){
      alert('กรุณาระบุวันเวลาและประเภทการบันทึก')
      return
    }

    submitEmployeeScanTimeManual({selectTime, timeType, id}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.successfulSubmitTime()
      }else{
        alert(res.msg)
      }
    })
  }

  optionOnChange = input => {
    this.setState(() => ({
      timeType: input.value
    }))
  }

  render(){
    const timeTypeOptions = [
      {label: 'เข้า', value: 'start'},
      {label: 'พัก', value: 'break'},
      {label: 'กลับเข้า', value: 'continue'},
      {label: 'ออกงาน', value: 'end'},
    ]
    return (
      <div className="row">
        <div className="col-12 col-md-4">
          <div className="form-group">
            <label for="exampleFormControlInput1">วันที่และเวลา</label>
              <DatePicker
                selected={this.state.selectTime}
                onChange={date => {this.setState(() => ({selectTime:date}))}}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="form-group">
            <label for="exampleFormControlInput1">วันที่และเวลา</label>
              <Select onChange={this.optionOnChange} options={timeTypeOptions} />
          </div>
        </div>
        <div className="col-12 col-md-2">
          <button onClick={this.submitTime} className="btn btn-success">
            บันทึก
          </button>
        </div>
        <div className="col-12 col-md-2">
          <button onClick={this.props.toggleAddTime} className="btn btn-danger">
            ปิด
          </button>
        </div>
      </div>
    )
  }
}

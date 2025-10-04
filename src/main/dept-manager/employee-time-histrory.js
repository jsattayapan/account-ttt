import React from 'react'
import moment from 'moment'
import './employee-time-histrory.css'

import {
  getMonthlyTimeScanByEmployeeId
} from '../hr/tunnel'
import { displaySchedule } from '../hr/tools'

export class EmployeeTimeHistrory extends React.Component {
  constructor(props){
    super(props)
    let currentMonth = moment()
    if(parseInt(moment().format('DD')) > 20 ){
      currentMonth = currentMonth.add(12, 'days')
    }
    this.state = {
      timeList: [],
      currentMonth
    }
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

  calculateTimeList = () => {
    const tempTimeList = this.state.timeList
    let payload = this.state.timeList.map((ea, index) => {
      console.log(ea);
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

  componentDidMount(){
    getMonthlyTimeScanByEmployeeId({employeeId: this.props.employee.id, inputMonth: this.state.currentMonth}, res => {
      if(res.status){
        console.log(res);
        this.setState(() => ({
          timeList: res.payload,
        }))
      }
    })
  }
  render(){
    let newTimeList = this.calculateTimeList()
    let totalWorkingTime = newTimeList.reduce((total, ea) => {
      if(ea.countableWorkingTime !== '***'){
        return total + ea.countableWorkingTime
      }else{
        return total
      }
    }, 0)
    return (
      <div className="col-12 employee-time-histrory-frame">
        <div className="row">
          <div className="col-12">
            <button onClick={this.props.closeModal} className="btn btn-danger">ปิด</button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {this.props.employee.id} - {this.props.employee.name}
          </div>
        </div>
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

                  <th className="text-right" colSpan="6" style={{color:'green', fontSize: '24px'}}>
                    {
                      this.calculateWorkingTime(totalWorkingTime)
                    }
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
                        <td>{x.start ? x.start.time : '-'} {(x.diffStart !== null && x.diffStart < 0) && <span style={{color: 'red'}}>({x.diffStart})</span> }</td>
                        <td>{x.break ? x.break.time : '-'} {(x.diffBreak !== null && x.diffBreak < 0) && <span style={{color: 'red'}}>({x.diffBreak})</span> }</td>
                        <td>{x.continue ? x.continue.time : '-'} {(x.diffContinue !== null && x.diffContinue < 0) && <span style={{color: 'red'}}>({x.diffContinue})</span> }</td>
                        <td>{x.end ? x.end.time : '-'} {(x.diffEnd !== null && x.diffEnd < 0) && <span style={{color: 'red'}}>({x.diffEnd})</span> }</td>
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

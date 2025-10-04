import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronCircleRight, faChevronCircleLeft, faArrowUp, faArrowDown,faUsersCog,
  faBuilding, faSave, faCloudSun, faBed,faExclamationTriangle, faCoffee, faUndoAlt,
  faUser, faCalendarAlt, faHome, faTools, faFileInvoiceDollar,faBullhorn, faPencilAlt, faLocationArrow,faChevronDown
 } from '@fortawesome/free-solid-svg-icons'
 import { IP,
   getMonthlyTimeScanByEmployeeId,
 } from './tunnel'
 import { BottomNav } from './index.js'
export default class TimetableView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      timetableList: [],
      currentMonth: new Date()
    }
  }

  componentDidMount(){
    let { employeeId } = this.props
    let { currentMonth } = this.state
    getMonthlyTimeScanByEmployeeId({employeeId, inputMonth: currentMonth}, res => {
      if(res.status){
        console.log(res.payload);
        this.setState(() => ({
          timetableList: res.payload
        }))
      }
    })
  }

  monthOnChange = (input) => {
    let {currentMonth} = this.state
    let { employeeId } = this.props
    if(input){
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }else{
      currentMonth.setMonth(currentMonth.getMonth() - 1)
    }
    getMonthlyTimeScanByEmployeeId({employeeId, inputMonth: currentMonth}, res => {
      if(res.status){
        console.log(res.payload);
        this.setState(() => ({
          timetableList: res.payload,
          currentMonth
        }))
      }
    })
  }


  render(){

    let {timetableList, currentMonth} = this.state

    return (
      <div className="row">
        <div className="d-flex flex-row justify-content-center mt-4">
          <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(false)} color="#f2c66f" icon={faChevronCircleLeft} />
          <span id="month-title">
            {moment(currentMonth).format('MMMM')}
          </span>
          <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(true)} color="#f2c66f" icon={faChevronCircleRight} />
        </div>
        <p style={{fontSize: '13px', color: 'white'}} className="mt-3">* หากเวลาไม่ถูกต้อง สามารถไปที่ "แจ้งปัญหา"</p>
        <div className="d-flex flex-row justify-content-center">
          <table className="table table-sm text-light timetable">
            <thead>
              <tr style={{color: '#f2c66f', width: '40%'}}>
                <th>วันที่</th>
                <th style={{ width: '15%'}} align="center">เข้า</th>
                <th style={{ width: '15%'}} align="center">พัก</th>
                <th style={{ width: '15%'}} align="center">กลับเข้า</th>
                <th style={{ width: '15%'}} align="center">ออก</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.timetableList.map(x => {
                  return (
                    <tr style={{borderBottom: '1px solid white'}}>
                      <td className="align-middle" style={{fontSize: '13px', fontWeight: '', width: '40%'}}>{x.date}<br />
                      <span style={{color: '#919191'}}>
                        {
                          x.timetable !== undefined ?
                          x.timetable.breakTime !== null ?
                          `${moment(x.timetable.startTime).format('HH:mm')} - ${moment(x.timetable.breakTime).format('HH:mm')}, ${moment(x.timetable.continueTime).format('HH:mm')} - ${moment(x.timetable.endTime).format('HH:mm')}`
                          :
                          `${moment(x.timetable.startTime).format('HH:mm')} - ${moment(x.timetable.endTime).format('HH:mm')}`
                          :
                          ''
                        }</span>
                      </td>
                      <td className="align-middle" style={{fontSize: '13px', width: '15%'}} align="center">{x.start !== undefined ? x.start.time : '-' }</td>
                      <td className="align-middle" style={{fontSize: '13px', width: '15%'}} align="center">{x.break !== undefined ? x.break.time : '-' }</td>
                      <td className="align-middle" style={{fontSize: '13px', width: '15%'}} align="center">{x.continue !== undefined ? x.continue.time : '-' }</td>
                      <td className="align-middle" style={{fontSize: '13px', width: '15%'}} align="center">{x.end !== undefined ? x.end.time : '-' }</td>
                    </tr>
                  )
                }
                )
              }
            </tbody>
          </table>
        </div>
        <div style={{height:'100px', width: '50px'}}>

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

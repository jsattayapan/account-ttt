import React from 'react'
import moment from 'moment'
import Select from 'react-select'

import { getEmployeeTimetableByDate, getDepartments } from './tunnel'

export default class StaffTimetableDaily extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      employeeList : [],
      departmentList: [],
      selectedDate: new Date(),
      departmentSelected: ''
    }
  }
  changeDate = status => {
    let date = this.state.selectedDate
    let newDate
    if(status){
      newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 )
    }else{
      newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1 )
    }
    getEmployeeTimetableByDate({ date: newDate }, res => {
      if(res.status){
        this.setState(() => ({
          employeeList: res.employeeList,
          selectedDate: newDate
        }))
      }else{
        alert(res.msg)
      }
    })
  }
  componentDidMount(){
    console.log('his');
    getEmployeeTimetableByDate({ date: new Date() }, res => {
      if(res.status){
        this.setState(() => ({
          employeeList: res.employeeList
        }))
      }else{
        alert(res.msg)
      }
    })
    getDepartments(res => {
      if(res.status){
        this.setState(() => ({
          departmentList: res.departments
        }))
      }
    })
  }
  departmentChange = e => {
    this.setState(() => ({
      departmentSelected: e.value
    }))
  }
  render(){
    return(
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <div className="row mb-3">
                <div className="col-3 text-right">
                  <button onClick={() => this.changeDate(false)} className="btn btn-warning">&larr;</button>
                </div>
                <div className="col-3 text-center">
                  <button className="btn btn-dark">{moment(this.state.selectedDate).format('DD/MMM/YYYY')}</button>
                </div>
                <div className="col-3">
                  <button onClick={() => this.changeDate(true)}  className="btn btn-warning">&rarr;</button>
                </div>
                <div className="col-3">
                  <Select options={ [{label: 'ทุกแผนก', value: ''}, ...this.state.departmentList.map(x => {
                      return {label: x.name, value: x.id}
                    }) ] } onChange={this.departmentChange} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              {
                this.state.departmentSelected !== '' ? this.state.departmentList.filter(x => x.id === this.state.departmentSelected).map(dept => {
                  let list = this.state.employeeList.filter(x => x.departmentId === dept.id)
                  return (
                    <div className="row mt-3">
                      <div clasName="col-12">
                        <h3>{dept.name}</h3>
                      </div>
                      <div className="col-12">
                        <TimetableByDepartment employeeList={list} />
                      </div>
                    </div>
                  )
                }) :
                this.state.departmentList.map(dept => {
                  let list = this.state.employeeList.filter(x => x.departmentId === dept.id)
                  return (
                    <div className="row mt-3">
                      <div clasName="col-12">
                        <h3>{dept.name}</h3>
                      </div>
                      <div className="col-12">
                        <TimetableByDepartment employeeList={list} />
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const TimetableByDepartment = props => {
  const calculateTimetable = (index, timetable) => {
    if(timetable.status){
      let { startTime, breakTime, continueTime, endTime, nightShift } = timetable
      startTime =  new Date(startTime).getHours()
      endTime =  new Date(endTime).getHours()
      let found = false
      if(breakTime){
        breakTime =  new Date(breakTime).getHours()
        continueTime =  new Date(continueTime).getHours()
        for(let count = startTime; count < breakTime; count++){
          if(count === index){
            found = true
          }
        }
        for(let count = continueTime; count < endTime; count++){
          if(count === index){
            found = true
          }
        }

      }else{
        if(nightShift){
          for(let count = startTime; count < 24; count++){
            if(count === index){
              found = true
            }
          }
          for(let count = 0; count < endTime; count++){
            if(count === index){
              found = true
            }
          }
        }else{
          for(let count = startTime; count < endTime; count++){
            if(count === index){
              found = true
            }
          }
        }
      }
      return found
    }else{
      return false
    }
  }

  return   <table className="table table-bordered">
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>0</th>
          <th>1</th>
          <th className="timetable-line">2</th>
          <th>3</th>
          <th>4</th>
          <th className="timetable-line">5</th>
          <th>6</th>
          <th>7</th>
          <th className="timetable-line">8</th>
          <th>9</th>
          <th>10</th>
          <th className="timetable-line">11</th>
          <th>12</th>
          <th>13</th>
          <th className="timetable-line">14</th>
          <th>15</th>
          <th>16</th>
          <th className="timetable-line">17</th>
          <th>18</th>
          <th>19</th>
          <th className="timetable-line">20</th>
          <th>21</th>
          <th>22</th>
          <th className="timetable-line">23</th>
        </tr>
      </thead>
      <tbody>
        {
          props.employeeList.map(x => {
            return (
              <tr>
                <th>{x.name}</th>
                {calculateTimetable(0, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}>0</td> : <td>0</td>}
                {calculateTimetable(1, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}></td> : <td></td>}
                {calculateTimetable(2, x.timetable) ? <td className="timetable-line" style={{backgroundColor: '#bee8be'}}></td> : <td className="timetable-line"></td>}
                {calculateTimetable(3, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}>3</td> : <td>3</td>}
                {calculateTimetable(4, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}></td> : <td></td>}
                {calculateTimetable(5, x.timetable) ? <td className="timetable-line" style={{backgroundColor: '#bee8be'}}></td> : <td className="timetable-line"></td>}
                {calculateTimetable(6, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}>6</td> : <td>6</td>}
                {calculateTimetable(7, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}></td> : <td></td>}
                {calculateTimetable(8, x.timetable) ? <td className="timetable-line" style={{backgroundColor: '#bee8be'}}></td> : <td className="timetable-line"></td>}
                {calculateTimetable(9, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}>9</td> : <td>9</td>}
                {calculateTimetable(10, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}></td> : <td></td>}
                {calculateTimetable(11, x.timetable) ? <td className="timetable-line" style={{backgroundColor: '#bee8be'}}></td> : <td className="timetable-line"></td>}
                {calculateTimetable(12, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}>12</td> : <td>12</td>}
                {calculateTimetable(13, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}></td> : <td></td>}
                {calculateTimetable(14, x.timetable) ? <td className="timetable-line" style={{backgroundColor: '#bee8be'}}></td> : <td className="timetable-line"></td>}
                {calculateTimetable(15, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}>15</td> : <td>15</td>}
                {calculateTimetable(16, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}></td> : <td></td>}
                {calculateTimetable(17, x.timetable) ? <td className="timetable-line" style={{backgroundColor: '#bee8be'}}></td> : <td className="timetable-line"></td>}
                {calculateTimetable(18, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}>18</td> : <td>18</td>}
                {calculateTimetable(19, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}></td> : <td></td>}
                {calculateTimetable(20, x.timetable) ? <td className="timetable-line" style={{backgroundColor: '#bee8be'}}></td> : <td className="timetable-line"></td>}
                {calculateTimetable(21, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}>21</td> : <td>21</td>}
                {calculateTimetable(22, x.timetable) ? <td style={{backgroundColor: '#bee8be'}}></td> : <td></td>}
                {calculateTimetable(23, x.timetable) ? <td className="timetable-line" style={{backgroundColor: '#bee8be'}}></td> : <td className="timetable-line"></td>}
              </tr>
            )
          })
        }
      </tbody>
    </table>
}

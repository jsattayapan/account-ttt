import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import DatePicker from "react-datepicker";
import { faArrowRight, faArrowLeft, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from 'react-select';

import "react-datepicker/dist/react-datepicker.css";


import { uploadStaffFingerScanFile, submitEmpFile, getSevenDayTimescan } from './tunnel'

const DateDisplayInput = ({value, onClick}) => (
  <button onClick={onClick} className="btn btn-dark">
    {value}
  </button>
)

export class StaffTimetable extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: [],
      showImport: false,
      date: new Date(),
      departmentOptions: [],
      selectedDepartment: '',
      displayData : [],
      dateList: []
    }
  }

  setDateToTable = (value) => {
    getSevenDayTimescan({ date: value }, res => {
      if(res.status){
        console.log(res.data);
        this.setState(() => ({
          data: res.data,
          date: value,
          dateList: res.data[0].dates,
          displayData: this.state.selectedDepartment === '' ?
          res.data.reduce((list, dep) => ([...list, ...dep.list]), []) :
          res.data.find(x => x.name === this.state.selectedDepartment).list
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  componentDidMount(){
    getSevenDayTimescan({ date: new Date() }, res => {
      if(res.status){
        console.log(res.data);
        this.setState(() => ({
          data: res.data,
          departmentOptions: res.data.map(x => ({value: x.name, label: x.name})),
          dateList: res.data[0].dates,
          displayData: res.data.reduce((list, dep) => ([...list, ...dep.list]), [])
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  departmentOnChange = (e) => {
    this.setState(() => ({
      selectedDepartment: e.value,
      displayData: this.state.data.find(x => x.name === e.value).list
    }))

  }

  minusDay = () => {
    let date = new Date(this.state.date)
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
    getSevenDayTimescan({ date }, res => {
      if(res.status){
        console.log(res.data);
        this.setState(() => ({
          data: res.data,
          date,
          dateList: res.data[0].dates,
          displayData: this.state.selectedDepartment === '' ?
          res.data.reduce((list, dep) => ([...list, ...dep.list]), []) :
          res.data.find(x => x.name === this.state.selectedDepartment).list
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  plusDay = () => {
    let date = new Date(this.state.date)
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    getSevenDayTimescan({ date }, res => {
      if(res.status){
        console.log(res.data);
        this.setState(() => ({
          data: res.data,
          date,
          dateList: res.data[0].dates,
          displayData: this.state.selectedDepartment === '' ?
          res.data.reduce((list, dep) => ([...list, ...dep.list]), []) :
          res.data.find(x => x.name === this.state.selectedDepartment).list
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  inputDataOnChange = (e) => {
    const value = e.target.value
    this.setState(() => ({
      inputData: value
    }))
  }

  submitFile = () => {
    if(this.state.inputData === ''){
      alert('กรุณาใส่ข้อมูล')
      return
    }

    uploadStaffFingerScanFile ({inputData: this.state.inputData}, res => {
      if(res.status){
        alert('Success')
        // this.setState(() => ({ result: res.file}))
      }else{
        alert('Failed')
      }
    })
  }

  render(){
    return(
      <div className="row">
        <div className="col-6">
          <h3>ตารางาน</h3>
        </div>
        <div className="col-6">
         <button
           onClick={() => this.setState(() => ({showImport: !this.state.showImport}))}
           className="btn btn-link">เพิ่มข้อมูลลายนิ้วมือ</button>
       </div>
       { this.state.showImport &&
         <div className="col-12">
           <div className="row">
             <div className='col-12'>
               <h3>ประมวลข้อมูลลายนิ้วมือ</h3>
             </div>
           </div>
           <div className="row">
             <div className="col-6">
               <textarea onChange={(e) => this.inputDataOnChange(e)}>{this.state.inputData}</textarea>
             </div>
             <div className="col-3">
               <button onClick={this.submitFile} className="btn btn-success">ประมวล</button>
             </div>
           </div>
         </div>}
         <div className="col-12">
           <div className="row">
             <div className="col-3 text-right">
               <FontAwesomeIcon className="arrowBtn" onClick={this.minusDay} icon={faArrowLeft} size="2x" />
             </div>
             <div className="col-3 text-center">
               <DatePicker selected={this.state.date} onChange={this.setDateToTable} customInput={<DateDisplayInput />} dateFormat="dd MMM yyyy" />
             </div>
             <div className="col-2">
               <FontAwesomeIcon className="arrowBtn" onClick={this.plusDay} icon={faArrowRight} size="2x" />
             </div>
             <div className="col-2 text-right">
               แผนก:
             </div>
             <div className="col-2">
               <Select options={this.state.departmentOptions} onChange={this.departmentOnChange} />
             </div>
           </div>
           <div className="row">
             <div className="col-12">
                 <DepartmentTimetable name={this.state.selectedDepartment} dates={this.state.dateList} list={this.state.displayData} />
             </div>
           </div>
         </div>
      </div>
    )
  }
}

// { this.state.data.map(x => (
//   <DepartmentTimetable name={x.name} dates={x.dates} list={x.list} />
// ))}



class DepartmentTimetable extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showEmployee: false
    }
  }

  render(){
    return (
      <div className="row mt-4">
          <div className="col-12">
            <table className="table table-bordered table-hover table-dark">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                {
                  this.props.dates.map(x => (
                    <th className="text-center">{x}</th>
                  ))
                }
                </tr>
              </thead>
              <tbody>
                {
                  this.props.list.length !== 0 ?
                    this.props.list.map(x => (
                      <tr>
                        <th>{x.name}</th>
                      {
                        x.times.map(y => (
                            y.length === 0 ?
                            <td align="center">ไม่พบข้อมูล</td>
                            :y.length === 1 ?
                              <td title={y.map(ti => moment(ti).format('LT'))} align="center">{moment(y[0]).format('LT')}<br />-<br />ไม่พบข้อมูลออก</td>
                            : y.length === 2 ?
                              <td title={y.map(ti => moment(ti).format('LT'))} align="center">{moment(y[0]).format('LT')}<br />-<br />{moment(y[1]).format('LT')}<hr/>
                               <span style={{color:'yellow'}}>{parseInt(parseInt((y[1] - y[0])/60000)/60)}.{numeral(parseInt((y[1] - y[0])/60000)%60).format('00')} ชม</span></td>
                            : y.length === 3 ?
                              <td title={y.map(ti => moment(ti).format('LT'))} align="center">{moment(y[0]).format('LT')}<br />-<br />{moment(y[2]).format('LT')}<hr />
                            <span style={{color:'yellow'}}>{parseInt(parseInt((y[2] - y[0])/60000)/60)}:{numeral(parseInt((y[2] - y[0])/60000)%60).format('00')} ชม</span></td>
                            : y.length === 4 ?
                              <td title={y.map(ti => moment(ti).format('LT'))} align="center">{moment(y[0]).format('LT')}<br />-<br />{moment(y[1]).format('LT')}<br />พัก<br />{moment(y[2]).format('LT')}<br />-<br />{moment(y[3]).format('LT')}<hr />
                              <span style={{color:'yellow'}}>{parseInt(parseInt((y[1] - y[0])/60000)/60) + parseInt(parseInt((y[3] - y[2])/60000)/60)} ชั่วโมง {(parseInt((y[1] - y[0])/60000)%60) + (parseInt((y[3] - y[2])/60000)%60) } นาที</span>
                          </td>
                            : <td title={y.map(ti => moment(ti).format('LT'))} align="center">มีข้อมูลมากเกิน</td>
                        ))
                      }
                      </tr>
                    ))
                  :
                  <tr colSpan="8">
                    <td>ไม่พบข้อมูล</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
      </div>
    )
  }
}



// Code Import FingerScan Display
{/* <div className="col-12">
  {this.state.resultImport.length !== 0 &&
    this.state.resultImport.map(x => (
      <div className="row">
        <div className="col-12">
          <table className="table">
            <thead>
              <tr>
                <th>{x.id}<br/>{x.name}<br />{x.position}</th>
                <th>เข้างาน</th>
                <th>พัก</th>
                <th>กลับเข้างาน</th>
                <th>เลิกงาน</th>
                <th>เวลาที่ทำงาน</th>
              </tr>
            </thead>
            <tbody>
              {x.empTime.map(y => {
                if(y.date !== null){
                  if(y.times.length === 0){
                    return (
                      <tr>
                        <th>{moment(y.date).format('DD/MM/YYYY')}</th>
                        <td colSpan='5'>ไม่มีข้อมุล</td>
                      </tr>
                    )
                  }
                  if(y.times.length === 2){
                    return (
                      <tr>
                        <th>{moment(y.date).format('DD/MM/YYYY')}</th>
                        <td>{moment(new Date(y.times[0])).format('LT')}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{moment(new Date(y.times[1])).format('LT')}</td>
                        <td>{parseInt(parseInt((y.times[1] - y.times[0])/60000)/60)} ชั่วโมง {parseInt((y.times[1] - y.times[0])/60000)%60} นาที</td>
                      </tr>
                    )
                  }
                  if(y.times.length === 3){
                    return (
                      <tr>
                        <th>{moment(y.date).format('DD/MM/YYYY')}</th>
                        <td>{moment(new Date(y.times[0])).format('LT')}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{moment(new Date(y.times[2])).format('LT')}</td>
                        <td>{parseInt(parseInt((y.times[2] - y.times[0])/60000)/60)} ชั่วโมง {parseInt((y.times[2] - y.times[0])/60000)%60} นาที</td>
                      </tr>
                    )
                  }
                  if(y.times.length === 4){
                    return (
                      <tr>
                        <th>{moment(y.date).format('DD/MM/YYYY')}</th>
                        <td>{moment(new Date(y.times[0])).format('LT')}</td>
                        <td>{moment(new Date(y.times[1])).format('LT')}</td>
                        <td>{moment(new Date(y.times[2])).format('LT')}</td>
                        <td>{moment(new Date(y.times[3])).format('LT')}</td>
                        <td>{parseInt(parseInt((y.times[1] - y.times[0])/60000)/60) + parseInt(parseInt((y.times[3] - y.times[2])/60000)/60)} ชั่วโมง {(parseInt((y.times[1] - y.times[0])/60000)%60) + (parseInt((y.times[3] - y.times[2])/60000)%60) } นาที</td>
                      </tr>
                    )
                  }
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    ))
  }
</div> */}

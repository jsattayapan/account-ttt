import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Loading from 'react-fullscreen-loading';
import {
  getStaffTimetableByDate,
  uploadStaffFingerScanFile
} from './tunnel'

export default class StaffTimetableByDate extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      date: new Date(),
      employeeList: [],
      departmentList: [],
      showAddFingerScan: false,
      fingerScanText: '',
      loading: false
    }
  }

  componentDidMount(){
    this.setState(() => ({
      loading: true
    }))
    getStaffTimetableByDate({date: new Date(this.state.date)}, res => {
      if(res.status){
        console.log(res)
        this.setState(() => ({
          employeeList: res.employeeList,
          departmentList: res.departmentList,
          loading: false
        }))
      }else{
        alert(res.msg)
        this.setState(() => ({
          loading: false
        }))
      }
    })
  }

  submitFingerScan = () => {
    const data = this.state.fingerScanText
    if(data.trim() === ''){
      alert('กรุณาใส่ข้อมูลในนิ้วมือ')
      return
    }
    this.setState(() => ({
      loading: true
    }))
    uploadStaffFingerScanFile ({inputData: data}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          loading: false
        }))
      }else{
        alert(res.msg)
        this.setState(() => ({
          loading: false
        }))
      }
    })
  }

  fingerScanTextOnChange = e => {
    const value = e.target.value
    this.setState(() => ({
      fingerScanText: value
    }))
  }

  toggleShowAddFingerScan = () => {
    this.setState(() => ({
      showAddFingerScan: !this.state.showAddFingerScan,
      fingerScanText: ''
    }))
  }

  dateChange = (date) => {
    this.setState(() => ({date, loading: true}))
    getStaffTimetableByDate({date: new Date(date)}, res => {
      if(res.status){
        console.log(res)
        this.setState(() => ({
          employeeList: res.employeeList,
          departmentList: res.departmentList,
          loading: false
        }))
      }else{
        alert(res.msg)
        this.setState(() => ({
          loading: false
        }))
      }
    })
  }



  render(){
    return(
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-6 col-md-3 mb-3">
              <div className="form-group">
                <label>วันที่</label>
              <DatePicker className="form-control" selected={this.state.date} onChange={date => this.dateChange(date)} />
              </div>
            </div>
            {/* <div className="col-6 col-md-3 mb-3">
              <div className="form-group">
                <label>ค้นหา</label>
              <input className="form-control" type="text" placeholder='ชื่อหรือรหัสพนักงาน' />
              </div>
            </div> */}
          </div>

            {
              this.state.departmentList.map(x => (
                <div className="row">
                  {
                    this.state.loading &&
                    <Loading loading background="rgba(80,80,80,0.1)" loaderColor="#3498db" />
                  }
                  <div className="col-12">
                    <h3>{x.name}</h3>
                  </div>
                <div className="col-12">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ชื่อ</th>
                        <th>เวลาเข้า</th>
                        <th>พัก</th>
                        <th>ทำงานต่อ</th>
                        <th>เวลาออก</th>

                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.employeeList.filter(y => y.departmentId === x.id).map(emp =>
                          {
                            let difIn, difBreak, difContinue, difOut
                            if(emp.fingerIn === '-' && emp.timeIn !== '-'){
                              difIn = 'ไม่พบรายนิ้วมือเข้างาน'
                            }else if(emp.fingerIn !== '-' && emp.timeIn === '-'){
                              difIn = 'เข้างานแต่ไม่มีตารางาน'
                            }else if(emp.fingerIn === '-' && emp.timeIn === '-'){
                              difIn = ''
                            }else if (emp.fingerIn === 'มีจำนวนรายนิ้วมือมากเกินกว่ากำหนด'){
                              difIn = 'มีจำนวนรายนิ้วมือมากเกินกว่ากำหนด'
                            }else{
                              let a = moment(emp.timeIn).format('HH:mm').split(':')
                              let b = emp.fingerIn.time.split(':')
                              let setTime = moment().set({minute: a[1], hour: a[0]})
                              let setFinger = moment().set({minute: b[1], hour: b[0]})
                              difIn = setTime.diff(setFinger, 'minute')
                              difIn = difIn < 0 ? `สาย ${difIn * -1} นาที`: ''
                            }

                            if(emp.fingerBreak === '-' && emp.timeBreak !== '-'){
                              difBreak = 'ไม่พบรายนิ้วมือพักงาน'
                            }else if(emp.fingerBreak !== '-' && emp.timeBreak === '-'){
                              difBreak = 'ไม่พบเวลาพักงาน'
                            }else if(emp.fingerBreak === '-' && emp.timeBreak === '-'){
                              difBreak = ''
                            }else {
                              let a = moment(emp.timeBreak).format('HH:mm').split(':')
                              let b = emp.fingerBreak.time.split(':')
                              let setTime = moment().set({minute: a[1], hour: a[0]})
                              let setFinger = moment().set({minute: b[1], hour: b[0]})
                              difBreak = setTime.diff(setFinger, 'minute')
                              difBreak = difBreak > 0 ? `พักก่อนเวลา ${difBreak} นาที`: ''
                            }

                            if(emp.fingerContinue === '-' && emp.timeContinue !== '-'){
                              difContinue = 'ไม่พบรายนิ้วมือกลับเข้าทำงาน'
                            }else if(emp.fingerContinue !== '-' && emp.timeContinue === '-'){
                              difContinue = 'ไม่พบเวลากลับเข้างาน'
                            }else if(emp.fingerContinue === '-' && emp.timeContinue === '-'){
                              difContinue = ''
                            }else{
                              let a = moment(emp.timeContinue).format('HH:mm').split(':')
                              let b = emp.fingerContinue.time.split(':')
                              let setTime = moment().set({minute: a[1], hour: a[0]})
                              let setFinger = moment().set({minute: b[1], hour: b[0]})
                              difContinue = setTime.diff(setFinger, 'minute')
                              difContinue = difContinue < 0 ? `สาย ${difContinue * -1} นาที`: ''
                            }

                            if(emp.fingerOut === '-' && emp.timeOut !== '-'){
                              difOut = 'ไม่พบรายนิ้วมือออกงาน'
                            }else if(emp.fingerOut !== '-' && emp.timeOut === '-'){
                              difOut = 'ไม่พบเวลาออกงาน'
                            }else if(emp.fingerOut === '-' && emp.timeOut === '-'){
                              difOut = ''
                            }else{
                              let a = moment(emp.timeOut).format('HH:mm').split(':')
                              let b = emp.fingerOut.time.split(':')
                              let setTime = moment().set({minute: a[1], hour: a[0]})
                              let setFinger = moment().set({minute: b[1], hour: b[0]})
                              difOut = setTime.diff(setFinger, 'minute')
                              difOut = difOut > 0 ? `ออกก่อนเวลา ${difOut } นาที`: ''
                            }

                            if(emp.timeIn === 'วันหยุดประจำสัปดาห์'){
                                difIn = ''
                                difOut = ''
                            }





                            return (
                              <tr>
                                <td>
                                  <p><b>{emp.id}: {emp.name}</b></p>
                                </td>
                                <td>{emp.fingerIn.time} (<span style={{color: emp.timeIn === 'วันหยุดประจำสัปดาห์'?'green':'black'}}>{(emp.timeIn !== '-' && emp.timeIn !=='วันหยุดประจำสัปดาห์') ? moment(emp.timeIn).format('HH:mm') : emp.timeIn}</span>) <span style={{color: 'red'}}>{difIn}</span></td>
                              <td>{emp.fingerBreak.time} ({emp.timeBreak !== '-' ? moment(emp.timeBreak).format('HH:mm') : '-'}) <span style={{color: 'red'}}>{difBreak}</span></td>
                            <td>{emp.fingerContinue.time} ({emp.timeContinue !== '-' ? moment(emp.timeContinue).format('HH:mm') : '-'}) <span style={{color: 'red'}}>{difContinue}</span></td>
                          <td>{emp.fingerOut.time} ({emp.timeOut !== '-' ? moment(emp.timeOut).format('HH:mm') : '-'}) <span style={{color: 'red'}}>{difOut}</span></td>

                              </tr>
                            )
                          }
                        )
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            ))
            }
        </div>
      </div>
    )
  }
}

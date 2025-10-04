import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Select from 'react-select';
import validator from 'validator';
import moment from 'moment'
import numeral from 'numeral'
import Swal from 'sweetalert2'
import { getEmployeeList,
  activateEmployee,
  updateEmployeeImage,
  submitEditSalary,
  getSalaryByEmployeeId,
  submitWarning,
  getWarningById,
  submitLeave,
  getLeaveById,
  getDepartments,
  updateEmployeePosition,
  getTimetableByEmployeeId,
  setEmployeeFingerId,
  getFingerScanByEmployeeId,
  getMonthlyTimeScanByEmployeeId,
  updateWarningApprove,
  resetLineIdByEmployeeId,
  deleteAllFingerPrintByEmployeeId,
  submitDocument,
  getEmployeeDocumentById
} from './tunnel'
import { IP } from './../../constanst'
import { faCircle, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";

import FingerScanTimeSection from './staff-finger-scan-time'
import AccountSection from './staff-account'

export default class Profile extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      employee: {},
      subPage: 'ประวัติการลา',
      showSalary: false,
      showEditSalary: false,
      showEditPosition:false,
      positionAmount: 0,
      salaryAmount: 0,
      positionAmountDisplay: 0,
      salaryAmountDisplay: 0,
      salaryList: [],
      selectedPosition: '',
      selectedDepartment: '',
      departmentOptions: [],
      timetable: '',
      showFingerSetting: false,
      fingerId: '',
      fingerScanId: '',
      fingerScanIdList: []
    }
  }

  fingerIdOnChange = (e) => {
    const {value} = e.target
    this.setState(() =>  ({
      fingerId: value
    }))
  }

  fingerScanIdOnChange = (input) => {
    this.setState(() => ({
      fingerScanId: input.value
    }))
  }

  closeFingerSetting = () => {
    this.setState(() => ({
      fingerId: '',
      fingerScanId: '',
      showFingerSetting: false
    }))
  }

  submitFingerId = () => {
    let {fingerId, fingerScanId} = this.state
    const id = this.state.employee.id
    if(fingerScanId === ''){
      alert('ข้อมูลรายนิ้วมือไม่ถูกต้อง')
      return
    }

    fingerId = fingerId === '' ? '' : parseInt(fingerId)

    setEmployeeFingerId({employeeId:id, fingerId, fingerScanId}, res => {
      if(res.status){
      this.setState(() => ({
        fingerId: '',
        fingerScanId: '',
        showFingerSetting: false,
        employee: res.employee
      }))
        this.props.updateEmployeeList()
      }else{
        alert(res.msg)
      }
    })
  }

  onAmountChange = e => {
    const value = e.target.value
    const id = e.target.id
    if(validator.isFloat(value) || value === ''){
      this.setState(() => ({
        [id]: value
      }))
    }
  }

  componentDidMount(){
    this.setState(() => ({
      employee: this.props.employee
    }))
    getFingerScanByEmployeeId({employeeId: this.props.employee.id}, res => {
      if(res.status){
        this.setState(() => ({
          fingerScanIdList: res.fingerScanIdList
        }))
      }
    })
    getSalaryByEmployeeId({employeeId: this.props.employee.id}, res => {
      if(res.status){
        let salaryFound = res.salaryList.find(x => x.active)
        if(salaryFound){
          this.setState(() => ({
            positionAmountDisplay: salaryFound.positionAmount,
            salaryAmountDisplay: salaryFound.salaryAmount,
          }))
        }
      }
    })
    getTimetableByEmployeeId({employeeId: this.props.employee.id, date: new Date()}, res => {
      if(res.status){
        this.setState(() => ({
          timetable: res.timetableData
        }))
      }else{
        alert(res.msg)
      }
    })
    getDepartments(res => {
      if(res.status){
        let departmentOptions = res.departments.map(x => ({ label: x.name, value: x.id }))
        this.setState(() => ({
          departmentOptions
        }))
      }
    })
  }

  activateEmployee = () =>{
    const id = this.state.employee.id
    const active = !this.state.employee.active
    const username = this.props.user.username
    activateEmployee({id, active, username}, res => {
      if(res.status){
        this.setState(() => ({
          employee: res.employee
        }))
        this.props.updateEmployeeList()
      }else{
        alert(res.msg)
      }
    })
  }

  imageOnChange = (event) => {
  updateEmployeeImage({id: this.state.employee.id, image: event.target.files[0]}, (data) => {
    if(data.status){
      this.setState(() => ({
        employee: data.employee
      }))
      this.props.updateEmployeeList()
    }else{
      alert(data.msg)
    }
  })
}

openSarayBox = () => {
  if(this.state.showSalary){
    this.setState(() => ({
      showSalary: false
    }))
    return
  }
  let password = prompt('กรุณาใส่ Password');
  if(password === '1101402'){
    this.setState(() => ({
      showSalary:true
    }))
  }else{
    alert('Password ไม่ถูกต้อง')
  }
}

closeChangePosition = () => {
  this.setState(() => ({
    showEditPosition: false,
    selectedPosition: '',
    selectedDepartment: ''
  }))
}

submitEditSalary = () => {
  if(this.state.salaryAmount < 1){
    alert('กรุณาใส่จำนวนเงินเดือนให้ถูกต้อง')
    return
  }
  let employeeId = this.state.employee.id
  let salaryAmount = this.state.salaryAmount
  let positionAmount = this.state.positionAmount
  let createBy = this.props.user.username

  submitEditSalary({employeeId, salaryAmount, positionAmount, createBy}, res => {
    if(res.status){
      alert('ข้อมูลถูกบันทึก')
      this.setState(() => ({
        salaryAmountDisplay: parseFloat(res.salary.salaryAmount),
        positionAmountDisplay: parseFloat(res.salary.positionAmount),
      }))
    }else{
      alert(res.msg)
    }
  })
}

toggleEditPosition = () => {
  this.setState(() => ({
    showEditPosition: !this.state.showEditPosition
  }))
}
toggleEditFingerScan = () => {
  this.setState(() => ({
    showFingerSetting: !this.state.showFingerSetting
  }))
}

departmentOnChange = e => {
  this.setState(() => ({
    selectedDepartment: e
  }))
}

positionOnChange = e => {
  const value = e.target.value
  this.setState(() => ({
    selectedPosition: value
  }))
}

reloadEmployeeTimetable = () => {
  getTimetableByEmployeeId({employeeId: this.props.employee.id, date: new Date()}, res => {
    if(res.status){
      this.setState(() => ({
        timetable: res.timetableData
      }))
    }else{
      alert(res.msg)
    }
  })
}

resetLineIdOnClick = () => {
    var r = window.confirm("ยืนยันการรีเซ็ท Line ID!");
    if (r == true) {
      resetLineIdByEmployeeId({id: this.props.employee.id}, res => {
        if(res.status){
          alert('การ Reset สำเร็จ')
        }else{
          alert(res.msg)
        }
      })
    }
}

deleteFignerPrintOnClick = () => {
  var r = window.confirm("ยืนยันการลบลายน้ิวมือ");
  if (r == true) {
    deleteAllFingerPrintByEmployeeId({id: this.props.employee.id}, res => {
      if(res.status){
        alert('การลบสำเร็จ')
      }else{
        alert(res.msg)
      }
    })
  }
}

submitChangePosition = () => {
  const role = this.state.selectedPosition
  const departmentId = this.state.selectedDepartment.value
  if(role.trim() === ''){
    alert('กรุณาระบุตำแหน่ง')
    return
  }

  if(!departmentId){
    alert('กรุณาเลือกแผนก')
    return
  }
  updateEmployeePosition({
    role,
    departmentId,
    username: this.props.user.username,
    employeeId: this.state.employee.id
  }, res => {
    if(res){
      alert('ข้อมูลถูกบันทึก')
      this.props.updateEmployeeList()
      this.setState({
        showEditPosition: false,
        selectedPosition: '',
        selectedDepartment: '',
        employee: res.employee
      })
    }else{
      alert(res.msg)
    }
  })
}

  render(){
    return(
      <div className="col-12">
        <div className="row">
            <div className="col-8">
              <div className="row">
                <div className="col-3">
                  <div className="row mb-3">
                    <div className="col-12 mb-3 fixIconEmpRelative text-center">
                      <label for="employeeChangeInput" className="fixIconEmp">
                        <FontAwesomeIcon title="แก้ไขข้อมูล" color='black' icon={faPen}  />
                      </label>
                      <input id="employeeChangeInput"type="file" onChange={this.imageOnChange} style={{display: 'none'}} />
                    <img
                      src={this.state.employee.imageUrl ? IP + '/public/employee/' + this.state.employee.imageUrl : IP + '/public/employee/person.png'}
                      className={this.state.employee.active ? "personIconActive" : "personIconInactive"}
                      alt="Smiley face"
                      height="120"
                      width="120" />
                    </div>
                </div>
                <div className="row">
                  <div className="col-12 text-center">
                    <b>{this.state.employee.id}</b>
                  </div>
                  <div className="col-12 text-center">
                    <b>{this.state.employee.name}</b>
                  </div>
                  <div className="col-12 text-center">
                    {this.state.employee.role}
                  </div>
                  <div className="col-12 text-center">
                    <b>{this.state.employee.departmentName}</b>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="row">
                  <div className="col-12">
                    วันที่เริ่มทำงาน: {this.state.employee.startJob}
                  </div>
                  <div className="col-12">
                    เบอร์ติดต่อ: {this.state.employee.phone || '-'}
                  </div>
                  <div className="col-12">
                    ที่อยู่: {this.state.employee.address || '-'}
                  </div>
                </div>
              </div>
              </div>
              { this.state.timetable !== '' && <div className="row">
                <div className="col-12">
                  <table className="table table-dark table-border">
                    <thead>
                      <tr>
                        {this.state.timetable.dates.map(x =>
                          <th>{x}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {this.state.timetable.timetable.map(x =>
                          x.startTime !== null ?
                          x.breakTime !== null ?
                          <td>{moment(x.startTime).format('LT')} - {moment(x.breakTime).format('LT')}, {moment(x.continueTime).format('LT')} - {moment(x.endTime).format('LT')}</td>
                          :
                          <td>{moment(x.startTime).format('LT')} - {moment(x.endTime).format('LT')} {x.nightShift && <span className="badge badge-secondary">Night Shift</span>}</td>
                          :
                          x.dayOff.status ?
                          <td>
                            {x.dayOff.type}
                          </td>
                          :
                          <td>
                            ยังไม่ระบุเวลาทำงาน
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>}
              <div className="row mx-2">
                <div className="col-12">
                  <div className="row">
                    <div onClick={() => this.setState(() => ({subPage: 'ประวัติการลา'}))} className={`col-2 text-center ${this.state.subPage === 'ประวัติการลา' ? 'subPage-select' : 'subPage'}`}>
                      ประวัติการลา
                    </div>
                    <div onClick={() => this.setState(() => ({subPage: 'ใบเตือน'}))} className={`col-2 text-center ${this.state.subPage === 'ใบเตือน' ? 'subPage-select' : 'subPage'}`}>
                      ใบเตือน
                    </div>
                    <div onClick={() => this.setState(() => ({subPage: 'เงินได้ / เงินหัก'}))} className={`col-3 text-center ${this.state.subPage === 'เงินได้ / เงินหัก' ? 'subPage-select' : 'subPage'}`}>
                      เงินได้ / เงินหัก
                    </div>
                    <div onClick={() => this.setState(() => ({subPage: 'บันทึกเวลาลายนิ้วมือ'}))} className={`col-3 text-center ${this.state.subPage === 'บันทึกเวลาลายนิ้วมือ' ? 'subPage-select' : 'subPage'}`}>
                      บันทึกเวลาลายนิ้วมือ
                    </div>
                    <div onClick={() => this.setState(() => ({subPage: 'เอกสาร'}))} className={`col-2 text-center ${this.state.subPage === 'เอกสาร' ? 'subPage-select' : 'subPage'}`}>
                      เอกสาร
                    </div>
                  </div>
                </div>
                {
                  this.state.subPage === 'ประวัติการลา' &&
                  <LeaveSection reloadEmployeeTimetable={this.reloadEmployeeTimetable} user={this.props.user} employeeId={this.props.employee.id} />
                }
                {
                  this.state.subPage === 'เอกสาร' &&
                  <DocumentSection user={this.props.user} employeeId={this.props.employee.id} />
                }
                {
                  this.state.subPage === 'ใบเตือน' &&
                  <WarningSection user={this.props.user} employeeId={this.props.employee.id} employee={this.state.employee}/>
                }
                {
                  this.state.subPage === 'เงินได้ / เงินหัก' &&
                  <AccountSection user={this.props.user} employeeId={this.props.employee.id} />
                }
                {
                  this.state.subPage === 'บันทึกเวลาลายนิ้วมือ' &&
                  <FingerScanTimeSection user={this.props.user} employee={this.props.employee} />
                }
              </div>
            </div>
            <div className="col-4">
              <div className="row mb-3">
                <div className="col-12">
                  <button className="btn btn-danger" onClick={this.props.backBtn}>
                    กลับ
                  </button>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12 mb-3">
                  {
                    this.state.employee.active ?
                    <button className="btn btn-danger" onClick={this.activateEmployee}>
                      พักการทำงาน
                    </button>
                    :
                    <button className="btn btn-success" onClick={this.activateEmployee}>
                      เริ่มการทำงาน
                    </button>
                  }
                </div>
                <div className="col-12">
                  <button onClick={this.resetLineIdOnClick} className="btn btn-info">Reset Line Id</button>
                </div>
                <div className="col-12">
                  <button onClick={this.deleteFignerPrintOnClick} className="btn btn-info">ลบลายน้ิวมือทั้งหมด</button>
                </div>
              </div>
              <div className="row mb-3">
                {
                  this.state.showFingerSetting ?
                    <div className="col-12">
                      <label className="label-control">Finger ID:</label>
                    <br />
                  <input onChange={this.fingerIdOnChange} value={this.state.fingerId} className="form-control" />
                <br />
              <label className="label-control">Location:</label>
              <br />
            <Select onChange={this.fingerScanIdOnChange} options={[{label: 'Avatara', value: 1}, {label: 'Samed Pavilion', value: 2}]} />

                    <button onClick={this.submitFingerId} className="btn mt-2 btn-success mr-2">บันทึก</button>
                  <button onClick={this.closeFingerSetting} className="btn mt-2 btn-danger">ยกเลิก</button>
</div>
:
<div className="col-12">
<button onClick={this.toggleEditFingerScan} className="btn btn-warning">เพิ่มข้อมูลรายนิ้วมือ</button>
</div>
}



              </div>
              <div className="row">
              <div className="col-12">
                {this.state.fingerScanIdList.map(x =>
                <p>Finger ID: {x.fingerId} Location: {x.fingerScanId === 1 ? 'Avatara' : 'Samed Pavilion'}</p>)}
              </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <button onClick={this.toggleEditPosition} className="btn btn-warning">ปรับตำแหน่งงาน</button>
                </div>
              </div>
              {
                this.state.showEditPosition &&
                <div className="row">
                  <div className="col-12 mb-3">
                    <Select onChange={this.departmentOnChange} options={this.state.departmentOptions}/>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label>ตำแหน่ง</label>
                    <input onChange={this.positionOnChange} value={this.state.selectedPosition} type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-6">
                    <button onClick={this.submitChangePosition} className="btn btn-success">บันทึก</button>
                  </div>
                  <div className="col-6">
                    <button onClick={this.closeChangePosition} className="btn btn-danger">ปิด</button>
                  </div>
                </div>
              }
              <div className="row">
                <div onClick={this.openSarayBox} className="col-12 mt-3 mb-3">
                  {
                    this.state.showSalary ?
                    <div className="salaryBoxShow">
                      <div className="row">
                        <div className="col-12">
                          <b>เงินเดือน: </b>{numeral(this.state.salaryAmountDisplay).format('0,0')} บาท
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <b>ค่าตำแหน่ง: </b>{numeral(this.state.positionAmountDisplay).format('0,0')} บาท
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <b>รวม: </b>{numeral(this.state.salaryAmountDisplay + this.state.positionAmountDisplay).format('0,0')} บาท
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <b>ชั่วโมง: </b>{numeral(((this.state.salaryAmountDisplay + this.state.positionAmountDisplay)/26)/10).format('0,0')} บาท
                        </div>
                      </div>
                    </div>
                    :
                    <div className="salaryBox">
                      ดู Salary
                    </div>
                  }
                </div>
                {
                  this.state.showSalary &&
                  <div className="col-12">
                    <button onClick={() => this.setState(() => ({showEditSalary: true}))} className="btn btn-warning">ปรับฐานเงินเดือน</button>
                  </div>
                }
                {
                  this.state.showEditSalary &&
                  <div className="col-12 mt-3">
                    <div className="row">
                      <div className="col-12">
                        <div className="group-form">
                          <label for="salaryAmount">เงินเดือน</label>
                          <input onChange={this.onAmountChange} value={this.state.salaryAmount} type="text" className="form-control" id="salaryAmount" />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-12">
                        <div className="group-form">
                          <label for="positionAmount">ค่าตำแหน่ง</label>
                          <input onChange={this.onAmountChange} value={this.state.positionAmount} type="text" className="form-control" id="positionAmount" />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <button onClick={this.submitEditSalary} className="btn btn-success">บันทึก</button>
                      </div>
                      <div onClick={() => this.setState(() => ({showEditSalary: false}))} className="col-6">
                        <button className="btn btn-danger">ปิด</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
        </div>
      </div>
    )
  }
}


export class DocumentSection extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      file: '',
      filename: '',
      showAddNewDocument: false,
      documentList: []
    }
  }


  load(employeeId){
    getEmployeeDocumentById({employeeId}, res => {
      if(res.status){
        this.setState(() => ({
          documentList: res.documentList
        }))
      }
    })
  }

  componentDidMount(){
    this.load(this.props.employeeId)
  }


  showDocumentClick = () => {
    this.setState(() => ({
      showAddNewDocument: !this.state.showAddNewDocument
    }))
  }

  nameOnChange = e => {
    let { value } = e.target
    this.setState(() => ({
      filename: value
    }))
  }

  fileOnChange = e => {
    let { files } = e.target
    this.setState(() => ({
      file: files[0]
    }))
  }

  submitDocument = () => {
    let {employeeId} = this.props
    let { file, filename } = this.state
    if(filename.trim() === ''){
      Swal.fire({
        title: 'กรุณาใส่ชื่อเอกสาร',
        icon: 'error'
      })
      return
    }
    if(file === ''){
      Swal.fire({
        title: 'กรุณาอัพโหลดไฟล์',
        icon: 'error'
      })
      return
    }
    submitDocument({
      employeeId, file, filename
    }, res => {
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'ข้อมูลถูกบันทึก!'
        })
        this.setState(() => ({
          file: '',
          filename: '',
          showAddNewDocument: false
        }))
        getEmployeeDocumentById({employeeId}, res => {
          if(res.status){
            this.setState(() => ({
              documentList: res.documentList
            }))
          }
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: res.msg
        })
      }
    })
  }

  render(){
    return(
      <div className="col-12">
        <div className="col-12">
          <button onClick={this.showDocumentClick} className="btn btn-link">+ เอกสาร</button>
        </div>
        {
          this.state.showAddNewDocument &&
          <div className="col-12">
            <div className="col-12">
              <label>ชื่อเอกสาร</label>
              <input className=" mt-3 form-control" type="text" value={this.state.filename} onChange={this.nameOnChange} />
              <input onChange={this.fileOnChange} className="mt-3 input-control  d-block" type='file' accept="image/*, application/pdf" />
              {
                this.state.filename !== '' && this.state.file !== '' && <button onClick={this.submitDocument} className="mt-3 btn btn-success">Upload</button>
              }
            </div>
          </div>
        }
        <div className="col-12">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{width: '70%'}}>title</th>
                <th>Uploaded Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.documentList.map(x => (
                  <tr>
                    <th>{x.name}</th>
                    <td>{moment(x.createAt).format('MMMM DD, YYYY')}</td>
                    <td><a target="_blank" href={'https://tunit3-samed.ap.ngrok.io/public/storageEmployeeDocument/'+x.filename} className="btn btn-link">View</a></td>
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


export class WarningSection extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showWarningForm: false,
      warningList: [],
      remark: '',
      level: ''
    }
  }

  componentDidMount(){
    getWarningById({employeeId: this.props.employeeId}, res => {
      this.setState(() => ({
        warningList: res.warningList
      }))
    })
  }

  toggleWaringForm = () => {
    this.setState(() => ({
      showWarningForm: !this.state.showWarningForm
    }))
  }

  levelOnChange = input => {
    this.setState(() => ({
      level: input.value
    }))
  }

  remarkOnChange = e => {
    const value = e.target.value
    this.setState(() => ({
      remark: value
    }))
  }

  submitWarning = () => {
    const level = this.state.level
    const remark = this.state.remark
    const employee = this.props.employee
    if(level.trim() === ''){
      alert('กรุณาเลือกระดับความผิด')
      return
    }
    if(remark.trim() === ''){
      alert('รายละความผิด')
      return
    }

    const confirmWindow = window.open("Confirm", '', "width=595,height=842");

    const confirmHtml = ReactDOMServer.renderToStaticMarkup(
      <div>
        <div style={{fontFamily: 'Kanit', fontSize: '90%'}}>
          <div style={{textAlign: 'center'}}>
            <h4>หนังสือตักเตือน</h4>
          </div>
          <div style={{textAlign: 'right'}}>
            <h4>{moment().format('DD MMM YYYY')}</h4>
          </div>
          <p>ชื่อ <b>{employee.name}</b></p>
          <p>รหัสพนักงาน <b>{employee.id}</b></p>
          <p>แผนก <b>{employee.departmentName}</b> ตำแหน่ง <b>{employee.role}</b></p>
          <p style={{textIndent: '80px', marginTop: '150px'}}> ลักษณะความผิดที่กระทำคือ {remark} การกระทำดั่งกล่าง ถือเป็นการฝ่าฝืนข้อบังคับเกี่ยวกับการทำงาน หรือระเบียบ
            ทางรีสอร์ทจึงพิจรณาแล้ว เห็นสมควรพิจรณาโทษเป็นหนังสือตักตือน โดยให้ท่านปรับปรุง พฤติกรรมการทำงานของตัวเองเป็นพนักงานที่ดี มีประสิทธิภาพ และปฏิบัติตามระเบียบของรีสอร์ท หากพนักงานดังกล่าวกระทำการ หรือประพฤติผิดหรือฝ่าฝืนกฏข้อบังคับของรีอสร์ทอีก ทางรีสอร์ทจะดำเนินการตามมาตราการเป็นลำดับต่อไป</p>
          <p style={{paddingLeft: '450px',marginTop: '75px'}}>จึงแจ้งมาเพื่อทราบและปฏิบัติ</p>
          <p style={{paddingLeft: '450px',marginTop: '150px'}}>.......................................................</p>
          <p style={{paddingLeft: '450px'}}>กรรมการผู้จัดการ/ผู้รับมอบอำนาจ</p>
            <p style={{marginTop: '150px'}}>.......................................................</p>
            <p style={{paddingLeft: '30px'}}>พนักงานผู้กระทำผิดรับทราบ</p>
        </div>
      </div>
    );

    confirmWindow.document.title = 'Warning';
    confirmWindow.document.write(confirmHtml);

    submitWarning({level, remark, employeeId: this.props.employeeId, username: this.props.user.username}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          warningList: res.warningList,
          showWarningForm: false,
          remark: '',
          level: '',

        }))
      }else{
        alert(res.msg)
      }
    })
  }

  updateWarningApprove = (e, id) => {
    let imageFile = e.target.files[0]
    updateWarningApprove({imageFile, id}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })

  }

  render(){
    return(
      <div className="col-12">
        <div className="row">
          <div className="col-12">
            <button onClick={this.toggleWaringForm} className="btn btn-link">{this.state.showWarningForm ? '-' : '+'} เพิ่มใบเตือน</button>
          </div>
        </div>
        {
          this.state.showWarningForm &&
          <div className="row mb-3">
            <div className="col-3">
              <label className="form-label">ระดับความผิด (1-5) </label>
              <Select
                onChange={this.levelOnChange}
                options={[
                  {label: '1', value: '1'},
                  {label: '2', value: '2'},
                  {label: '3', value: '3'},
                  {label: '4', value: '4'},
                  {label: '5', value: '5'}
                ]} />
            </div>
            <div className="col-9">
              <label className="form-label">รายละความผิด </label>
              <textarea className="form-control" value={this.state.remark}  onChange={this.remarkOnChange} ></textarea>
            </div>
            <div className="col-3">
              <button onClick={this.submitWarning} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }
        <div className="row">
          <div className="col-12">
            <h4>ประวัติใบเตือน</h4>
          </div>
          <div className="col-12">
            <table className="table table-border table-dark">
              <thead>
                <tr>
                  <th>ระดับความรุนแรง</th>
                  <th>หมายเหตุ</th>
                  <th>พนักงานรับทราบ</th>
                  <th>วันที่บันทึก</th>
                </tr>
              </thead>
              <tbody>
                { this.state.warningList.length !== 0 ?
                  this.state.warningList.map(x => (
                    <tr>
                      <td>{x.level}</td>
                    <td>{x.remark}</td>
                    <td>{x.accepted === null ? <label name={x.id} for={x.id} className="btn btn-info" >บันทึกรับทราบ</label> : <button className="btn btn-dark" ><a href={IP +'/public/warning-approve/'+ x.accepted} target="_blank" download>ดูใบบันทึก</a></button>}
                      <input name={x.id} onChange={(e) => this.updateWarningApprove(e, x.id)} type="file" id={x.id} style={{display:'none'}} />
                    </td>
                  <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                    </tr>
                  ))
                :
                <tr>
                  <td colSpan="3">ไม่พบข้อมูล</td>
                </tr>
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

class LeaveSection extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showLeaveForm: false,
      leaveList: [],
      type:'',
      startDate: '',
      days: '',
      remark:'',
      payable: false,
      remainQuotaLeave: 0,
      remainSickLeave: 0,
      remainExtraLeave: 0
    }
  }

  componentDidMount(){
    getLeaveById({employeeId: this.props.employeeId}, res => {
      if(res.status){
        let {remainQuotaLeave ,remainSickLeave, remainExtraLeave} = res
        this.setState(() => ({
          leaveList: res.leaveList,
          remainQuotaLeave ,remainSickLeave, remainExtraLeave
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  submitLeave = () => {
    const type = this.state.type
    let startDate = this.state.startDate
    let days = this.state.days
    const remark = this.state.remark
    const payable = this.state.payable

    if(type.trim() === ''){
      alert('กรุณาเลือประเภทการลา')
      return
    }

    if(remark.trim() === ''){
      alert('กรุณาใส่หมายเหตุ')
      return
    }
    if(startDate.trim() === ''){
      alert('กรุณาระบุวันที่เริ่มหยุด')
      return
    }
    if(days.trim() === '' || days <= 0){
      alert('กรุณาระบุจำนวนวันลา')
      return
    }
    submitLeave({
      type,
      startDate,
      days,
      remark,
      username: this.props.user.username,
      employeeId: this.props.employeeId,
      payable
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.reloadEmployeeTimetable()
        this.setState(() => ({
          leaveList: res.leaveList,
          type:'',
          startDate: '',
          days: '',
          remark:'',
          payable: false
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  onTypeChange = input => {
    this.setState(() => ({
      type: input.value
    }))
  }

  onRemarkChange = e => {
    const value = e.target.value
    this.setState(() => ({
      remark: value
    }))
  }

  onDateChange = e => {
    const { value, id} = e.target
    this.setState(() => ({
      [id]: value
    }))
  }


  onDaysChange = e => {
    const value = e.target.value
    if(value === '' || validator.isInt(value)){
      this.setState(() => ({
        days: value
      }))
    }
  }

  toggleLeaveForm = () => {
    this.setState(() => ({
      showLeaveForm: !this.state.showLeaveForm
    }))
  }


  leaveSelection = [
    {value: 'ลากิจ', label:'ลากิจ'},
    {value: 'ลาป่วย', label:'ลาป่วย'},
    {value: 'ลา Extra', label:'ลา Extra'},
    {value: 'ลาพักร้อน', label:'ลาพักร้อน'},
    {value: 'ลา LWOP', label:'ลา LWOP'},
  ]

  render(){
    const { remainQuotaLeave ,remainSickLeave, remainExtraLeave } = this.state
    return(
      <div className="col-12">
        <div className="row mt-1">
          <div className="col-12 justify-content-center">
            <table className="table text-right table-bordered">
              <thead>
                <tr>
                  <th>ลากิจ</th>
                  <th>ลาป่วย</th>
                  <th>ลา Extra</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{3 - remainQuotaLeave} / 3</td>
                  <td>{30 - remainSickLeave} / 30</td>
                  <td>{6 - remainExtraLeave} / 6</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <button onClick={this.toggleLeaveForm} className="btn btn-link">{this.state.showLeaveForm ? '-' : '+'} เพิ่มการลา</button>
          </div>
        </div>
        {
          this.state.showLeaveForm &&
          <div className="row mb-3">
            <div className="col-3">
              <Select options={this.leaveSelection} selected={this.state.type} onChange={this.onTypeChange} />
            </div>
              <button onClick={() => this.setState(() => ({payable: !this.state.payable}))} className={`btn ${this.state.payable?'btn-success':'btn-danger'}`}>จ่ายชดเชย</button>
            <div className="col-2">
              <input onChange={this.onDateChange} id="startDate" type="date" placeholder='เริ่มวันที่' />
            </div>
            <div className="col-2">
              <input value={this.state.days} onChange={this.onDaysChange} type="text" placeholder='จำนวนวัน' />
            </div>
            <div className="col-3">
              <input value={this.state.remark} onChange={this.onRemarkChange} type="text" placeholder="หมายเหตุ" />
            </div>
            <div className="col-2">
              <button onClick={this.submitLeave} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }

        <div className="row">
          <div className="col-12">
            <h4>ประวัติการลา</h4>
          </div>
          <div className="col-12">
            <table className="table table-border table-dark">
              <thead>
                <tr>
                  <th>ประเภท</th>
                  <th>เริ่มวันที่</th>
                <th>จำนวนวันที่ลา</th>
                  <th>หมายเหตุ</th>
                <th>บันทึกโดย</th>
              <th>วันที่บันทึก</th>
                </tr>
              </thead>
              <tbody>
                { this.state.leaveList.length !== 0 ?
                  this.state.leaveList.map(x => (
                    <tr>
                      <td>{x.type}</td>
                    <td>{moment(x.startDate).format('DD/MM/YYYY')}</td>
                  <td>{x.days}</td>
                      <td>{x.remark}</td>
                    <td>{x.createBy}</td>
                  <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                    </tr>
                  ))
                :
                <tr>
                  <td colSpan="4">ไม่พบข้อมูล</td>
                </tr>
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

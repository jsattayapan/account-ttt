import React from 'react'
import Select from 'react-select';
import validator from 'validator';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getEmployeeList, activateEmployee, updateEmployeeImage,
  submitEditSalary, getSalaryByEmployeeId, getDepartments, submitNewEmployee } from './tunnel'
import { IP } from './../../constanst'
import { faCircle, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile from './staff-profile'

export class StaffList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      employeeList: [],
      showProfile: false,
      deptList: [],
      data: [],
      searchText: '',
      selectedDepartment: 'ทุกแผนก',
      emp: '',
      showInactive: false,
      showAddNewEmployee: false
    }
  }

  reloadPage = () => {
    this.setState(() => ({
      showAddNewEmployee: false
    }))
    this.componentDidMount()
  }

  componentDidMount(){
    getDepartments(res => {
      if(res.status){
        let deptList = res.departments.map(x => ({ label: x.name, value: x.id }))
        deptList.unshift({value: 'ทุกแผนก', label: 'ทุกแผนก'})
        this.setState(() => ({
          deptList
        }))
      }
    })
    getEmployeeList(res => {
      if(res.status){
        this.setState(() => ({
          employeeList: res.list,
          data: res.list
        }))
        console.log(res.list.length);
      }else{
        alert(res.msg)
      }
    })
  }

  updateEmployeeList = () => {
    getEmployeeList(res => {
      if(res.status){
        this.setState(() => ({
          employeeList: res.list,
          data: res.list
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  departmentOnChange = e => {
    if(e.value === 'ทุกแผนก'){
      this.setState(() => ({
        employeeList: this.state.data,
        searchText: ''
      }))
    }else{
      this.setState(() => ({
        employeeList: this.state.data.filter(x => x.departmentId === e.value),
        searchText: ''
      }))
    }
  }
  searchTextOnChange = (e) => {
    let value = e.target.value;
    this.setState(() => ({
      searchText: value,
      employeeList: this.state.data.filter(x => (x.name.includes(value)||x.id.includes(value))),
    }))
  }

  empOnClik = x => {
    this.setState(() => ({
      showProfile: true,
      emp: x
    }))
  }

  backBtn = () => {
    this.setState(() => ({
      showProfile: false,
      emp: ''
    }))
  }

  includeInactive = (e) => {
    const active = e.target.checked
    this.setState(() => ({
      showInactive: active
    }))
  }

  toggleAddNewEmployee = () => {
    this.setState(() => ({
      showAddNewEmployee: !this.state.showAddNewEmployee
    }))
  }

  render(){
    console.log(this.state.employeeList);
    return (
      <div className="row">
        <div className="col-12">
        { !this.state.showProfile && <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-md-4 text-center">
                  <div className="form-check">
                    <input onChange={this.includeInactive} type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" for="exampleCheck1">แสดงรายชื่อผู้ที่พักงาน</label>
                  </div>
                </div>
                <div className="col-12 col-md-2 text-center">
                  <input type="text" placeholder="ค้นหา" onChange={this.searchTextOnChange} value={this.state.searchText} />
                </div>
                <div className="col-12 col-md-2 text-center">
                  <Select options={this.state.deptList} selected={this.state.selectedDepartment} onChange={this.departmentOnChange} />
                </div>
                <div className="col-12 col-md-2">
                  <button onClick={this.toggleAddNewEmployee} className="btn btn-link text-center">+ พนักงานใหม่</button>
                </div>
              </div>
            </div>
            { this.state.showAddNewEmployee && <AddNewEmployee reloadPage={this.reloadPage} />}
            <div className="col-12">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th></th>
                    <th>ชื่อ</th>
                    <th>Active</th>
                    <th>ตำแหน่ง</th>
                  <th>เลขบัญชี</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.employeeList.length !== 0 ?
                    this.state.showInactive ?
                    this.state.employeeList.map(x => (
                      <tr className="tr-hover" onClick={() => this.empOnClik(x)}>
                        <td>{x.id}</td>
                        <th>{x.imageUrl ? <img src={IP + '/public/employee/' + x.imageUrl} className="personIcon" alt="Smiley face" height="50" width="50" /> : <img src={IP + '/public/employee/person.png'} className="personIcon" alt="Smiley face" height="50" width="50" />}</th>
                        <td>{x.name}</td>
                        <td>{x.active ? <FontAwesomeIcon color='#3ac952' icon={faCircle} size="1x" /> : <FontAwesomeIcon color='#ff0000' icon={faCircle} size="1x" />}</td>
                        <td>
                          <div className="row">
                            <div className="col-12"><b>{x.departmentName}</b></div>
                          </div>
                          <div className="row">
                            <div className="col-12">{x.role}</div>
                          </div>
                        </td>
                        {
                          x.fingerprints.length !== 0 ?
                          <td>
                            {
                              x.fingerprints.map(y => (
                                <p>ID: {y.fingerId}<br />Location: {y.fingerScanId === 1 ? 'Avatara' : 'Samed Pavilion'}</p>
                              ))
                            }

                          </td>

                          :
                          <td>
                            <p>ไม่พบข้อมูล</p>
                          </td>
                        }
                      </tr>
                    )):
                    this.state.employeeList.filter(x => x.active).map(x => (
                      <tr className="tr-hover" onClick={() => this.empOnClik(x)}>
                        <td>{x.id}</td>
                        <th>{x.imageUrl ? <img src={IP + '/public/employee/' + x.imageUrl} className="personIcon" alt="Smiley face" height="50" width="50" /> : <img src={IP + '/public/employee/person.png'} className="personIcon" alt="Smiley face" height="50" width="50" />}</th>
                        <td>{x.name}</td>
                        <td>{x.active ? <FontAwesomeIcon color='#3ac952' icon={faCircle} size="1x" /> : <FontAwesomeIcon color='#ff0000' icon={faCircle} size="1x" />}</td>
                        <td>
                          <div className="row">
                            <div className="col-12"><b>{x.departmentName}</b></div>
                          </div>
                          <div className="row">
                            <div className="col-12">{x.role}</div>
                          </div>
                        </td>
                          <td>
                            {
                              x.bankAccount
                            }
                          </td>
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
          </div>}
        </div>
        { this.state.showProfile && <Profile
          updateEmployeeList={this.updateEmployeeList}
          employee={this.state.emp}
          backBtn={this.backBtn} user={this.props.user} />}

      </div>
    )
  }
}


class AddNewEmployee extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      employerAccount: '',
      name: '',
      nationality: '',
      phone: '',
      address: ''
    }
  }

  onTextChange = e => {
    const value = e.target.value
    const name = e.target.name
    this.setState(() => ({
      [name]: value
    }))
  }

  onSelectChange = e => {
    const value = e.value
    this.setState(() => ({
      nationality: value
    }))
  }


  employerOnSelectChange = e => {
    const value = e.value
    this.setState(() => ({
      employerAccount: value
    }))
  }

  submit = () => {
    const {employerAccount, name, nationality, phone, address} = this.state


    if(name.trim() === ''){
      alert('กรุณากรอก ชื่อจริง ให้ถูกต้อง')
      return
    }

    if(nationality.trim() === ''){
      alert('กรุณาเลือกสัญชาติ')
      return
    }

    if(phone.trim() === ''){
      alert('กรุณากรอก หมายเลขโทรศัพท์ ให้ถูกต้อง')
      return
    }

    if(address.trim() === ''){
      alert('กรุณากรอก ที่อยู่ ให้ถูกต้อง')
      return
    }

    submitNewEmployee({
      employerAccount, name, nationality, phone, address
    }, res => {
      if(res.status){
        this.props.reloadPage()
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    const nationalities = [
      {label:'ไทย', value: 'ไทย'},
      {label:'ลาว', value: 'ลาว'},
      {label:'กัมบูชา', value: 'กัมบูชา'},
      {label:'พม่า', value: 'พม่า'},
    ]
    const employerList = [
      {label:'Avatara', value: 'AV'},
      {label:'Pavilion', value: 'PV'},
      {label:'ฝึกงาน', value: 'TN'}
    ]
    return(
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-md-3">
            <div className="form-group">
              <label>หน่วยงาน:</label>
              <Select onChange={this.employerOnSelectChange} options={employerList} />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="form-group">
              <label>ชื่อ:</label>
              <input onChange={this.onTextChange} name="name" value={this.state.name} type="text" className="form-control" />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="form-group">
              <label>สัญชาติ:</label>
              <Select onChange={this.onSelectChange} options={nationalities} />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="form-group">
              <label>เบอร์โทรศัพท์:</label>
              <input onChange={this.onTextChange} name="phone" value={this.state.phone} type="text" className="form-control" />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="form-group">
              <label>ที่อยู่:</label>
              <input onChange={this.onTextChange} name="address" value={this.state.address} type="text" className="form-control" />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <button onClick={this.submit} className="btn btn-success">บันทึก</button>
          </div>
        </div>
      </div>
    )
  }
}

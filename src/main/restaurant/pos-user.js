import React from 'react'
import Select from 'react-select'
import validator from 'validator'

import { sumitNewPosUser, getPosUser } from './tunnel'

export default class PosUser extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      staffList: [],
      showAddUser: false,
      loginNo: '',
      passcode: '',
      short_name: '',
      name: '',
      position: ''
    }
  }
  componentDidMount(){
    getPosUser(res => {
      if(res.status){
        this.setState(() => ({
          staffList: res.staffList.sort((a, b) => a.loginNo > b.loginNo ? 1 : -1)
        }))
      }else{
        alert(res.msg)
      }
    })
  }
  toggleAddUser = () => {
    this.setState(() => ({
      showAddUser: !this.state.showAddUser,
      loginNo: '',
      passcode: '',
      short_name: '',
      name: '',
      position: ''
    }))
  }
  numberOnChange = (e) => {
    const value = e.target.value
    const name = e.target.name
    if(validator.isInt(value) || value.trim() === ''){
      this.setState(() => ({
        [name]: value
      }))
    }
  }
  textOnChange = e => {
    const value = e.target.value
    const name = e.target.name
    this.setState(() => ({
      [name]: value
    }))
  }
  positionOnChange = e => {
    const value = e.value
    this.setState(() => ({
      position: value
    }))
  }
  submit = () => {
    const {short_name, name, passcode, loginNo, position} = this.state
    if(short_name.trim() === ''){
      alert('กรุณาใส่ชื่อเล่น')
      return
    }
    if(name.trim() === ''){
      alert('กรุณาใส่ชื่อจริง')
      return
    }
    if(passcode.trim() === ''){
      alert('กรุณาใส่ Passcode')
      return
    }
    if(loginNo.trim() === ''){
      alert('กรุณาใส่ Login Number')
      return
    }
    if(position.trim() === ''){
      alert('กรุณาเลือกตำแหน่ง')
      return
    }

    sumitNewPosUser({
      short_name,
      name,
      loginNo,
      passcode,
      position
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          showAddUser: false,
          loginNo: '',
          passcode: '',
          short_name: '',
          name: '',
          position: ''
        }))
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })

  }
  render(){
    const position = [
      {label: 'Cashier', value: 'fbch'},
      {label: 'Waiter', value: 'fbwt'},
      {label: 'ครัว Checker', value: 'ktck'}
    ]
    return(
      <div className="row" >
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <button onClick={this.toggleAddUser} className="btn btn-link">+ เพิ่ม User ใหม่</button>
            </div>
          </div>
          {
            this.state.showAddUser &&
            <div className="row">
              <div className="col-12 col-md-3">
                <div className="form-group">
                  <label>Login Number</label>
                  <input value={this.state.loginNo} name="loginNo" onChange={this.numberOnChange} type="text" className="form-control" />
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="form-group">
                  <label>Passcode</label>
                  <input value={this.state.passcode} name="passcode" onChange={this.numberOnChange} type="password" className="form-control" />
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="form-group">
                  <label>ชื่อจริง</label>
                  <input value={this.state.name} name="name" onChange={this.textOnChange} type="text" className="form-control" />
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="form-group">
                  <label>ชื่อเล่น</label>
                  <input value={this.state.short_name} name="short_name" onChange={this.textOnChange} type="text" className="form-control" />
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="form-group">
                  <label>asdf</label>
                  <Select onChange={this.positionOnChange} className="form-control" options={position} />
                </div>
              </div>
              <div className="col-12 col-md-3">
                <button onClick={this.submit} className="btn btn-success">บันทึก</button>
              </div>
            </div>
          }
          <div className="row">
            <div className="col-12">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Login Number</th>
                    <th>ชื่อจริง</th>
                    <th>ชื่อเล่น</th>
                    <th>ตำแหน่ง</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.staffList.map(x => (
                      <tr>
                        <td>{x.loginNo}</td>
                        <td>{x.name}</td>
                        <td>{x.short_name}</td>
                        <td>{x.position}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

import React from 'react'
import { getVehicleList, createNewVehicleTunnel, updateVehicleRegister, getRegisterByVehicleId } from './tunnel'
import Select from 'react-select'
import { IP } from './../../constanst'

export class Vehicle extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      page: 'main',
      vehicleList: [],
      selectedVehicle: '',
    }
  }

  toMainPage = () => {
    this.setState(() => ({
      page: 'main',
      selectedVehicle: ''
    }))
    this.componentDidMount()
  }

  componentDidMount(){
    getVehicleList(res => {
      console.log(res);
      if(res.status){
        this.setState(() => ({
          vehicleList: res.vehicleList
        }))
      }
    })
  }

  openVehicleProfile = vehicle => {
    this.setState(() => ({selectedVehicle: vehicle, page: 'vehicleProfile'}))
  }

  render(){
    return (
      <div className="row">
        {
          this.state.page === 'main' &&
          <div className="col-12">
            <div className="row">
              <div className="col-12 mb-2">
                <button onClick={() => this.setState(() => ({page: 'newVehiclePage'}))} className="btn btn-success">+ เพิ่มยานพาหนะ</button>
              </div>
              <div className="col-12">
                <div className="row">
                  {
                    this.state.vehicleList.map(x =>
                      <VehicleCard x={x} openVehicleProfile={this.openVehicleProfile} />
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        }

        {
          this.state.page === 'newVehiclePage' && <CreateVehicleForm toMainPage={this.toMainPage} />
        }
        {
          this.state.page === 'vehicleProfile' && <VehicleProfile exist={this.toMainPage} vehicle={this.state.selectedVehicle} />
        }
      </div>
    )
  }
}

class VehicleProfile extends React.Component {
  constructor(props){
    super(props)
    const { vehicle } = this.props
    this.state = {
      vehicle,
      insuranceList: [],
      registerList: []
    }
  }

  componentDidMount() {
    getRegisterByVehicleId({vehicleId: this.props.vehicle.id}, res => {
      if(res.status) {
        this.setState(() => ({
          registerList: res.registerList
        }))
      }
    })
  }

  reloadPage = () => {
    this.componentDidMount()
  }

  render(){
    const { vehicle } = this.state
    return (
      <div className="col-12">
        <div className="row">
          <div className="col-12">
            <button
              className="btn btn-danger"
              onClick={this.props.exist}
              >กลับ</button>
          </div>
          <div className="col-12 col-md-4">
            <img src={IP + '/public/storageVehicleImage/' + vehicle.imageUrl} className='img-thumbnail' />
          </div>
          <div className="col-12 col-md-8">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>ทะเบียน</td>
                  <th>{vehicle.id}</th>
                </tr>
                <tr>
                  <td>ชื่อ</td>
                  <td>{vehicle.name}</td>
                </tr>
                <tr>
                  <td>ประเภท</td>
                  <td>{vehicle.type}</td>
                </tr>
                <tr>
                  <td>YEAR</td>
                  <td>{vehicle.dateOfOwn.substring(6)}</td>
                </tr>
                <tr>
                  <td>พรบ</td>
                  <td>
                    <EditVehicleRegister vehicleId={vehicle.id} reloadPage={this.reloadPage} registerList={this.state.registerList} />
                  </td>
                </tr>
                <tr>
                </tr>
                <td>ประกัน</td>
                <td>
                  <EditVehicleInsurance vehicleId={vehicle.id} reloadPage={this.reloadPage} insuranceList={this.state.insuranceList} />
                </td>
              </tbody>
            </table>
            <div className="row">
              <div className="col-6">
                <button className="btn btn-success">จ่าย พรบ</button>
              </div>
              <div className="col-6">
                <button className="btn btn-success">เพิ่มประกัน</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

class EditVehicleInsurance extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showEditor: false,
      expireDate: new Date(),
      value: 0,
      company:'',
      detail: '',
    }
  }

  saveBtn = () => {
    let { expireDate, value, company, detail } = this.state
    if(isNaN(parseFloat(value))){
      alert('กรุณาใส่ราคาให้ถูกต้อง')
      return
    }
    updateVehicleRegister({
      vehicleId: this.props.vehicleId,
      expireDate: this.state.expireDate,
      value: this.state.value
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          showEditor: false,
          expireDate: new Date(),
          value: 0
        }))
        this.props.reloadPage()
      }else{
        alert(res.msg)
      }
    })
  }

  textOnChange = e => {
    const { value, name } = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  saveBtn = () => {
    console.log(this.state);
  }

  render(){
    return (
      <div className="row">

        {
          this.state.showEditor ?
          <div className="col-12">
            <label className="label-control">บริษัท</label>
            <input onChange={this.textOnChange} name="company" type="text" className="form-control" />
              <label className="label-control">ประเภทประกันและรายละเอียด</label>
              <input onChange={this.textOnChange} name="detail" type="text" className="form-control" />
            <label className="label-control">วันหมดอายุ</label>
            <input onChange={this.textOnChange} name="expireDate" type="date" className="form-control" />
            <label className="label-control">จำนวนเงิน</label>
            <input onChange={this.textOnChange} name="value"  type="text" className="form-control" />
              <button onClick={this.saveBtn} className="btn btn-success">บันทึก</button>
          </div>
          :
          <div className="col-12">
            <button
              onClick={() => this.setState(() => ({showEditor: true}))}
              className="btn btn-success">เพิ่มประกัน</button>
          </div>
        }
      </div>
    )
  }
}

class EditVehicleRegister extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showEditor: false,
      expireDate: new Date(),
      value: 0
    }
  }

  saveBtn = () => {
    let { expireDate, value } = this.state
    if(isNaN(parseFloat(value))){
      alert('กรุณาใส่ราคาให้ถูกต้อง')
      return
    }
    updateVehicleRegister({
      vehicleId: this.props.vehicleId,
      expireDate: this.state.expireDate,
      value: this.state.value
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          showEditor: false,
          expireDate: new Date(),
          value: 0
        }))
        this.props.reloadPage()
      }else{
        alert(res.msg)
      }
    })
  }

  textOnChange = e => {
    const { value, name } = e.target
    this.setState(() => ({
      [name]: value
    }))
  }


  render() {
    const { registerList } = this.props
    return (
      <div className="row">

        {
          this.state.showEditor ?
          <div className="col-12">
            <label className="label-control">วันหมดอายุ</label>
          <input onChange={this.textOnChange} name="expireDate" type="date" className="form-control" />
          <label className="label-control">จำนวนเงิน</label>
        <input onChange={this.textOnChange} name="value"  type="text" className="form-control" />
          <p>จำนวนเงิน</p>
        <button onClick={this.saveBtn} className="btn btn-success">บันทึก</button>
          </div>
          :
          <div className="col-12">
            {
              registerList.length !== 0 ?
              <div>
                <p>มูลค่า: {registerList[0].value}</p>
                <p>หมดอายุ: {registerList[0].expireDate}</p>
              </div>
              :'-'
            }
          <button
            onClick={() => this.setState(() => ({showEditor: true}))}
            className="btn btn-success">จ่าย พรบ</button>
          </div>

        }

      </div>
    )
  }
}

const VehicleCard = props => {
  const { x, openVehicleProfile } = props
  return(
    <div className="col-12 col-md-3">
      <div className="card">
        <img className="card-img-top" src={IP + '/public/storageVehicleImage/' + x.imageUrl} alt="Card image cap" />
        <div className="card-body">
          <h6 className="card-title">{x.id}</h6>
          <p className="card-title">{x.name}</p>
          <p className="text-muted">{x.type}</p>
          <p className="card-title">{x.dateOfOwn}</p>
          <button className="btn btn-info" onClick={() => openVehicleProfile(x)}>ดูข้อมูล</button>
        </div>
      </div>
    </div>
  )
}

class CreateVehicleForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      id: '',
      type: '',
      name: '',
      value: '',
      dateOfOwn: new Date(),
      imageFile: null
    }
  }

  imageFileOnChange = (e) => {
    const imageFile = e.target.files[0]
    this.setState(() => ({
      imageFile
    }))
  }

  textOnChange = (e) => {
    const {value, name} = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  vehicleOptionsOnChange = (e) => {
    this.setState(() => ({
      type: e.value
    }))
  }

  createNewVehicle = () => {
    const { id, type, name, value, dateOfOwn, imageFile } = this.state
    if(id.trim() === ''){
      alert('กรุณาระบุ ทะเบียน')
      return
    }
    if(type.trim() === ''){
      alert('กรุณาระบุ ประเภท')
      return
    }
    if(name.trim() === ''){
      alert('กรุณาระบุ ชื่อ')
      return
    }
    if(imageFile === null){
      alert('กรุณาใส่รูป')
      return
    }
    createNewVehicleTunnel({id, type, name, value, dateOfOwn, imageFile}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.toMainPage()
      }else{
        alert(res.msg)
      }
    })

  }

  render(){
    const vehicleOptions = [
      {value: 'รถกระบะ', label: 'รถกระบะ'},
      {value: 'รถบรรทุก', label: 'รถบรรทุก'},
      {value: 'รถน้ำ', label: 'รถน้ำ'},
      {value: 'มอเตอร์ไซ', label: 'มอเตอร์ไซ'},
      {value: 'ซาเล้ง', label: 'ซาเล้ง'},
      {value: 'เรือบรรทุก', label: 'เรือบรรทุก'},
      {value: 'เรือเร็ว', label: 'เรือเร็ว'},
    ]
    return (
      <div className="col-12">
        <div style={{width: '80%', margin: '0 auto'}} className="row">
          <div className="col-4">
            <div className="form-outline mb-4">
              <label className="form-label">ทะเบียน</label>
              <input type="text" onChange={this.textOnChange} value={this.state.id} name="id" className="form-control" />
            </div>
          </div>
          <div className="col-4">
            <div className="form-outline mb-4">
              <label className="form-label">ประเภท</label>
              <Select onChange={this.vehicleOptionsOnChange} options={vehicleOptions} />
            </div>
          </div>
          <div className="col-4">
            <div className="form-outline mb-4">
              <label className="form-label">มูลค่า (บาท)</label>
              <input type="text" onChange={this.textOnChange} value={this.state.value} name="value"  className="form-control" />
            </div>
          </div>
          <div className="col-8">
            <div className="form-outline mb-4">
              <label className="form-label">ชื่อ/รุ่น</label>
              <input type="text" onChange={this.textOnChange} value={this.state.name} name="name"  className="form-control" />
            </div>
          </div>
          <div className="col-4">
            <div className="form-outline mb-4">
              <label className="form-label">วันที่ครอบครอง</label>
              <input type="date" onChange={this.textOnChange} value={this.state.dateOfOwn} name="dateOfOwn" className="form-control" />
            </div>
          </div>
          <div className="col-12">
            <div className="form-outline mb-4">
              <label className="form-label">รูปภาพ</label>
              <input onChange={this.imageFileOnChange} type="file" className="form-control" />
            </div>
          </div>
          <div className="col-4">
            <button onClick={this.createNewVehicle} className="btn btn-success">บันทึก</button>
          </div>
          <div className="col-4">
            <button onClick={this.props.toMainPage} className="btn btn-danger">กลับ</button>
          </div>
        </div>
      </div>
    )
  }
}

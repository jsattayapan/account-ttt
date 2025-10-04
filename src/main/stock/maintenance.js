import React from 'react'
import moment from 'moment'
import Select from 'react-select'
import numeral from 'numeral'

import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getMaintenance, submitMaintenancePayment } from './tunnel'

export default class Maintenance extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      maintenanceList: []
    }
  }

  componentDidMount(){
    getMaintenance(res => {
      if(res.status){
        this.setState(() => ({
          maintenanceList: res.maintenanceList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  reloadMaintenanceList = () => {
    getMaintenance(res => {
      if(res.status){
        this.setState(() => ({
          maintenanceList: res.maintenanceList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return(
      <div>
        <div className="row">

        </div>
        <div className="row">
          <div className="col-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>วันที่</th>
                  <th>สินค้า</th>
                  <th>ร้านค้าที่ส่งซ่อม</th>
                  <th>จ่ายเงินครบ</th>
                  <th>จำนวนเงิน</th>
                  <th>สถาณะของ</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.maintenanceList.map(x =>
                    <MaintenanceTr reloadMaintenanceList={this.reloadMaintenanceList} user={this.props.user} x={x} />
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

class MaintenanceTr extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showPayment: false,
      type: '',
      reference: '',
      imageFile: ''
    }
  }
  onReferenceChange = e => {
    let value = e.target.value
    this.setState(() => ({
      reference: value
    }))
  }
  imageFileOnChange = e => {
    let file = e.target.files[0]
    this.setState(() => ({
      imageFile: file
    }))
  }
  onTrClick = () => {
    if(this.props.x.paymentStatus === 'unpaid'){
      this.setState(() => ({
        showPayment: !this.state.showPayment,
        type:'',
        reference: '',
        imageFile: ''
      }))
    }
  }
  onTypeChange = e => {
    let value = e.value
    this.setState(() => ({
      type: value
    }))
  }
  submitPayment = () => {
    const type = this.state.type
    const imageFile = this.state.imageFile
    const reference = this.state.reference
    if(type === 'โอนเงิน' || type === 'โอนเงินโดย MD'){
      if(imageFile === ''){
        alert('กรุณาอัพโหลดหลักฐานการโอนเงิน')
        return
      }
    }
    if(type === 'บัตรเครดิต'){
      if(reference === ''){
        alert('กรุณาใส่หมายเลขบัตรเครดิต')
        return
      }
    }
    submitMaintenancePayment({
      maintenanceId: this.props.x.id,
      createBy: this.props.user.username,
      price: this.props.x.price,
      type,
      imageFile,
      reference
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          showPayment: false,
          type:'',
          reference: '',
          imageFile: ''
        }))
        this.props.reloadMaintenanceList()
      }
    })
  }
  render(){
    let selectOption = [
      {label: 'เงินสด', value: 'เงินสด'},
      {label: 'โอนเงิน', value: 'โอนเงิน'},
      {label: 'โอนเงินโดย MD', value: 'โอนเงินโดย MD'},
      {label: 'บัตรเครดิต', value: 'บัตรเครดิต'}
    ]
    let x = this.props.x
    let showPayment = this.state.showPayment
    let type = this.state.type
    return(
      <tr className="tr-hover">
        <td>{x.id}</td>
        <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
        <td onClick={this.onTrClick}>{x.item}</td>
        <td>{x.supplier}</td>
        <td align="center">{x.paymentStatus === 'unpaid' ? <FontAwesomeIcon icon={faTimes} color="red" /> : <FontAwesomeIcon icon={faCheck} color="green" />}
          <br /> {showPayment && (type === 'โอนเงิน' || type === 'โอนเงินโดย MD') && <input onChange={this.imageFileOnChange} type="file" />} {showPayment && type === 'บัตรเครดิต' &&
            <input value={this.state.reference} onChange={this.onReferenceChange} type="text" placeholder='หมายเลขบัตรเครดิต' />}
         </td>
        <td>{numeral(x.price).format('0,0.00')} <br /> {showPayment && <Select onChange={this.onTypeChange} options={selectOption} /> }</td>
        <td>{x.status} <br /> {showPayment && <button onClick={this.submitPayment} className="btn btn-success">บันทึก</button>}</td>
      </tr>
    )
  }
}

import React from 'react'
import Select from 'react-select';

import Swal from 'sweetalert2'
import moment from 'moment'
import validator from 'validator'
import { setCurrentDormMeters,
  getDormitoryBillById,
  insertMonthlyBillUsage ,
  createNewDormitoryBill,
  insertMonthlyUtilitiesUsage,
  createNewDormRoom,
  getDorms,
  getNonResidentEmployee,
  assignNewResident,
  resignResident,
  getDormInfoById } from './tunnel'
import { IP } from './../../constanst'

export default class Dormitory extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showAddNewRoom: false
    }
  }
  render(){
    return (
      <div className="row">
        <MainFrame username={this.props.user.username} />
      </div>
    )
  }
}




class MainFrame extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      dormList: [],
      dorm: ''
    }
  }

  openDormInfo = dorm => {
    this.setState(() => ({
      dorm
    }))
  }

  componentDidMount(){
    getDorms(res => {
      if(res.status){
        this.setState(() => ({
          dormList: res.dormList
        }))
      }
    })
  }

  refresh = () => {
    this.componentDidMount()
  }

  render(){
    return (
      <div className="col-12">
        {
          this.state.dorm === '' ?
          <div className="row">
            <AddNewDorm refresh={this.refresh} />
            <DormList openDormInfo={this.openDormInfo} dormList={this.state.dormList} />
          </div>
          :
          <DormInfo username={this.props.username} refresh={this.refresh} dorm={this.state.dorm} back={() => this.setState(() => ({dorm: ''}))} />
        }
      </div>
    )
  }
}

class DormInfo extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      subPage: 'ew',
      nonResidentEmployeeList: [],
      departmentList: [],
      dormInfo: {
        id: this.props.dorm.id,
        roomNumber: '',
        building: '',
        resident: [],
        logs: [],
        usage: [],
        bill: []
      }
    }
  }

  componentDidMount(){
    let id = this.state.dormInfo.id
    this.getPageInfo(id)
  }

  getPageInfo = (id) => {
    getDormInfoById({dormId: id}, res => {
      if(res.status){
        this.setState(() => ({
          dormInfo: res.dormInfo
        }))
      }
    })
    getNonResidentEmployee(res => {
      if(res.status){
        this.setState(() => ({
          nonResidentEmployeeList: res.employeeList,
          departmentList: res.departmentList
        }))
      }
    })
  }

  setSubPage = (page) => {
    this.setState(() => ({
      subPage: page
    }))
  }

  assignNewResident = () => {
    let refresh = this.getPageInfo
    let dormListRefresh = this.props.refresh
    // let inputOptions = this.state.nonResidentEmployeeList.reduce((result, emp) => {
    //   result[emp.id] = `${emp.id} - ${emp.name}`
    //   return result
    // }, {})

    let inputOptions = this.state.departmentList.reduce((result, dept) => {
      result[dept.name] = this.state.nonResidentEmployeeList
      .filter(x => x.departmentId === dept.id)
      .reduce((empResult, emp) => {
        empResult[emp.id] = `${emp.id} - ${emp.name}`
        return empResult
      }, {})
      return result
    }, {})

    Swal.fire({
  title: 'เลือกพนักงาน',
  input: 'select',
  inputOptions,
  inputPlaceholder: 'required',
  showCancelButton: true,
  inputValidator: function (value) {
    return new Promise(function (resolve, reject) {
      if (value !== '') {
        resolve();
      } else {
        resolve('กรุณาเลือกพนักงาน');
      }
    });
  }
}).then(result => {
  if(result.isConfirmed){
    assignNewResident({dormId: this.props.dorm.id, employeeId: result.value}, res => {
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'ข้อมูลถูกบันทึก'
        })
        refresh(this.props.dorm.id)
        dormListRefresh()
      }else{
        Swal.fire({
          icon: 'error',
          title: res.msg
        })
      }
    })
  }
})
  }

  resignResident = async (employeeId, employeeName) => {
    let refresh = this.getPageInfo
    let dormListRefresh = this.props.refresh
    Swal.fire({
      title: 'ยืนยันการย้ายออก',
      icon: 'info',
      html: `คุณต้องการย้าย <b>${employeeName}</b> ออกจากห้องพักนี้
  `,
  showCancelButton: true,
  confirmButtonText: 'ยืนยัน'
  }).then(result => {
    if(result.isConfirmed){
      resignResident({dormId: this.props.dorm.id, employeeId}, res => {
        if(res.status){
          Swal.fire({
            icon: 'success',
            title: 'ข้อมูลถูกบันทึก'
          })
          refresh(this.props.dorm.id)
          dormListRefresh()
        }else{
          Swal.fire({
            icon: 'error',
            title: res.msg
          })
        }
      })
    }
  })
  }


  addNewBill = async () => {


    // let response = await Swal.fire({
    //   title: 'test',
    //   html : '<input id="test-1" type="text" /> <input id="test-2" type="text" />',
    //   preConfirm: () => new Promise((resolve, reject) => {
    //     let test1 = document.getElementById('test-1').value
    //     let test2 = document.getElementById('test-2').value
    //     Swal.showValidationMessage("Enter a value in both fields");
    //     swal.enableConfirmButton();
    //   })
    // })
    //
    // console.log(response);

    let refresh = this.getPageInfo
    let dormId = this.props.dorm.id
    let billName = ''
    let employeeId = ''
    let currentMeter = 0
    let billNameResponse = await Swal.fire({
      'title': 'ชื่อรายการ',
      'input': 'text',
      inputPlaceholder: 'required',
      showCancelButton: true,
      inputValidator: (value) => new Promise((resolve, reject) => {
        if(value === ''){
          resolve('กรุณาใส่ชื่อรายการ')
        }else{
          resolve()
        }
      })
    })

    if(billNameResponse.isConfirmed){
      billName = billNameResponse.value
      let inputOptions = {}
      for(const emp of this.props.dorm.resident){
        inputOptions[emp.id] = `[${emp.id}] ${emp.name}`
      }

      let userResponse = await Swal.fire({
        title: 'เลือกผู้ใช้รายการ',
        html: `<h4>รายการ: ${billNameResponse.value}</h4>`,
        input: 'select',
        inputOptions,
        inputPlaceholder: 'required',
        showCancelButton: true,
        inputValidator: function (value) {
          return new Promise(function (resolve, reject) {
            if (value !== '') {
              resolve();
            } else {
              resolve('เลือกผู้ใช้รายการ');
            }
          });
        }
      })

      if(userResponse.isConfirmed){
        employeeId = userResponse.value
        let currentMeterResponse = await Swal.fire({
          title: 'ใส่เลขมิเตอร์ปัจจุบัน',
          input: 'text',
          inputPlaceholder: 'required',
          showCancelButton: true,
          inputValidator: function (value) {
            return new Promise(function (resolve, reject) {
              if (validator.isNumeric(value)) {
                resolve();
              } else {
                resolve('ใส่ตัวเลขให้ถูกต้อง');
              }
            });
          }
        })

        if(currentMeterResponse.isConfirmed){
          currentMeter = currentMeterResponse.value
          createNewDormitoryBill({dormId, employeeId, currentMeter,billName}, res => {
            if(res.status){
              Swal.fire({
                icon: 'success',
                title: 'ข้อมูลถูกบันทึก!'
              })
              refresh(dormId)
            }else{
              Swal.fire({
                icon: 'error',
                title: res.msg
              })
            }
          })
        }

      }

    }
  }


  openBillInfo = async bill => {
    getDormitoryBillById({billId: bill.id}, async res => {
      if(res.status){
        let addNewUsage = await Swal.fire({
          title: `ข้อมูล: ${bill.billName}`,
          text: '',
          html: `
          <table class="table table-bordered">
            <thead>
              <tr >
                <th colSpan='3'>Meter ปัจจุบัน: ${bill.currentMeter} </th>
              </tr>
              <tr>
                <th>เดือน/ปี</th>
                <th>Meter ที่ใช้</th>
                <th>ยอดเงิน</th>
              </tr>
            </thead>
            <tbody>
              ${
                res.usage.map(x =>
                  `
                  <tr>
                    <td>${x.monthYear}</td>
                  <td>${x.meter}</td>
                <td>${x.cost}</td>
                  </tr>
                  `)
              }
            </tbody>
          </table>
          `
        ,
        showCancelButton: true,
        confirmButtonText: 'บันทึกมิเตอร์เพิ่ม +',
        cancelButtonText: 'ปิด'
      })

      if(addNewUsage.isConfirmed){
        let inputOptions = {}
        for(let x = 0; x < 5; x++){
          let monthYear = moment().subtract(x, 'months').format('MM/YYYY')
          inputOptions[monthYear] = monthYear
        }
        let monthYear = await Swal.fire({
          title: 'เพิ่มการใช้ ' + bill.billName ,
          text: 'รอบเดือน',
          inputOptions,
          input: 'select',
          showCancelButton: true,
          confirmButtonText: 'ถัดไป',
          cancelButtonText: 'ปิด',
          inputValidator: function (value) {
            return new Promise(function (resolve, reject) {
              if (value !== '') {
                resolve();
              } else {
                resolve('กรุณาเลือกเดือน');
              }
            });
          }
        })

        if(monthYear.isConfirmed){
          let currentMeter = await Swal.fire({
            title: 'เพิ่มการใช้ ' + bill.billName,
            text: 'มิเตอร์ปัจจุบัน',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'บันทึก',
            cancelButtonText: 'ปิด',
            inputValidator: function (value) {
              return new Promise(function (resolve, reject) {
                if (validator.isNumeric(value)) {
                  resolve();
                } else {
                  resolve('กรุณาใส่มิเตอร์');
                }
              });
            }
          })

          if(currentMeter.isConfirmed){
            insertMonthlyBillUsage({
              dormBillId: bill.id,
              meter: parseFloat(currentMeter.value),
              monthYear: monthYear.value,
              username: 'olotem321'
            }, res => {
              if(res.status){
                Swal.fire({
                  icon: 'success',
                  title: 'ข้อมูลถูกบันทึก!'
                })
              }else{
                Swal.fire({
                  icon: 'error',
                  title: res.msg
                })
              }
            })
          }
        }
      }

      }else{
        alert(res.msg)
      }
    })
  }

  setCurrent = async () => {
    let dormId = this.props.dorm.id
    let response = await Swal.fire({
      title: 'Set Current',
      html : `<label>Eletric: </label><input id="electricMeter" type="text" />
    <br/>
  <label>Water: </label><input id="waterMeter" type="text" />`,
      preConfirm: () => new Promise((resolve, reject) => {
        let electricMeter = document.getElementById('electricMeter').value
        let waterMeter = document.getElementById('waterMeter').value
        if(validator.isNumeric(electricMeter) && validator.isNumeric(waterMeter)){
          resolve([electricMeter, waterMeter])
        }else{
          Swal.showValidationMessage("กรุณาใส่ตัวเลขให้ถูกต้อง");
          Swal.getConfirmButton().removeAttribute('disabled')
        }
      })
    })

    if(response.isConfirmed){
      let { value } = response
      setCurrentDormMeters({dormId, electricMeter: parseFloat(value[0]), waterMeter: parseFloat(value[1])}, res => {
        if(res.status){
          Swal.fire({
            icon: 'success',
            title: 'ข้อมูลถูกบันทึก!'
          })
          this.getPageInfo(dormId)
        }else{
          Swal.fire({
            icon: 'error',
            title: res.msg
          })
        }
      })
    }
    console.log(response);
  }

  render(){
    return (
      <div className="row">
        <div className="col-5 my-3">
          <button onClick={this.props.back} className="btn btn-danger">
            กลับ
          </button>
        </div>
        <div className="col-8">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>ID</th>
                <td align="left">{this.state.dormInfo.id}</td>
              </tr>
              <tr>
                <th>Room#</th>
                <td align="left">{this.state.dormInfo.roomNumber}</td>
              </tr>
              <tr>
                <th>Building</th>
                <td align="left">{this.state.dormInfo.building}</td>
              </tr>
              <tr>
                <th>มิเตอร์ปัจจุบัน#</th>
                <td align="left">ไฟฟ้า: {this.state.dormInfo.current_electric} <br /> น้ำ: {this.state.dormInfo.current_water}</td>
              </tr>
              <tr>
                <th>Resident</th>
                <td align="left">{this.state.dormInfo.resident.map(x => (
                    <div className="row mt-2 text-left">
                      <div className="col-2">
                        <img style={{verticalAlign: 'middle', width: '50px', height: '50px', borderRadius: '50%'}} src={IP + '/public/employee/' + `${x.imageUrl !== null ? x.imageUrl : 'person.png'}`} />
                      </div>
                      <div className="col-8">
                        {x.id} - {x.name}
                      </div>
                      <div className="col-2">
                        <button onClick={() => this.resignResident(x.id, x.name)} className="btn btn-danger">ย้ายออก</button>
                      </div>
                    </div>
                  ))}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-4">
          <div className="row">
            <button onClick={this.assignNewResident} className="btn btn-success btn-block">เพิ่มผู้อาศัย</button>
          </div>
          <div className="row mt-3">
            <button onClick={() => this.setSubPage('ew')} className="btn btn-info btn-block">Meter น้ำ/ไฟ</button>
          </div>
          <div className="row mt-3">
            <button onClick={() => this.setSubPage('logs')} className="btn btn-warning btn-block">Dorm Logs</button>
          </div>
        </div>
        {
          this.state.subPage === 'ew' &&
          <div className="col-6 text-left my-3">
            <div className="row">
              <div className="col-4">
                <AddNewUtilitiesUsage username={this.props.username} dormListRefresh={this.props.refresh} refresh={() => this.getPageInfo(this.state.dormInfo.id)} dormId={this.state.dormInfo.id} building={this.state.dormInfo.building} />
              </div>
              <div className="col-4">
                <button onClick={this.addNewBill} className="btn btn-info text-white">เพิ่ม Bill</button>
              </div>
              {this.props.username === 'olotem321' ? <div className="col-4">
                <button onClick={this.setCurrent} className="btn btn-warning ">Set Current</button>
              </div> : <div></div>}
            </div>
          </div>
        }
        {
          this.state.subPage === 'ew' &&
          <div className="col-12">
            <div className="d-flex flex-row">
              {
                this.state.dormInfo.bill.map(x => {
                  let employee = this.state.dormInfo.resident.filter(y => y.id === x.employeeId)
                  let employeeName = employee.length !== 0 ? employee[0].name : '-'
                  console.log(this.state.dormInfo.resident);
                 return (
                  <div className="p-2">
                    <div className="card bg-light mb-3" style={{maxWidth: '200px'}}>
                      <div className="card-header">{x.billName}</div>
                      <div className="card-body">
                        <b>{employeeName}</b>
                        <button onClick={() => this.openBillInfo(x)} className="btn btn-success">ดูข้อมูล</button>
                      </div>
                    </div>
                  </div>
                )})
              }
            </div>
            <div className="row">
              <div className="col-12">
                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th>รายเดือน</th>
                      <th>มิเตอร์น้ำ</th>
                      <th>ค่าน้ำ</th>
                      <th>มิเตอร์ไฟ</th>
                      <th>ค่าไฟ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dormInfo.usage.map(x => (
                      <tr>
                        <td>{x.monthYear}</td>
                        <td>{x.waterMeter}</td>
                        <td>{x.costWater}</td>
                        <td>{x.electricMeter}</td>
                        <td>{x.costElectric}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
        {
          this.state.subPage === 'logs' &&
          <div className="col-12">
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th style={{width: '200px'}}>วันที่</th>
                  <th>รายการ</th>
                </tr>
              </thead>
              <tbody>
                {this.state.dormInfo.logs.map(x => (
                  <tr>
                    <td>{moment(x.createAt).format('DD/MM/YYYY')}</td>
                    <td>{x.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }
}


class AddNewUtilitiesUsage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isOpen: false
    }
  }

  openAddOnClick = (isOpen) => {

    const refresh = this.props.refresh
    const dormListRefresh = this.props.dormListRefresh
    let inputOptions = {}
    for(let x = 0; x < 5; x++){
      let monthYear = moment().subtract(x, 'months').format('MM/YYYY')
      inputOptions[monthYear] = monthYear
    }

    let { building } = this.props
    let payload = {dormId: this.props.dormId, username: this.props.username}

    Swal.fire({
      title: 'เลือกเดือน',
      input: 'select',
      inputOptions,
      inputPlaceholder: 'required',
      showCancelButton: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          if (value !== '') {
            resolve();
          } else {
            resolve('กรุณาเลือกเดือน');
          }
        });
      }
    }).then(result => {
      if(result.isConfirmed){
        payload['monthYear'] = result.value
        Swal.fire({
          title: 'Meter ไฟ',
          input: 'text',
          showCancelButton: true,
          confirmButtonText: 'ถัดไป',
          showLoaderOnConfirm: true,
          inputValidator: function (value) {
            return new Promise(function (resolve, reject) {
              if (value !== '') {
                if(validator.isNumeric(value)){
                  resolve();
                }else{
                  resolve('กรุณาใส่มิเตอร์ไฟ ให้ถูกต้อง');
                }
              } else {
                resolve('กรุณาใส่มิเตอร์ไฟ');
              }
            });
          },
          preConfirm: (electricMeter) => {
            payload['electricMeter'] = parseFloat(electricMeter)
            if(building === 'ตึกส้ม' || building === 'เลซี่'){
              Swal.fire({
                title: 'ยืนยันการบันทึกน้ำไฟ',
                icon: 'info',
                html: `Meter ไฟ : <b>${payload.electricMeter}</b> <br />
              Meter น้ำ: คนละ 50 บาท
            `,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน'
          }).then(result => {
                if(result.isConfirmed){
                  payload['waterMeter'] = 'auto'
                  insertMonthlyUtilitiesUsage(payload, res => {
                    if(res.status){
                      Swal.fire({
                        icon: 'success',
                        title: 'ข้อมูลถูกบันทึก!'
                      })
                      refresh()
                      dormListRefresh()
                    }else{
                      Swal.fire({
                        icon: 'error',
                        title: res.msg
                      })
                    }
                  })
                }
              })
            }else{

              Swal.fire({
                title: 'Meter น้ำ',
                input: 'text',
                showCancelButton: true,
                confirmButtonText: 'ถัดไป',
                showLoaderOnConfirm: true,
                inputValidator: function (value) {
                  return new Promise(function (resolve, reject) {
                    if (value !== '') {
                      if(validator.isNumeric(value)){
                        resolve();
                      }else{
                        resolve('กรุณาใส่มิเตอร์น้ำ ให้ถูกต้อง');
                      }
                    } else {
                      resolve('กรุณาใส่มิเตอร์น้ำ');
                    }
                  });
                },
                preConfirm: (waterMeter) => {
                  payload['waterMeter'] = parseFloat(waterMeter)
                  Swal.fire({
                    title: 'ยืนยันการบันทึกน้ำไฟ',
                    icon: 'info',
                    html: `Meter ไฟ : <b>${payload.electricMeter}</b> หน่วย<br />
                  Meter น้ำ:  <b>${payload.waterMeter} หน่วย</b>
                `,
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยัน'
                  }).then(result => {
                        if(result.isConfirmed){
                          insertMonthlyUtilitiesUsage(payload, res => {
                            if(res.status){
                              Swal.fire({
                                icon: 'success',
                                title: 'ข้อมูลถูกบันทึก!'
                              })
                              refresh()
                              dormListRefresh()
                            }else{
                              Swal.fire({
                                icon: 'error',
                                title: res.msg
                              })
                            }
                          })
                        }
                      })
                }
              })

            }
          }
        })
      }
    })
}

  render(){
    return (
      <div className="row">
        <div className="col-12">
        {
          this.state.isOpen ?
          <div className="row">
            <div className="col-12">
              <h4>เพ่ิม Meter น้ำ/ไฟ</h4>
            </div>
            <div>
            </div>
          </div>
          :
          <button onClick={() => this.openAddOnClick(true)} className="btn btn-success">เพิ่มมิเตอร์น้ำ/ไฟ</button>
        }
        </div>
      </div>
    )
  }
}

class DormList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      activePage: 'ตึกขาว-พาวิลเลี่ยน'
    }
  }

  setActivePage = (page) => {
    this.setState(() => ({
      activePage: page
    }))
  }


  render(){
    let dormList = this.props.dormList.reduce((result, dorm) => {
      let foundBuilding = result.filter(res => res.building === dorm.building)
      if(foundBuilding.length !== 0){
        return result
      }else{
        result = [...result, {building: dorm.building, dormList: this.props.dormList.filter(x => x.building === dorm.building)}]
        return result
      }
    }, [])
    console.log(dormList);
    return(
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs">
            {
              dormList.map(building => (
                <li className="nav-item">
                  <a onClick={() => this.setActivePage(building.building)} className={`nav-link ${this.state.activePage === building.building ? 'active' : ''}`} aria-current="page" href="#">{building.building}</a>
                </li>
              ))
            }
          </ul>

        </div>
        <div className="col-12 mt-3">
          <div className="row justify-content-left">
            {
              this.props.dormList.filter(x => x.building === this.state.activePage).map(dorm => (
                <div className={`card ${dorm.resident.length ? 'bg-info': 'bg-light'} mx-2 mb-3`} style={{maxWidth: '250px'}}>
                  <div className="card-header">{dorm.roomNumber}</div>
                  <div className="card-body">
                    <h5 className="card-title">{dorm.resident.map(y => (
                        <img className="" style={{verticalAlign: 'middle', width: '50px', height: '50px', borderRadius: '50%'}} src={IP + '/public/employee/' + `${y.imageUrl !== null ? y.imageUrl : 'person.png'}`} />
                      ))}</h5>
                    <p className="card-text">น้ำ: {dorm.current_water === -1 ? 'คนละ 50 บาท' : dorm.current_water } | ไฟฟ้า: {dorm.current_electric}</p>
                    {
                      dorm.utilitiesUsage.length !== 0 ?
                      dorm.utilitiesUsage[dorm.utilitiesUsage.length - 1].monthYear === moment().format('MM/YYYY') ?
                      <span style={{color: 'green'}}>📅 : {moment(dorm.utilitiesUsage[dorm.utilitiesUsage.length - 1].createAt).format('DD/MM/YYYY')}</span>
                      :
                      <span style={{color: 'red'}}>📅 : {moment(dorm.utilitiesUsage[dorm.utilitiesUsage.length - 1].createAt).format('DD/MM/YYYY')}</span>
                      :
                      '📅 : ไม่มีข้อมูล'
                    }
                  </div>
                  <button onClick={() => this.props.openDormInfo(dorm)} className="btn btn-warning mb-3">ดูข้อมูล</button>
                </div>
              ))
            }
          </div>
          <hr />
        </div>
      </div>
    )
  }
}

class AddNewDorm extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  addNewDorm = () => {
    const refresh = this.props.refresh
    Swal.fire({
  title: 'Select Outage Tier',
  input: 'select',
  inputOptions: {
    'ตึกขาว-เอวา': 'ตึกขาว-เอวา',
    'เลซี่': 'เลซี่',
    'ตึกขาว-พาวิลเลี่ยน': 'ตึกขาว-พาวิลเลี่ยน',
    'ข้างห้องผ้า-พาวิลเลี่ยน': 'ข้างห้องผ้า-พาวิลเลี่ยน',
    'แคมป์-ตึกส้ม': 'แคมป์-ตึกส้ม',
    'ตึกส้ม': 'ตึกส้ม',
    'ตึกชมพู': 'ตึกชมพู'
  },
  inputPlaceholder: 'required',
  showCancelButton: true,
  inputValidator: function (value) {
    return new Promise(function (resolve, reject) {
      if (value !== '') {
        resolve();
      } else {
        resolve('You need to select a Tier');
      }
    });
  }
}).then(function (result) {
  if (result.isConfirmed) {
    Swal.fire({
      title: 'Insert Room#',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Create New Dorm',
      showLoaderOnConfirm: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          if (value !== '') {
            resolve();
          } else {
            resolve('You need to enter room Number');
          }
        });
      },
      preConfirm: (roomNumber) => {
        console.log(result.value+' '+roomNumber);
        const payload = { building: result.value, roomNumber}
        createNewDormRoom(payload, res => {
          if(res.status){
            Swal.fire({
              icon: 'success',
              title: 'Created!'
            })
            refresh()
          }else{
            Swal.fire({
              icon: 'error',
              title: res.msg
            })
          }
        })
      }
    })
  }
});
  }

  render(){
    return (
        <div className="col-4 my-3">
          <button onClick={this.addNewDorm} className="btn btn-success">Add New Dorm</button>
        </div>
    )
  }
}

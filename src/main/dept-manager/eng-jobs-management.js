import React from 'react'
import moment from  'moment'
import numeral from 'numeral'
import Select from 'react-select'
import validator from 'validator'
import ImageResize from 'image-resize';
import Loading from 'react-fullscreen-loading';
import { faToolbox, faCubes, faUserFriends, faCamera, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IP } from './../../constanst'
import { getBuildingsAndProperties,
  getJobs,
  submitNewJob,
  getJobDetailById,
  getEngineerInventory,
  sumbitItemsToEngineerJob,
  updateJobStatus,
  getWorkerOnJob,
  submitAddWorkerToJob,
  submitNewJobWithImages,submitJopReport
} from './tunnel'

import { getEmployeeList } from '../hr/tunnel'

import Modal from 'react-modal';

const getStatusStyle = (status) => {
  if(status === 'กำลังทำ'){
    return {color: '#ffa42d'}
  }
  if(status === 'เสร็จ'){
    return {color: '#02f72b'}
  }
  if(status === 'ยกเลิก'){
    return {color: '#ff7f7f'}
  }
}

export default class EngineerJobsManagement extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showAddNewJob: false,
      jobList: [],
      showJobDetail: false,
      selectedJob: '',
      showAll: false
    }
  }

  openJobDetail = job => {
    this.setState(() => ({
      selectedJob: job
    }))
  }

  backBtn = () => {
    this.setState(() => ({
      selectedJob: ''
    }))
    this.componentDidMount()
  }

  componentDidMount(){
    getJobs(res => {
      if(res.status){
        let jobList = res.jobList.sort((a, b) => b.timestamp - a.timestamp)
        this.setState(() =>({
          jobList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  toggleAddNewJob = () => {
    const showAddNewJob = this.state.showAddNewJob
    this.setState(() => ({
      showAddNewJob: !showAddNewJob
    }))
    this.componentDidMount()
  }

  toggleShowAll = e => {
    this.setState(() => ({
      showAll: !this.state.showAll
    }))
  }

  reloadJobList = () => {
    getJobs(res => {
      if(res.status){
        let jobList = res.jobList.sort((a, b) => b.timestamp - a.timestamp)
        this.setState(() =>({
          jobList
        }))
      }
    })
  }

  render(){
    const showAddNewJob = this.state.showAddNewJob

    return(
      <div className="row">
        { this.state.selectedJob === '' && <div className="col-12">
          <div className=" mx-3 row container-t">
            <div className="col-md-4 col-12">
              <button onClick={this.toggleAddNewJob} className="btn btn-link">{showAddNewJob ? '-' : '+'} เพิ่ม Job ใหม่</button>
            </div>
            {
              showAddNewJob && <CreateNewJob toggleAddNewJob={this.toggleAddNewJob} reloadJobList={this.reloadJobList} user={this.props.user} />
            }
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-check">
                <input checked={this.state.showAll} onClick={e => this.toggleShowAll(e)} type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" for="exampleCheck1">แสดงทั้งหมด</label>
              </div>
            </div>
          </div>
          <div className="row">
            {
              this.state.jobList.sort((a, b) => {return b.timestamp > a.timestamp ? 1:-1}).filter(x => {
                if(this.state.showAll){
                  return true
                }else{
                  if(x.status === 'กำลังทำ'){
                    return true
                  }else{
                    return false
                  }
                }
              }).map(x =>
                <div onClick={() => this.openJobDetail(x)} className="col-md-4 col-12 px-4 border-bottom py-4">
                  <div className="row">
                    <div className="col-1">
                      <b style={getStatusStyle(x.status)}>◉</b>
                    </div>
                    <div className="col-11">
                      <div className="row">
                        {
                          (x.type === 'งานภายนอกอาคาร' || x.type === 'งานภายนอกอาคาร' || x.type === 'งานภายนอกอาคาร' || x.type === 'ซ่อมอุปกรณ์') &&
                          <div className="col-9"><b>{x.location}</b></div>
                        }
                        {
                          x.type === 'งานภายในอาคาร' &&
                          <div className="col-9"><b>{x.building.name}</b></div>
                        }
                        {
                          x.type === 'งานภายในห้องพัก' &&
                          <div className="col-9"><b>{x.property ? x.property.name + ' - ' + x.building.name : 'ไม่พบข้อมูล'}</b></div>
                        }
                        <div className="col-3">{moment(x.timestamp).fromNow(true)}</div>
                      </div>
                      <div className="row">
                        <div className="col-12">{x.detail}</div>
                      </div>
                      <div className="row">
                        <div className="col-12">ประเภท: {x.type}</div>
                      </div>
                      {
                        x.workerList.length ?
                        <div className="row mt-2">
                          {
                            x.workerList.map(y => (
                              <div className="col-2">
                                <img style={{verticalAlign: 'middle', width: '50px', height: '50px', borderRadius: '50%'}} src={IP + '/public/employee/' + y.imageUrl} />
                              </div>
                            ))
                          }
                        </div> : ''
                      }
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>}
        {
          this.state.selectedJob !== '' && <JobDetail user={this.props.user} job={this.state.selectedJob} backBtn={this.backBtn} />
        }
      </div>
    )
  }
}


class JobDetail extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      jobLogs: [],
      subMenu: '',
      workerList: [],
      employeeList: [],
      selectedWorkerId: '',
      reportText: ''
    }
  }

  setReportText = e => {
    const value = e.target.value
    this.setState(() => ({
      reportText: value
    }))
  }

  submitReportText = () => {
    const text = this.state.reportText
    if(text.trim() === ''){
      alert('กรุณาใส่ข้อมูลรายงาน')
      return
    }
    const jobId = this.props.job.id
    const createBy = this.props.user.username
    submitJopReport({jobId, createBy, detail: text}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.componentDidMount()
        this.setState(() => ({
          subMenu: '',
          reportText: ''
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  componentDidMount(){
    getJobDetailById({id: this.props.job.id}, res => {
      if(res.status){
        this.setState(() => ({
          jobLogs: res.jobLogs
        }))
      }else{
        alert(res.msg)
      }
    })
    getEmployeeList(res => {
      if(res.status){
        const employeeList = res.list.filter(x => x.departmentId === 'uyw83ikfozqhp8')
        this.setState(() => ({
          employeeList
        }))
      }else{
        alert(res.msg)
      }
    })
    getWorkerOnJob({
      jobId: this.props.job.id
    }, res => {
      if(res.status){
        this.setState(() => ({
          workerList: res.workerList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  setSubMenu = input => {
    this.setState(() => ({
      subMenu: input,
      reportText: ''
    }))
  }

  backBtn = () => {
    this.setSubMenu('')
    this.componentDidMount()
  }

  updateJobStatus = input => {
    updateJobStatus({
      id: this.props.job.id,
      status: input,
      createBy: this.props.user.username
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.backBtn()
      }else{
        alert(res.msg)
      }
    })
  }

  workerOnChange = input => {
    const value = input.value
    this.setState(() => ({
      selectedWorkerId: value
    }))
  }

  submitAddWorker = () => {
    let id = this.state.selectedWorkerId
    if(id.trim() === ''){
      alert('กรุณาระบุพนักงานที่รับผิดชอบงาน')
      return
    }
    submitAddWorkerToJob({
      jobId: this.props.job.id,
      workerId: id,
      createBy: this.props.user.username
    }, res => {
      if(res.status){
        this.setState(() => ({
          subMenu: '',
          selectedWorkerId: ''
        }))
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    const job = this.props.job
    let employeeOption = this.state.employeeList.filter(x => x.actvie)
    console.log(employeeOption);
    employeeOption = employeeOption.map(x => ({label: x.name, value: x.id }))
    this.state.workerList.forEach(x => {
      employeeOption = employeeOption.filter(y => y.value !== x.employeeId)
    })
    return(
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-md-4 mb-3 text-center">
            <button onClick={this.props.backBtn} className="btn btn-danger">กลับ</button>
          </div>
          { job.status === 'กำลังทำ' &&
            <div className="col-md-4 col-12 mb-3 text-center">
            <button onClick={() => this.updateJobStatus('เสร็จ')} className="btn btn-warning">ปิด Job</button>
          </div>}
          {job.status === 'กำลังทำ' &&
          <div className="col-md-4 col-12 mb-3 text-center">
            <button onClick={() => this.updateJobStatus('ยกเลิก')} className="btn btn-dark">ยกเลิก Job</button>
          </div>}
        </div>
        <div className="row">
          <div className="col-md-4 col-12">
            ID: {job.id}
          </div>
          <div className="col-md-4 col-12">
            สถาณะ: <b style={getStatusStyle(job.status)}>{job.status}</b>
          </div>
          <div className="col-md-4 col-12">
            ประเภทงาน: {job.type}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            รายละเอียด: {job.detail}
          </div>
        </div>
        <div className="row">
          {
            (job.type === 'งานภายนอกอาคาร' || job.type === 'งานภายนอกอาคาร' || job.type === 'งานภายนอกอาคาร' || job.type === 'ซ่อมอุปกรณ์') &&
            <div className="col-12">สถานที่: {job.location}</div>
          }
          {
            job.type === 'งานภายในอาคาร' &&
            <div className="col-12">อาคาร: {job.building.name}</div>
          }
          {
            job.type === 'งานภายในห้องพัก' &&
            <div className="col-6">อาคาร: {job.building.name}</div>
          }
          {
            job.type === 'งานภายในห้องพัก' &&
            <div className="col-6">ห้อง: {job.property !== null ? job.property.name : 'ไม่พบข้อมูล'}</div>
          }
        </div>
        { job.status === 'กำลังทำ' &&
        <div className="row mb-3">
          <div onClick={() => this.setSubMenu('inventory')} className="col-3 menuBarBtn text-center py-2 mx-2">
            <FontAwesomeIcon className="" icon={faCubes} size='4x' />
          </div>
          <div onClick={() => this.setSubMenu('addWorker')} className="col-3 menuBarBtn text-center py-2 mx-2">
            <FontAwesomeIcon className="" icon={faUserFriends} size='4x' />
          </div>
          <div onClick={() => this.setSubMenu('addNote')} className="col-3 menuBarBtn text-center py-2 mx-2">
            <FontAwesomeIcon className="" icon={faFileAlt} size='4x' />
          </div>
        </div>
      }
        {
          this.state.subMenu === 'inventory' &&
          <AddInventoryToJob backBtn={this.backBtn} user={this.props.user} jobId={job.id} />
        }
        {
          this.state.subMenu === 'addNote' &&
          <div className="row">
            <div className="col-12">
              <label className="label-control">รายงาน</label>
            <input onChange={this.setReportText} value={this.state.reportText} type="text" className="form-control" />
            </div>
            <div className="col-12">
              <button onClick={this.submitReportText} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }
        {
          this.state.subMenu === 'addWorker' &&
          <div className="row">
            <div className="col-12 col-md-4 mb-3">
              <Select onChange={this.workerOnChange} options={employeeOption} />
            </div>
            <div className="col-12 col-md-4 text-center mb-3">
              <button onClick={this.submitAddWorker} className="btn btn-success">บันทึก</button>
            </div>
            <div className="col-12 col-md-4 text-center mb-3">
              <button onClick={this.backBtn} className="btn btn-danger">ปิด</button>
            </div>
          </div>
        }
        {
          job.imageList.length !== 0 &&
          <div className="row">
            {
              job.imageList.map(x => (
                <div className="col-12 col-md-4 mb-3">
                  <img className="jobImage" src={IP + '/public/storageJobImages/' + x.filename} />
                </div>
              ))
            }
          </div>
        }
        <div className="row">
          <div className="col-12">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th align='center' colSpan="2">ผู้รับผิดชอบ</th>
                </tr>
              </thead>
              <tbody>
              {
                this.state.workerList.map(x =>
                  <tr>
                    <td>{x.employeeId}</td>
                    <td>{x.name}</td>
                  </tr>
                )
              }
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            ประวัติรายงาน
          </div>
          <div className="col-12">
            <table className="table table-border">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>ข้อมูล</th>
                  <th>บันทึกโดย</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.jobLogs.length !== 0 ?
                  this.state.jobLogs.map(x =>
                    <tr>
                      <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                      <td>{x.detail}</td>
                      <td>{x.createBy.short_name}</td>
                    </tr>
                  )
                  :
                  <tr>
                    <td colSpan='3' align='center'>ไม่พบข้อมูล</td>
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

class AddInventoryToJob extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      stockOptions:[],
      engineerItemList: [],
      quantity: 0,
      selectedItem: ''
    }
  }
  componentDidMount(){
    getEngineerInventory(res => {
      if(res.status){
        let stockOptions = res.engineerItemList.map(x => ({ label: `${x.name} / ${x.quantity} ${x.unit}`, value: x.itemId}))

        this.setState(() => ({
          engineerItemList: res.engineerItemList,
          stockOptions
        }))
      }else{
        alert(res.msg)
      }
    })
  }
  quantityOnChange = e => {
    let value = e.target.value
    if(validator.isFloat(value) || value === ''){
      this.setState(() => ({
        quantity: value
      }))
    }
  }
  selectItem = input => {
    let id = input.value
    this.setState(() => ({
      selectedItem: id
    }))
  }
  submit = () => {
    let quantity = this.state.quantity
    let itemId = this.state.selectedItem
    let found = this.state.engineerItemList.find(x => x.itemId === itemId)
    if(itemId.trim() === ''){
      alert('กรุณาเลือกรายการของ')
      return
    }
    if(quantity === ''){
      alert('กรุณาระบุจำนวน')
      return
    }
    if(parseFloat(quantity) <= 0){
      alert('กรุณาระบุจำนวนที่มากกว่า 0')
      return
    }
    if(parseFloat(quantity) > found.quantity){
      alert('กรุณาระบุจำนวนที่มากกว่าจำนวนที่คงเหลือ')
      return
    }

    sumbitItemsToEngineerJob({
      jobId: this.props.jobId,
      itemId,
      quantity,
      createBy: this.props.user.username
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.backBtn()
      }else{
        alert(res.msg)
      }
    })
  }
  render(){
    return (
      <div className="row">
        <div className="col-12">
          <h4>เพิ่มของที่ใช้ใน Job</h4>
        </div>
        <div className="col-md-4 col-12">
            <div className="form-group">
              <label>รายการของ</label>
              <Select onChange={this.selectItem} className="form-control" options={this.state.stockOptions} />
            </div>
        </div>
        <div className="col-md-4 col-12">
          <div className="form-group">
            <label>จำนวน</label>
            <input value={this.state.quantity} onChange={this.quantityOnChange} type="text" className="form-control" />
          </div>
        </div>
        <div className="col-md-2 col-6">
          <button onClick={this.submit} className="btn btn-success">บันทึก</button>
        </div>
        <div className="col-md-2 col-6">
          <button onClick={this.props.backBtn} className="btn btn-danger">ปิด</button>
        </div>
      </div>
    )
  }
}

export class CreateNewJob extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      type: '',
      detail: '',
      location: '',
      buildingOptions: [],
      selectedBuildingId:'',
      selectedPropertyId:'',
      propertyOptions: [],
      imageList: [],
      loading: false,
      showRoomSelection: false,
      roomList: []
    }
  }

  submitRoomList = roomList => {
    this.setState(() => ({
      roomList,
      showRoomSelection: false
    }))
  }

  componentDidMount(){
    getBuildingsAndProperties(res => {
      if(res.status){
        this.setState(() => ({
          buildingOptions: res.buildingList.map(x => ({label: x.name, value: x.id})),
          propertyOptions: res.propertyList
        }))
      }
    })
  }

  imageOnChange = e => {

    var imageResize = new ImageResize({
      format: 'png',
      width: 500,
      quantity: 1
    });
    let dataURLtoFile = (dataurl, filename) => {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)

      while(n--){
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime})
    }
    let name = e.target.files[0].name
    imageResize.play(URL.createObjectURL(e.target.files[0])).then(res => {
      let file = dataURLtoFile(res,name)
      let imageList = this.state.imageList
      imageList = [ ...imageList, {file, url: URL.createObjectURL(file)}]
      this.setState(() => ({
        imageList
      }))
    })

  }

  removeImage = url => {
    let imageList = this.state.imageList.filter(x => x.url !== url)
    this.setState(() => ({
      imageList
    }))
  }

  openRoomSelection = () => {
    this.setState(() => ({
      showRoomSelection: true
    }))
  }

  typeOnChage = input => {
    const value = input.value
    this.setState(() => ({
      type: value,
      location: '',
      selectedPropertyId: '',
      roomList: []
    }))
  }

  textOnChange = e => {
    const value = e.target.value
    const name = e.target.name
    this.setState(() => ({
      [name]: value
    }))
  }

  buildingOnChange = input => {
    const value = input.value
    this.setState(() => ({
      selectedBuildingId: value,
    }))
  }

  propertyOnChange = input => {
    const value = input.value
    this.setState(() => ({
      selectedPropertyId: value,
    }))
  }

  submitNewJob = () => {
    const type = this.state.type
    const detail = this.state.detail
    const location = this.state.location
    const buildingId = this.state.selectedBuildingId
    const roomList = this.state.roomList
    const imageList = this.state.imageList

    if(type.trim() === ''){
      alert('กรุณาเลือกประเภทงาน')
      return
    }

    if(detail.trim() === ''){
      alert('กรุณาใส่รายละเอียดงาน')
      return
    }

    if((type === 'งานภายนอกอาคาร' || type === 'ติดตั้งอุปกรณ์' || type === 'ซ่อมอุปกรณ์') && location.trim() === ''){
      alert('กรุณาใส่สถานที่ที่ทำงาน')
      return
    }

    if(type === 'งานภายในอาคาร' && buildingId.trim() === ''){
      alert('กรุณาระบุอาคาร')
      return
    }

    if(type === 'งานภายในห้องพัก' && roomList.length === 0){
      alert('กรุณาระบุห้อง')
      return
    }
    this.setState(() => ({loading: true}))
    if(imageList.length !== 0){
      submitNewJobWithImages({
        type,
        detail,
        location,
        buildingId,
        roomList,
        createBy: this.props.user.username,
        imageList: imageList.map(x => x.file)
      }, res => {
        if(res.status){
          alert('ข้อมูลถูกบันทึก')
          this.setState(() => ({
            type: '',
            detail: '',
            location: '',
            buildingOptions: [],
            selectedBuildingId:'',
            selectedPropertyId:'',
            propertyOptions: [],
            imageList: [],
            loading: false,
          }))
          this.props.reloadJobList()
        }
      })
    }else{
      submitNewJob({
        type,
        detail,
        location,
        buildingId,
        roomList,
        createBy: this.props.user.username
      }, res => {
        if(res.status){
          alert('ข้อมูลถูกบันทึก')
          this.setState(() => ({
            type: '',
            detail: '',
            location: '',
            buildingOptions: [],
            selectedBuildingId:'',
            selectedPropertyId:'',
            propertyOptions: [],
            imageList: [],
            loading: false,
            roomList: []
          }))
          this.props.reloadJobList()
        }
      })
    }
  }

  render(){
    const detail = this.state.detail
    const type = this.state.type
    const location = this.state.location
    const selectOptions = [
      {label: 'งานภายนอกอาคาร', value: 'งานภายนอกอาคาร'},
      {label: 'งานภายในอาคาร', value: 'งานภายในอาคาร'},
      {label: 'งานภายในห้องพัก', value: 'งานภายในห้องพัก'},
      {label: 'ติดตั้งอุปกรณ์', value: 'ติดตั้งอุปกรณ์'},
      {label: 'ซ่อมอุปกรณ์', value: 'ซ่อมอุปกรณ์'}
    ]
    const buildingOptions = this.state.buildingOptions
    const selectedBuildingId = this.state.selectedBuildingId
    const propertyOptions = this.state.propertyOptions.filter(x => x.buildingId === selectedBuildingId).map(x => ({label: x.name, value: x.id}))
    return(
      <div className="col-12">
        {
          this.state.showRoomSelection &&
          <RoomSelection roomList={this.state.roomList} submitRoomList={this.submitRoomList} buildingOptions={buildingOptions} propertyOptions={this.state.propertyOptions} />
        }
        {
          this.state.loading &&
          <Loading loading background="rgba(80,80,80,0.1)" loaderColor="#3498db" />
        }
        <div className="row">
          <div className="col-md-2 col-12">
            <div className="form-group">
              <label>ประเภทงาน</label>
              <Select onChange={this.typeOnChage} options={selectOptions} />
            </div>
          </div>
          <div className="col-md-4 col-12">
            <div className="form-group">
              <label>รายละเอียดงาน</label>
              <input name='detail' onChange={this.textOnChange} value={detail} type="text" className="form-control" />
            </div>
          </div>
          {
            (type === 'งานภายนอกอาคาร' || type === 'ติดตั้งอุปกรณ์' || type === 'ซ่อมอุปกรณ์') &&
            <div className="col-md-4 col-12">
              <div className="form-group">
                <label>สถานที่</label>
                <input name='location' onChange={this.textOnChange} value={location} type="text" className="form-control" />
              </div>
            </div>
          }
          {
            (type === 'งานภายในอาคาร') &&
            <div className="col-md-2 col-12">
              <div className="form-group">
                <label>เลือกอาคาร</label>
                <Select onChange={this.buildingOnChange} options={buildingOptions} />
              </div>
            </div>
          }
          {
            type === 'งานภายในห้องพัก' &&
            <div className="col-md-2 col-12">
              <button onClick={this.openRoomSelection} className="btn btn-info">เลือกห้องพัก</button>
            {
              buildingOptions.map(building => {
                let list = this.state.roomList.filter(room => room.buildingId === building.value)
                if(list.length !== 0){
                  return <div>
                      <b>{building.label}</b>
                    <ul>
                      {list.map(room =>
                        <li>{room.name}</li>
                      )}
                    </ul>
                  </div>
                }else{
                  return;
                }
              })
            }
            </div>
          }
        </div>
        <div className="row">
          <div className="col-12 mb-3">
            <label for="imageStock">
              <FontAwesomeIcon title="แก้ไขข้อมูล" icon={faCamera} size='3x' />
            </label>
            <input id="imageStock" type="file" onChange={this.imageOnChange} style={{display: 'none'}}  />
          </div>
        </div>
        <div className="row mb-3">
          {
            this.state.imageList.map(x => (
              <div className="col-12 col-md-3 md-3">
                <button onClick={() => this.removeImage(x.url)} className='btn btn-danger'>x</button>
                <img src={x.url} width='300'/>
              </div>
            ))
          }
        </div>
        <div className="row">
          <div className="col-12">
            <button onClick={this.submitNewJob} className="btn btn-success">บันทึก</button>
          </div>
        </div>
      </div>
    )
  }
}

class RoomSelection extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      roomList: this.props.roomList
    }
  }

  roomOnClick = (buildingId, name, id) => {
    let newList = []
    let found = this.state.roomList.filter(x => (x.buildingId === buildingId && x.name === name))
    if(found.length === 1){
      newList = this.state.roomList.filter(x => !(x.buildingId == buildingId && x.name == name))
    }else{
      newList = [ ...this.state.roomList, {buildingId, name, id} ]
    }
    this.setState(() => ({
      roomList: newList
    }))
  }

  checkRoom = (buildingId, name) => {
    let found = this.state.roomList.filter(x => (x.buildingId === buildingId && x.name === name))
    if(found.length === 1){
      return true
    }else{
      return false
    }
  }

  submitRoom = () => {
    this.props.submitRoomList(this.state.roomList)
  }

  render(){
    return(
      <Modal
          isOpen={true}
          contentLabel="Example Modal"
        >
        <div style={{'height': '400px', overflow: 'scroll'}}>
          {
            this.props.buildingOptions.map(building =>
              <div className="row justify-content-around">
                <div className="col-12">
                  <h4>{building.label}</h4>
                </div>
                {
                  this.props.propertyOptions.filter(x => x.buildingId === building.value).map(x =>
                    <div onClick={() => this.roomOnClick(x.buildingId, x.name, x.id)} style={this.checkRoom(x.buildingId, x.name) ? {background: '#56c9ff'} : {background: '#f9c91b'}} className="col-5 col-md-4 text-center p-3 m-2">
                      <h4>{x.name}</h4>
                    </div>
                  )
                }
                <hr />
              </div>
            )
          }
        </div>
        <br />
          <button onClick={this.submitRoom} className="btn btn-success">ปิด</button>
        </Modal>
    )
  }
}

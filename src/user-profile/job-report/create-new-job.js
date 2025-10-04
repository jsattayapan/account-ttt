import React from 'react'
import moment from 'moment'
import Swal from 'sweetalert2'
import ImageResize from 'image-resize';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndoAlt, faUsersCog, faCloudSun, faBuilding, faBed, faTools } from '@fortawesome/free-solid-svg-icons'

import { BottomNav } from './../index.js'

import {
    getJobs,
    getBuildingsAndProperties,
    getJobsByCreateBy,
    submitNewJob
  } from './../tunnel'

export default class CreateNewJob extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      type: 'ซ่อมอุปกรณ์',
      roomList: [],
      buildingList: [],
      detail: '',
      location: '',
      buildingId: '',
      selectedRoomList: [],
      imageList: []
    }
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

  componentDidMount(){
    getJobsByCreateBy({id: this.props.employeeId}, res => {
      console.log(res);
    })
    getBuildingsAndProperties(res => {
      if(res.status){
        console.log(res);
        this.setState(() => ({
          roomList: res.propertyList,
          buildingList: res.buildingList,
          buildingId: res.buildingList[0].id
        }))
      }
    })
  }

  changeType = type => {
    this.setState(() => ({
      type,
      detail: '',
      location: '',
      selectedRoomList: [],
      buildingId:  this.state.buildingList[0].id
    }))
  }

  onTextChange = e => {
    let  { name, value } = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  roomClick = room => {
    let {selectedRoomList} = this.state
    let found = selectedRoomList.filter(x => x.id ===room. id)
    if(found.length !== 0){
      selectedRoomList = selectedRoomList.filter(x => x.id !== room.id)
    }else{
      selectedRoomList = [ ...selectedRoomList,  room]
    }
    this.setState(() => ({
      selectedRoomList
    }))
  }

  inSelectedRoomList = room => {
    let {selectedRoomList} = this.state
    let found = selectedRoomList.filter(x => x.id ===room. id)
    if(found.length !== 0){
      return true
    }else{
      return false
  }
}


selectBuildingOnChange = e => {
  this.setState(() => ({
    buildingId: e.target.value
  }))
}

removeImage = url => {
  let imageList = this.state.imageList.filter(x => x.url !== url)
  this.setState(() => ({
    imageList
  }))
}


submitNewJob = () => {
  let { imageList, type, detail, location, selectedRoomList, buildingId } = this.state

  if(detail.trim() === ''){
    Swal.fire({
      title: 'กรุณาระบุรายละเอียด',
      icon: 'error'
    })
    return
  }

  if((type === 'งานภายนอกอาคาร' || type === 'ติดตั้งอุปกรณ์' || type === 'ซ่อมอุปกรณ์') && location.trim() === ''){
    Swal.fire({
      title: 'กรุณาใส่สถานที่ที่ทำงาน',
      icon: 'error'
    })
    return
    }

    if(type === 'งานภายในห้องพัก' && selectedRoomList.length === 0){
      Swal.fire({
        title: 'กรุณาเลือกห้องพัก',
        icon: 'error'
      })
      return
    }
    if(type === 'งานภายในอาคาร' && buildingId === ''){
      Swal.fire({
        title: 'กรุณาเลือกอาคาร',
        icon: 'error'
      })
      return
    }


  if( imageList.length === 0){
    submitNewJob({
      type,
      detail,
      location,
      buildingId,
      roomList: selectedRoomList,
      createBy: this.props.employeeId
    }, res => {
      if(res.status){
        Swal.fire({
          title: 'ข้อมูลถูกบันทึก',
          icon: 'success'
        })
      }
    })
  }
}


  render(){
    let { detail, location } = this.state
    return(
      <div className='row'>
        <h3>ประเภท</h3>
        <br />
        
        <div className="d-flex flex-row justify-content-between ">
          <div
            onClick={() => this.changeType('ซ่อมอุปกรณ์')}
            style={this.state.type === 'ซ่อมอุปกรณ์'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'ซ่อมอุปกรณ์'? '#333': '#f2c66f'} icon={faTools} />
            <p>ซ่อม/บำรุง</p>
          </div>
          <div
            onClick={() => this.changeType('งานภายในห้องพัก')}
            style={this.state.type === 'งานภายในห้องพัก'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'งานภายในห้องพัก'? '#333': '#f2c66f'} icon={faBed} />
            <p>ห้องพัก</p>
          </div>
          <div
            onClick={() => this.changeType('งานภายในอาคาร')}
            style={this.state.type === 'งานภายในอาคาร'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'งานภายในอาคาร'? '#333': '#f2c66f'} icon={faBuilding} />
            <p>ในอาคาร</p>
          </div>
          <div
            onClick={() => this.changeType('งานภายนอกอาคาร')}
            style={this.state.type === 'งานภายนอกอาคาร'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'งานภายนอกอาคาร'? '#333': '#f2c66f'} icon={faCloudSun} />
            <p>นอกอาคาร</p>
          </div>
          <div
            onClick={() => this.changeType('ติดตั้งอุปกรณ์')}
            style={this.state.type === 'ติดตั้งอุปกรณ์'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'install'? '#333': '#f2c66f'} icon={faUsersCog} />
            <p>ติดตั้ง</p>
          </div>
        </div>
        <h3 className="mt-4">ข้อมูล</h3>
          <div className="col-12">
            <div className="d-flex flex-column">
                <label className="label-control mt-4">รายละเอียดงาน:</label>
                <input value={detail} name='detail' onChange={this.onTextChange} className="form-control mt-3" />
            </div>
            {
              (this.state.type === 'งานภายนอกอาคาร' || this.state.type === 'ติดตั้งอุปกรณ์' || this.state.type === 'ซ่อมอุปกรณ์') &&
                <div className="d-flex flex-column">
                  <label className="label-control mt-4">สถานที่:</label>
                  <input value={location} name='location' onChange={this.onTextChange} className="form-control mt-3" />
                </div>
              }

              {
                this.state.type === 'งานภายในอาคาร' &&
                  <div className="d-flex flex-column">
                    <label className="label-control mt-4">เลือกอาคาร</label>
                      <select onChange={this.selectBuildingOnChange} className="form-control mt-3" name="building">
                        {
                          this.state.buildingList.map(x => <option value={x.id}>{x.name}</option>)
                        }
                      </select>
                  </div>
              }

              {
                this.state.type === 'งานภายในห้องพัก' &&
                  <div className="d-flex flex-column">
                    <label className="label-control mt-4">เลือกห้องพัก</label>
                    <div className="room-selection-container">
                      {
                        this.state.buildingList.map(x => (
                          <div>
                          <p className="py-2 pl-2 text-center" style={{color: 'white'}}><u>{x.name}</u></p>
                          <div className="room-selection-building">
                            {this.state.roomList.filter(y => y.buildingId === x.id).map(room => (
                              <div onClick={() => this.roomClick(room)} className={this.inSelectedRoomList(room) ? "room-item-check" :"room-item"}>
                                {room.name}
                              </div>
                            ))}
                          </div>
                        </div>
                        ))
                      }
                    </div>
                  </div>

                }
                <div>
                  <label for="image" className='profile-block mt-3'>ใส่รูป</label>
                  <input id="image" onChange={this.imageOnChange} name="image" placeholder="is" type="file" style={{display: 'none'}} />
                </div>


              <div className="d-flex job-image-list mt-4">
                {
                  this.state.imageList.map(x =>(
                    <div className="job-image-container">
                      <div onClick={() => this.removeImage(x.url)} className="delete-image-btn">ลบ
                      </div>
                      <img className="job-image" src={x.url} height="120px" />
                    </div>
                  ))
                }
              </div>
              <div style={{height:'100px', width: '50px'}}>

              </div>
            </div>

        <BottomNav
          icon1='บันทึก'
          icon2={faUndoAlt}
          onClick1={this.submitNewJob}
          onClick2={() => this.props.changePage('list')}
           />
      </div>
    )
  }
}

import React from 'react'
import moment from 'moment'
import { getBuildingsAndProperties, submitNewJob, submitNewJobWithImages } from './../dept-manager/tunnel'
import { PropertyIconButton, ButtomNavBar } from './empCheckListPage'
import { createNewRoomCheckList, getRoomCheckListRecordByCheckListId, getCheckListByRoomId, createRoomCheckListRecord, getRoomCheckListRecordFailByRoomId } from './tunnel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import ImageResize from 'image-resize';
import { IP } from './../../constanst';


export class PropertyRoomList extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      propertyList: [],
      buildingList: [],
      selectedBuilding: {name: ''},
      selectedPropertyList: []
    }
  }

  componentDidMount(){
    getBuildingsAndProperties(res => {
      if(res.status){
        this.setState(() => ({
          propertyList: res.propertyList,
          buildingList: res.buildingList,
          selectedBuilding: {name: ''},
          selectedPropertyList: []
        }))
      }
    })
  }

  onBuildingClick = (building) => {
    this.setState(() => ({
      selectedBuilding: building,
      selectedPropertyList: this.state.propertyList.filter(x => x.buildingId === building.id)
    }))
  }


  backToBuilding = () => {
    this.setState(() => ({
      selectedBuilding: {name: ''},
      selectedPropertyList: []
    }))
  }


  render(){
    return(
      <div className="row">
        { this.state.selectedBuilding.name === '' ? <div className="col-12">
          <h3>ห้องพัก</h3>
          <div className="row justify-content-around">
            {
              this.state.buildingList.map(x =>
                <PropertyIconButton onClick={() => this.onBuildingClick(x)} name={x.name} />
              )
            }
          </div>
          <div className="row">
            <ButtomNavBar links={this.props.links} />
          </div>
        </div>:
        <div className="col-12">
          <PropertyList backToBuilding={this.backToBuilding} propertyList={this.state.selectedPropertyList} building={this.state.selectedBuilding} user={this.props.user} />
        </div>
      }
      </div>
    )
  }
}

class PropertyList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      selectedRoom: ''
    }
  }

  setRoom = room => {
    this.setState(() => ({
      selectedRoom: room
    }))
  }

  backToPropertyList = () => {
    this.setState(() => ({
      selectedRoom: ''
    }))
  }

  render(){
    const links = [
      {text: 'กลับ', onClick: this.props.backToBuilding}
    ]
    return(
      <div className="row">
        { this.state.selectedRoom === '' ?
          <div className="col-12">
            <div className="row">
              <div className="col-12 text-center">
                <h3>{this.props.building.name}</h3>
              </div>
              <hr />
              <div className="col-12">
                <div className="row justify-content-around">
                  {
                    this.props.propertyList.map(x =>
                      <PropertyIconButton onClick={() => this.setRoom(x)} name={x.name} />
                    )
                  }
                </div>
              </div>
            </div>
            <div className="row">
              <ButtomNavBar links={links} />
            </div>
          </div>
          :
          <div className="col-12">
            <RoomDetail user={this.props.user} backToPropertyList={this.backToPropertyList} building={this.props.building} room={this.state.selectedRoom} />
          </div>
      }
      </div>
    )
  }
}

class RoomDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      checkListId: '',
      checkLists: [],
      subPage: 'check-histrory',
      failRecordList: []
    }
  }

  componentDidMount(){
    getCheckListByRoomId({roomId: this.props.room.id}, res => {
      if(res.status){
        this.setState(() => ({
          checkLists: res.checkLists
        }))
      }
    })
    getRoomCheckListRecordFailByRoomId({roomId: this.props.room.id}, res => {
      if(res.status){
        this.setState(() => ({
          failRecordList: res.failRecordList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  createNewRoomCheckList = () => {
    const roomId = this.props.room.id
    const createBy = this.props.user.username
    createNewRoomCheckList({roomId, createBy}, res => {
      if(res.status){
        this.setState(() => ({
          checkListId: res.checkListId
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  openCheckListRecord = checkListId => {
    this.setState(() => ({
      checkListId
    }))
  }

  backButtonClick = () => {
    if(this.state.checkListId === ''){
      this.props.backToPropertyList()
    }else{
      this.setState(() => ({checkListId: ''}))
    }
  }

  render(){
    return (
      <div className="row">
        <div className="col-12">
          <button onClick={this.backButtonClick} className="btn btn-link">กลับ</button>
        </div>
        <div className="col-12 text-center">
          <h3>{this.props.building.name}</h3>
          <h3>{this.props.room.name}</h3>
        </div>
        { this.state.checkListId === '' ? <div className="col-12">
          <div className="row">
            <div className="col-12 my-2">
              <button onClick={this.createNewRoomCheckList} className="btn btn-success btn-block">สร้างใบตรวจห้องพัก</button>
            </div>
            <div onClick={() => this.setState(() => ({subPage: 'check-histrory'}))} className={`col-6 py-2 text-center ${this.state.subPage === 'check-histrory' ? 'border-bottom border-info' : ''}`}>
              ประวัติการตรวจห้องพัก
            </div>
            <div onClick={() => this.setState(() => ({subPage: 'fail-histrory'}))} className={`col-6 py-2 text-center ${this.state.subPage === 'fail-histrory' ? 'border-bottom border-info' : ''}`}>
              ประวัติการรายการไม่ผ่าน
            </div>
            <div className="col-12 mt-2">
              {
                this.state.subPage === 'check-histrory' &&
                <table className="table table-bordered">
                  <tbody>
                    {
                      this.state.checkLists.map(x => (
                        <tr>
                          <td>
                            <button className="btn btn-link" onClick={() => this.openCheckListRecord(x.id)}>{moment(x.timestamp).format('DD/MM/YYYY kk:mm A')}</button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              }

              {
                this.state.subPage === 'fail-histrory' &&
                <table className="table table-bordered">
                  <tbody>
                    {
                      this.state.failRecordList.map(x => (
                        <tr>
                          <td>
                            <div className="row">
                              <div className="col-8">
                                {moment(x.timestamp).format('DD/MM/YYYY kk:mm A')}
                              </div>
                              <div className="col-4">
                                {x.fixStatus === null ? '-' : x.fixStatus}
                              </div>
                              <div className="col-12">
                                <h5>{x.itemName}</h5>
                                <p>{x.remark}</p>
                              </div>
                              <div className="col-12">
                                <p>บันทึกโดย: {x.createBy}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              }
            </div>
          </div>
        </div>
        :
        <div className="col-12">
          <RoomCheckListItemRecord building={this.props.building} room={this.props.room} checkListId={this.state.checkListId} user={this.props.user} />
        </div>
      }
      </div>
    )
  }
}

class RoomCheckListItemRecord extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      checkListItemList: []
    }
  }
  componentDidMount(){
    getRoomCheckListRecordByCheckListId({ checkListId: this.props.checkListId }, res => {
      console.log(res);
      if(res.status){
        this.setState(() => ({
          checkListItemList: res.checkListItemList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  refresh = () => {
    this.componentDidMount()
  }
  render(){
    return(
      <div className="row">
        <div className="col-12">
          {
            this.state.checkListItemList.map((x, i) => (
            <EachCheckListItem building={this.props.building} room={this.props.room} refresh={this.refresh} user={this.props.user} checkListId={this.props.checkListId} checkListItem={x} index={i} checkListRecord={x.record}  />
            ))
          }
        </div>
      </div>
    )
  }
}

class EachCheckListItem extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showEditRemark: false,
      remark: '',
      fileObject: null
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
      this.setState(() => ({
        fileObject: {file, url: URL.createObjectURL(file)}
      }))
    })

  }

  submitCheckListRecord = action => {
    if((action === 'fail' || action === 'failNReport') && this.state.remark.trim() === ''){
      alert('กรุณาระบุหมายเหตุที่ไม่ผ่าน')
      return
    }

    let reportToEngineer = false
    if(action === 'failNReport'){
      reportToEngineer = true
    }


    createRoomCheckListRecord({
      createBy: this.props.user.username,
      checkListId: this.props.checkListId,
      itemId: this.props.checkListItem.id,
      isPass: action === 'pass',
      remark: this.state.remark,
      fileObject: this.state.fileObject,
      reportToEngineer
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        if(action === 'failNReport'){
          //TODO Send Create new Job
          if(this.state.fileObject !== null){
            submitNewJobWithImages({
              type: 'งานภายในห้องพัก',
              detail: this.props.checkListItem.name + ' ' + this.state.remark,
              location: '',
              buildingId: '',
              roomList: [{id: this.props.room.id, buildingId: this.props.building.id}],
              createBy: this.props.user.username,
              imageList: [this.state.fileObject.file],
              roomCheckListRecordId: res.roomCheckListRecordId
            },res => {
              if(res.status){
                alert('ระบบได้แจ้งช่างแล้ว')
              }
            })
          }else{
            submitNewJob({
              type: 'งานภายในห้องพัก',
              detail: this.props.checkListItem.name + ' ' + this.state.remark,
              location: '',
              buildingId: '',
              roomList: [{id: this.props.room.id, buildingId: this.props.building.id}],
              createBy: this.props.user.username,
              roomCheckListRecordId: res.roomCheckListRecordId
            },res => {
              if(res.status){
                alert('ระบบได้แจ้งช่างแล้ว')
              }
            })
          }
        }
        this.props.refresh()
      }else{
        alert(res.msg)
      }
    })
  }


  remarkOnChange = e => {
    const { value } = e.target
    this.setState(() => ({
      remark: value
    }))
  }

  removeImage = () => {
    this.setState(() => ({
      fileObject: null
    }))
  }

  render(){
    const btnStlye = {
      height: '60px'
    }

    return(
      <div className="row border-bottom py-2">
        <div className="col-12">
          <h5>{this.props.index + 1}. {this.props.checkListItem.name} {this.props.checkListRecord === null ? '' : this.props.checkListRecord.isPass ? <FontAwesomeIcon color='green' size='1x' icon={faCheckCircle} /> : <FontAwesomeIcon color='red' size='1x' icon={faTimesCircle} />}</h5>
        </div>
        {
          this.props.checkListRecord === null ?
          <div className="col-12">
          <div className="row">
            {
              this.state.fileObject === null ? <div className="col-12">
              <button className="btn btn-link"><label for={this.props.checkListItem.id}>+ รูป</label></button>
              <input onChange={this.imageOnChange} style={{display: 'none'}} type="file" id={this.props.checkListItem.id} />
            </div>:
            <div className="col-12 text-center">
              <img src={this.state.fileObject.url} width='300' />
              <button onClick={this.removeImage} className="btn btn-danger mt-2">ลบรูป</button>
            </div>
            }
              <div className="col-12 my-2">
                <input value={this.state.remark} onChange={this.remarkOnChange} type='text' className="form-control" placeholder="ระบุหมายเหตุ" />
              </div>
            <div className="col-12 mb-2">
              <div className="row justify-content-around">
                <div className="col-4">
                  <button onClick={() => this.submitCheckListRecord('pass')} style={btnStlye} className="btn btn-success w-100">ผ่าน</button>
                </div>
                <div className="col-4">
                  <button onClick={() => this.submitCheckListRecord('fail')} style={btnStlye} className="btn btn-warning w-100">ไม่ผ่าน</button>
                </div>
                <div className="col-4">
                  <button onClick={() => this.submitCheckListRecord('failNReport')} style={btnStlye} className="btn btn-warning w-100">ไม่ผ่าน + แจ้งซ่อม</button>
                </div>
              </div>
            </div>
          </div>
        </div>:
        <div className="col-12">
          <div className="row">
            { this.props.checkListRecord.filename !== null &&
              <div className="col-12 text-center">
                <img src={`${IP}/public/storageCheckListRecordImage/${this.props.checkListRecord.filename}`} width='300' />
              </div>
            }
            <div className="col-12">
              <p className="text-left">
              บันทึกโดย: {this.props.checkListRecord.createBy} {moment(this.props.checkListRecord.timestamp).format('kk:mm A')}
              </p>
              {
                this.props.checkListRecord.remark !== '' && <p><b>หมายเหตุ: </b>{this.props.checkListRecord.remark}</p>
              }
            </div>
          </div>
        </div>
      }

        <hr />
      </div>
    )
  }
}

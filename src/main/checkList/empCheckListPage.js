import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { getCheckList, getCheckListItemByCheckListId, getTodayCheckListRecordByCheckListId, createCheckListRecord } from './tunnel'
import {submitNewJob} from './../dept-manager/tunnel'
import ImageResize from 'image-resize';
import { IP } from './../../constanst';

import { PropertyRoomList } from './roomCheckList'

export default class CheckListPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      property: 'บริวเวณภายนอก'
    }
  }

  onClick = (name) => {
    this.setState(() => ({
      property: name
    }))
  }

  backToProperty = () => {
    this.setState(() => ({
      property: 'บริวเวณภายนอก'
    }))
  }

  render(){
    const links = [
      {text: 'บริวเวณภายนอก', onClick: () => this.setState(() => ({property: 'บริวเวณภายนอก'}))},
      {text: 'ห้องพัก', onClick: () => this.setState(() => ({property: 'ห้องพัก'}))},
    ]
    return (
      <div className="row">
        {
          this.state.property === 'ห้องพัก' &&
          <div className="col-12 mb-3">
            <PropertyRoomList links={links} user={this.props.user} backToProperty={this.backToProperty}  />
          </div>
        }
        { this.state.property === 'บริวเวณภายนอก' &&
          <div className="col-12 mb-3 text-center">
            <h3>บริเวณภายนอก</h3>
            <div className="row justify-content-around">
              <PropertyIconButton onClick={this.onClick} name="Avatara" />
              <PropertyIconButton onClick={this.onClick} name="Samed Pavilion" />
              <PropertyIconButton onClick={this.onClick} name="Lazy Sandal" />
            </div>
            <div className="row">
              <ButtomNavBar links={links} />
            </div>
          </div>
        }

        { (this.state.property !== 'บริวเวณภายนอก' &&  this.state.property !== 'ห้องพัก') &&
          <div className="col-12">
              <PropertyCheckList backToProperty={this.backToProperty} user={this.props.user} property={this.state.property} departmentId={this.props.user.departmentManagerId} />
          </div>
        }
      </div>
    )
  }
}

export const ButtomNavBar = props => {

  return (
    <div className="bottomLinkContainer col-12">
        <div className="row justify-content-center text-center">
          {
            props.links.map(x => (
              <div className="col border border-dark">
                <button onClick={x.onClick} className="btn btn-link">{x.text}</button>
              </div>
            ))
          }
        </div>
    </div>
  )
}

class PropertyCheckList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      checkList: [],
      selectedCheckList:'',
      round: ''
    }
  }

  componentDidMount(){
    getCheckList(res => {
      if(res.status){
        this.setState(() => ({
          checkList: res.checkLists.filter(x => x.property === this.props.property && x.departmentId === this.props.departmentId)
        }))
      }
    })
  }

  openCheckListItems = (selectedCheckList, round) => {
    this.setState(() => ({
      selectedCheckList,
      round
    }))
  }

  backToCheckList = () => {
    this.setState(() => ({
      selectedCheckList: '',
      round: ''
    }))
  }

  render(){
    return (
      <div className="row">
        { this.state.selectedCheckList === '' ?
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <button onClick={this.props.backToProperty} className="btn btn-link">กลับ</button>
            </div>
            <div className="col-12 text-center">
              <h3>{this.props.property}</h3>
              <p>{moment().format('ddd DD/MMM/YYYY')}</p>
            </div>
            <div className="col-12">
              <table style={{width: '100%'}}>
                <tbody>
                  {
                    this.state.checkList.map(x => (
                      <tr style={{borderBottom: '1px solid black'}}>
                        <td className="py-4">{x.name}</td>
                        <td className="text-center">{x.numberOfCheck === 2 && <button onClick={() => this.openCheckListItems(x, 1)} className="btn btn-success">รอบเช้า</button>}</td>
                        <td className="text-center">
                          {
                            x.numberOfCheck === 2 ?
                            <button
                              onClick={() => this.openCheckListItems(x, 2)}
                              className="btn btn-warning"
                            >รอบเย็น</button> :
                            <button
                                onClick={() => this.openCheckListItems(x, 1)}
                                className="btn btn-warning"
                            >รอบเช้า</button>}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        :
        <div className="col-12">
          <CheckListItemList backToCheckList={this.backToCheckList} user={this.props.user} round={this.state.round} property={this.props.property} checkList={this.state.selectedCheckList} />
        </div>
      }
      </div>
    )
  }
}


export const PropertyIconButton = props => {
  const style = {
    backgroundColor: props.color || '#e3e3e3',
    padding: '30px 0'
  }

  return (
    <div style={style} onClick={() => props.onClick(props.name)} className="col-11 col-md-4 my-1 text-center align-middle">
      {props.name}
    </div>
  )
}

class CheckListItemList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      checkListItems: []
    }
  }

  refresh = () => {
    this.componentDidMount()
  }

  componentDidMount(){
    getTodayCheckListRecordByCheckListId({checkListId: this.props.checkList.id, round: this.props.round}, res => {
      console.log(res);
      if(res.status){
        this.setState(() => ({
          checkListItems: res.payload
        }))
      }
    })
  }

  render(){
    return (
      <div className="row justify-content-around">
        <div className="col-12">
          <button onClick={this.props.backToCheckList} className="btn btn-link">กลับ</button>
        </div>
        <div className="col-12 text-center">
          <h3>{this.props.property}: {this.props.checkList.name}</h3>
          <p>{moment().format('ddd DD/MMM/YYYY')} | รอบ: {this.props.round}</p>
        </div>
        <div className="col-11">
          {
            this.state.checkListItems.map((x, i) => (
            <EachCheckListItem refresh={this.refresh} user={this.props.user} checkListItem={x} round={this.props.round} index={i} checkListRecord={x.record}  />
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


    createCheckListRecord({
      round: this.props.round,
      createBy: this.props.user.username,
      checkListItemId: this.props.checkListItem.id,
      isPass: action === 'pass',
      remark: this.state.remark,
      fileObject: this.state.fileObject
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        if(action === 'failNReport'){
          //TODO Send Create new Job
        }
        this.props.refresh()
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
                  <button style={btnStlye} className="btn btn-warning w-100">ไม่ผ่าน + แจ้งซ่อม</button>
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

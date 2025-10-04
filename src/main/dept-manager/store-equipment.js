import React from 'react'
import { faCamera, faDrumstickBite, faUserFriends, faGavel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getEquipmentByStoreId,
  updateEquipmentStatus,
  uploadEquipmentImage
} from './tunnel'
import moment from 'moment'
import { IP } from './../../constanst'

export default class Equipment extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      equipmentList: []
    }
  }

  componentDidMount(){
    getEquipmentByStoreId({
      storeId: this.props.storeId
    }, res => {
      if(res.status){
        this.setState(() => ({
          equipmentList: res.equipmentList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  updateEquipmentStatus = e => {
    const id = e.target.id
    updateEquipmentStatus({
      status: 'ชำรุจ',
      equipmentId: id,
      departmentId: this.props.storeId
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }

  uploadEquipmentImage = e =>{
    const imageFile = e.target.files[0]
    const equipmentId = e.target.id
    const storeId = this.props.user.storeId
    console.log(equipmentId);
    uploadEquipmentImage({
      imageFile,
      equipmentId,
      storeId
    }, res => {
      if(res.status){
        alert('รูปภาพถูกอัพโหลดแล้ว')
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }

  // <div className="card" style={{width: '18rem'}}>
  //   <img
  //     className="card-img-top"
  //     height="220" width="220"
  //     src={
  //       x.imageUrl !== null ?
  //        IP + '/public/equipments/' + x.imageUrl :
  //         IP + '/public/equipments/equipment-default.png'
  //       }
  //     alt="Card image cap" />
  //   <div className="card-body">
  //     <h5 className="card-title">{x.name}</h5>
  //     <p className="card-text">เริ่มใช้งาน: {moment(x.timestamp).format('DD/MM/YYYY')}</p>
  //     <p className="card-text">สถาณะ: <b>{x.status}</b></p>
  //     <div className="row">
  //       <div className="col-2 mx-3">
  //         <label for="uploadEquipmentImage" className="btn btn-primary">
  //           <FontAwesomeIcon size='1x' icon={faCamera} />
  //         </label>
  //         <input style={{display: 'none'}} id='uploadEquipmentImage' name={x.id} type="file" onChange={this.uploadEquipmentImage} />
  //       </div>
  //       {
  //         x.status === 'ใช้งาน' &&
  //         <div className="col-2 mx-3">
  //           <a onClick={this.updateEquipmentStatus} id={x.id} className="btn btn-danger">เสีย</a>
  //         </div>
  //       }
  //     </div>
  //   </div>
  // </div>

  render(){
    return (
      <div className="col-12">
        <div className="row">
          {
            this.state.equipmentList.map(x => (
              <div className="col-md-3 col-5 mx-1 container-t">
                <div className="row">
                  <div className='col-12 text-center'>
                    <img
                         className=""
                         width="120"
                         src={
                           x.imageUrl !== null ?
                            IP + '/public/equipments/' + x.imageUrl :
                             IP + '/public/equipments/equipment-default.png'
                           }
                         alt="Card image cap" />
                  </div>
                  <div className="col-12">
                    <h5>{x.name}</h5>
                    <p>เริ่มใช้งาน: {moment(x.timestamp).format('DD/MM/YYYY')}</p>
                      <p className="card-text">สถาณะ: <b>{x.status}</b></p>
                      <div className="row">
                        <div className="col-2 mx-3">
                          <label for={x.id} className="btn btn-primary">
                            <FontAwesomeIcon size='1x' icon={faCamera} />
                          </label>
                          <input style={{display: 'none'}} id={x.id} type="file" onChange={this.uploadEquipmentImage} />
                        </div>
                        {
                          x.status === 'ใช้งาน' &&
                          <div className="col-2 mx-3">
                            <a onClick={this.updateEquipmentStatus} id={x.id} className="btn btn-danger">เสีย</a>
                          </div>
                        }
                      </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

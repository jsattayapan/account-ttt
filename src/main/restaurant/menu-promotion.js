import React from 'react'
import ImageResize from 'image-resize';
import {
  getMenuPromotions,
  uploadPromotionImage,
  movePromotionOrder,
  removePromotionOnServer,
  updatePromotionVisibleOnsServer
} from './tunnel'
import {IP} from './../../constanst'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class MenuPromotion extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      promotions: [],
      title: '',
      file: ''
    }
  }

  componentDidMount(){
    getMenuPromotions(res => {
      if(res.status){
        this.setState(() => ({
          promotions: res.promotions.sort((a,b) => a.orderNumber - b.orderNumber)
        }))
      }else{
        alert('ไม่สามารถโหลดรูปโปรโมชั่นอาหารได้')
      }
    })
  }

  uploadImageUrl = e => {
    const imageFile = e.target.files[0]
    const name = e.target.files[0].name
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
    imageResize.play(URL.createObjectURL(imageFile)).then(res => {
      let file = dataURLtoFile(res,name)
      console.log(file);
      this.setState(() => ({
        file
      }))
    })
  }

  titleChange = e => {
    const value = e.target.value
    this.setState(() => ({title: value}))
  }

  submitImage = () => {
    const title = this.state.title
    const file = this.state.file
    uploadPromotionImage({title, file}, res => {
      if(res.status){
        this.setState(() => ({
          title: '',
          file: ''
        }))
        this.componentDidMount()
      }else{
        alert('Upload รูป Promotion ไม่สำเร็จ')
      }
    })
  }

  moveToFront = (id, orderNumber) => {
    const isFirst = this.state.promotions.filter(x => x.id !== id).reduce((result, pro) => {
      if(pro.orderNumber < orderNumber){
        return false
      }
      return result
    }, true)
    if(!isFirst){
      movePromotionOrder({id, orderNumber, type: 'toFront'}, res => {
        if(res.status){
          this.componentDidMount()
        }else{
          alert('ไม่สามารถเลื่อนตำแหน่งโปรโมชั่นได้')
        }
      })
    }
  }

  moveToBack = (id, orderNumber) => {
    const isFirst = this.state.promotions.filter(x => x.id !== id).reduce((result, pro) => {
      if(pro.orderNumber > orderNumber){
        return false
      }
      return result
    }, true)
    if(!isFirst){
      movePromotionOrder({id, orderNumber, type: 'toBack'}, res => {
        if(res.status){
          this.componentDidMount()
        }else{
          alert('ไม่สามารถเลื่อนตำแหน่งโปรโมชั่นได้')
        }
      })
    }
  }

  removePromotion = (id) => {
    removePromotionOnServer({id}, res => {
      if(res.status){
        this.componentDidMount()
      }else{
        alert('ไม่สามารถลบโปรโมชั่นนี้ได้')
      }
    })
  }

  updatePromotionVisible = (id, visible) => {
    updatePromotionVisibleOnsServer({id, visible}, res => {
      if(res.status){
        this.componentDidMount()
      }else{
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      }
    })
  }

  render() {
    return (
      <div className="row justify-content-around">
        <div className="col-12">
          <h3>Menu Promotions</h3>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-4 mb-3">
              <div>
                <label className="label-control">Title: </label>
              <input value={this.state.title}
                onChange={this.titleChange}
                 type="text" className="form-control" />
              </div>
              <div>
                <label className="label-control">File รูป: </label>
              <input type="file" accept="image/*" onChange={this.uploadImageUrl} />
              </div>
              <button onClick={this.submitImage} className="btn btn-success" disabled={this.state.file === '' || this.state.title === ''}>Upload</button>
          </div>
          </div>
        </div>
        {
          this.state.promotions.map(pro => (
            <div className="col-3 mb-3">
              <img src={`${IP}/public/storagePromotionImage/${pro.imageUrl}`}
              width="100%" />
            <h5>{pro.orderNumber}. {pro.title} {
              pro.visible ? <span onClick={() => this.updatePromotionVisible(pro.id, false)}><FontAwesomeIcon icon={faEye} size='1x' /></span> : <span onClick={() => this.updatePromotionVisible(pro.id, true)}><FontAwesomeIcon icon={faEyeSlash} size='1x' /></span>
            }</h5>
          <button onClick={() => this.moveToFront(pro.id, pro.orderNumber)} className="btn btn-success">{'<'}</button>
        <button onClick={() => this.removePromotion(pro.id)} className="btn btn-danger">ลบ</button>
      <button onClick={() => this.moveToBack(pro.id, pro.orderNumber)} className="btn btn-success">{'>'}</button>
            </div>
          ))
        }
      </div>
    )
  }
}

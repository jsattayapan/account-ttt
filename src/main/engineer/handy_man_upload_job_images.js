import React from 'react'
import ImageResize from 'image-resize';
import  { getJobDetailById, submitImagesToJob } from './../dept-manager/tunnel'

export default class HandyManUploadJobImages extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      imageList: [],
      showFinish: false
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

  removeImage = url => {
    let imageList = this.state.imageList.filter(x => x.url !== url)
    this.setState(() => ({
      imageList
    }))
  }

  submit = () => {
    submitImagesToJob({jobId: this.props.jobId, employeeId: this.props.employeeId, imageList: this.state.imageList.map(x => x.file)}, res => {
      if(res.status){
        this.setState(() => ({
          showFinish: true
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return(
      <div className="container">
        {!this.state.showFinish ? <div className='row'>
          <div className="col-12 p-3">
          </div>
          <div className="col-12 mt-3">
              <button className="btn btn-info btn-block">
                <label for="imageBtn">
                เลือกรูป
                </label>
              </button>
            <input onChange={this.imageOnChange} style={{display: 'none'}} id="imageBtn"type="file" />
          </div>
          {
            this.state.imageList.map(x => (
              <div className="col-12 col-md-3 md-3">
                <button onClick={() => this.removeImage(x.url)} className='btn btn-danger'>x</button>
                <img src={x.url} width='300'/>
              </div>
            ))
          }
          <div className="col-12 mt-3">
            <button onClick={this.submit} className="btn btn-success btn-block" disabled={!this.state.imageList.length}>
              บันทึก
            </button>
          </div>
      </div>:
      <div className="row">
        <div className="col-12">
          <h3>รูปถูกบันทึก</h3>
        </div>
      </div>
    }
    </div>
    )
  }
}

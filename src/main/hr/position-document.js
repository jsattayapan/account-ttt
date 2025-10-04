import React from 'react'
import Swal from 'sweetalert2'
import Select from 'react-select'
import  {
  submitPositionDocument,
  getPositionDocuments,
  getPositions,
  getDepartments,
  insertDocumentPositionLink,
} from './tunnel'

export default class PositionDocument extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      page: 'main',
      file: '',
      title: '',
      type: '',
      documentList: [],
      positionList: [],
      departmentList: []
    }
  }

  componentDidMount(){
    getPositionDocuments(res => {
      if(res.status){
        console.log(res.documentList[0]);
        this.setState(() => ({
          documentList: res.documentList
        }))
      }
    })

    getPositions(res => {
      if(res.status){
        this.setState(() => ({
          positionList: res.positionList
        }))
        console.log(res.positionList);
      }else{
        console.log(res.msg);
      }
    })
    getDepartments(res => {
      if(res.status){
        this.setState(() => ({
          departmentList: res.departments
        }))
      }
    })
  }

  textOnChange = e => {
    const { name, value } = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  fileOnChange = e => {
    let { files } = e.target
    this.setState(() => ({
      file: files[0]
    }))
  }

  submitNewDocument = () => {
    const { file, title, type } = this.state
    if(title.trim() === ''){
      alert('กรุณาใส่ชื่อเอกสาร')
      return
    }
    if(file === ''){
      alert('กรุณาเลือกเอกสาร')
      return
    }
    if(type === ''){
      alert('กรุณาเลือกประเภท')
      return
    }

    submitPositionDocument({title, file}, res => {
      if(res.status){
        alert('Upload Completed!')
      }else{
        console.log(res);
        alert('Failed to upload!')
      }
    })
  }


  linkDocumentToPosition(id, linkedPosition){
    const {departmentList, positionList} = this.state
    let filteredPosition = []
    positionList.forEach((pos) => {
      let found = linkedPosition.filter(x => x.positionId === pos.id)
      if(found.length === 0){
        filteredPosition = [ ...filteredPosition, {id: pos.id, name: pos.name, departmentId: pos.departmentId} ]
      }
    });

    const options = departmentList.reduce((result, dept) => {
      result[dept.name] = filteredPosition.filter(x => x.departmentId === dept.id).reduce((bg, x) => {
        bg[x.id] = x.name
        return bg
      }, {})
      return result
    }, {})

    Swal.fire({
  title: 'เลือกตำแหน่ง',
  input: 'select',
  inputOptions: options,
  inputPlaceholder: 'required',
  showCancelButton: true,
  inputValidator: function (value) {
    return new Promise(function (resolve, reject) {
      if (value !== '') {
        resolve();
      } else {
        resolve('กรุณาเลือกตำแหน่ง');
      }
    });
  }
}).then(result => {
  if(result.isConfirmed){
    let positionId = result.value
    insertDocumentPositionLink({positionId, jobDocumentId: id}, res => {
      if(res.status){
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }
  })
  }

  typeOnChange = e => {
    this.setState(() => ({
      type: e.value
    }))
  };

  openDocument = (path) => {
   let uri = `https://tunit3-samed.ap.ngrok.io/public/storagePositionDocument/${path}`
   window.open(uri, "_blank");
 }

  render(){
    const state = this.state
    const typeOptions = [
      {label: 'คู่มือทำงาน', value: 'คู่มือทำงาน'},
      {label: 'ข้อมูลทั่วไป', value: 'ข้อมูลทั่วไป'},
    ]

    

    return (
      <div>
        
        <div className="col-12 border py-3">

<div classname="form-group">
  <label>ชื่อเอกสาร</label>
  <input name="title" onChange={this.textOnChange} value={state.title}  type='text' />
</div>
<br />
<div classname="form-group">
  <label>เลือกไฟล์</label>
  <input onChange={this.fileOnChange} className="my-3 input-control  d-block" type='file' accept="image/*, application/pdf" />
</div>
<div classname="form-group">
  <label>เลือกประเภท</label>
  <Select onChange={this.typeOnChange} options={typeOptions} />
</div>
<button onClick={this.submitNewDocument} className="btn btn-success mt-3">Upload</button>
</div>
<div className="col-12">
<br />
<h3>Document</h3>
<table className="table table-bordered">
  <thead>
    <tr>
      <th>ID</th>
      <th>Title</th>
      <th>Positions Links</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {
      state.documentList.map(x => (
        <tr>
          <td>{x.id}</td>
          <td><span onClick={() => this.openDocument(x.filename)}>{x.title}</span></td>
          <td>{x.documentPosition.map(y => <button className="btn btn-sm btn-dark">{y.name}</button>)}</td>
          <td><button onClick={() => this.linkDocumentToPosition(x. id, x.documentPosition)} className="btn mx-2 btn-sm btn-info">Add Position</button><button className="btn btn-sm btn-danger">Delete</button></td>
        </tr>
      ))
    }
  </tbody>
</table>
</div>
       </div>)
}
}




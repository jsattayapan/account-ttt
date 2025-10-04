import React from 'react'
import { BottomNav } from './index.js'
import { newIssueReport } from './tunnel'
import {faUndoAlt, faHome} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

export default class ProblemReportView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      type: 'fix',
      title: '',
      text: ''
    }
  }

  changeType = type => {
    this.setState(() => ({type}))
  }

  textOnChange = e => {
    let {name, value} = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  submit = () => {
    let { title, text } = this.state
    let { employeeId } = this.props
    console.log(title, text, employeeId);
    if(title.trim() === '' || text.trim() === ''){
      Swal.fire({
        title: 'กรุณาระบุห้วข้อ/รายละเอียด',
        icon: 'error'
      })
      return
    }
    newIssueReport({title, text, employeeId}, res => {
      if(res.status){
        Swal.fire({
          title: 'ข้อเรียกร้องถูกส่งแล้ว',
          text: 'รอการตรวจสอบ',
          icon: 'success'
        })
        this.props.changePage('main')
      }else{
        console.log(res);
        Swal.fire({
          title: res.msg,
          icon: 'error'
        })
      }
    })
  }

  render(){
    let { title, text } = this.state
    return(
      <div className='row'>
        <h3>แจ้งปัญหา</h3>
          <div className="col-12">
            <div className="d-flex flex-column">
              <label className="label-control mt-4">หัวข้อ:</label>
              <input name='title' value={title} onChange={this.textOnChange} className="form-control mt-3" />
                <label className="label-control mt-4">รายละเอียด:</label>
                <textarea name='text' onChange={this.textOnChange} style={{height: '200px'}} className="form-control mt-3"></textarea>
            </div>
          </div>
          <div style={{height:'250px', width: '50px'}}>

          </div>
          <BottomNav
            icon1='ส่ง'
            icon2={faUndoAlt}
            onClick1={this.submit}
            onClick2={() => this.props.changePage('main')}
             />
      </div>
    )
  }
}

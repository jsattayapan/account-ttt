import React from 'react'
import moment from 'moment'
import { CreateNewJob } from './eng-jobs-management'

import { getBuildingsAndProperties, getJobs } from './tunnel'


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

export default class ManagerJobReporter extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      jobList: []
    }
  }

  componentDidMount(){
    getJobs(res => {
      if(res.status){
        console.log(res.jobList);
        let jobList = res.jobList.sort((a, b) => b.timestamp - a.timestamp)
        this.setState(() =>({
          jobList
        }))
      }else{
        alert(res.msg)
      }
    })
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
console.log(this.props.user);
console.log(this.state.jobList);

    return (
      <div className="row">
        <CreateNewJob reloadJobList={this.reloadJobList} user={this.props.user} />
      <div className="col-12">
        <div className="row">
          {
            this.state.jobList.sort((a, b) => {return b.timestamp > a.timestamp ? 1:-1}).filter(x => {
              if(x.createBy === null){
                return false
              }
              return x.createBy.username === this.props.user.username
            }).map(x =>
              <div className="col-md-4 col-12 mx-2 my-2 menuBarBtn">
                <div className="row">
                  <div className="col-12">
                    สร้างเมื่อ: {moment(x.timestamp).format('DD/MM/YYYY')}
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    Id: <b>{x.id}</b>
                  </div>
                  <div className="col-6">
                    สถาณะ: <b style={getStatusStyle(x.status)}>{x.status}</b>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">ประเภท: {x.type}</div>
                </div>
                <div className="row">
                  <div className="col-12">รายละเอียด: {x.detail}</div>
                </div>
                <div className="row">
                  {
                    (x.type === 'งานภายนอกอาคาร' || x.type === 'งานภายนอกอาคาร' || x.type === 'งานภายนอกอาคาร' || x.type === 'ซ่อมอุปกรณ์') &&
                    <div className="col-12">สถานที่: {x.location}</div>
                  }
                  {
                    x.type === 'งานภายในอาคาร' &&
                    <div className="col-12">อาคาร: {x.building.name}</div>
                  }
                  {
                    x.type === 'งานภายในห้องพัก' &&
                    <div className="col-6">อาคาร: {x.building.name}</div>
                  }
                  {
                    x.type === 'งานภายในห้องพัก' &&
                    <div className="col-6">ห้อง: {x.property ? x.property.name : 'ไม่พบข้อมูล'}</div>
                  }
                </div>
              </div>
            )
          }
        </div>
      </div>
      </div>
    )
  }
}

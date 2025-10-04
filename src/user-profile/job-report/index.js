import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronCircleLeft, faChevronCircleRight, faUndoAlt
  } from '@fortawesome/free-solid-svg-icons'

import {
    JOB_OWN_PERMISSION,
    getJobs,
    getBuildingsAndProperties,
    getJobsByCreateBy,
    submitNewJob
  } from './../tunnel'
import { BottomNav } from './../index.js'

import SubJobList from './sub-job-list'
import SubJobListDetail from './sub-job-list-detail'
import JobListView from './job-list-view'
import CreateNewJob from './create-new-job'

export default class JobReportView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'working',
      currentMonth: new Date,
      buildingList: [],
      roomList: [],
      jobList: [],
      allJoblList: []
    }
  }

  componentDidMount(){
    getJobs(res => {
      if(res.status){
        let jobList = res.jobList
        if(this.props.verify(JOB_OWN_PERMISSION)){
          jobList = jobList.filter(x => x.createBy.id === this.props.employeeId)
        }
        let result = this.reformatJobList(jobList)
        console.log(result);
        result = result.filter(x => (moment(x.timestamp).isSame(moment(this.state.currentMonth, 'month'))))
        this.setState(() => ({
          jobList: result,
          allJoblList: jobList
        }))
      }
    })
    getBuildingsAndProperties(res => {
      if(res.status){
        this.setState(() => ({
          roomList: res.propertyList,
          buildingList: res.buildingList,
          buildingId: res.buildingList[0].id
        }))
      }
    })
  }

  reformatJobList = list => {
    let result = []
    list.forEach((job) => {
      if(job.type === 'งานภายในห้องพัก'){
        let found = result.filter(x => (x.propertyId === job.propertyId && x.type === 'งานภายในห้องพัก' ))
        if(found.length !== 0){
          let oldJob = found[0]
          let oldList = oldJob.jobList
          let payload = {
            ...oldJob, jobList: [job, oldList]
          }
          let noneLeft = result.filter(x => !(x.propertyId === job.propertyId && x.type === 'งานภายในห้องพัก' ))
          result = [ ...noneLeft, payload]
        } else {
          result = [ ...result, {
            propertyId: job.propertyId,
            buildingName: job.building.name,
            propertyName: job.property.name,
            type: job.type,
            jobList: [job]
          }]
        }
      } else if(job.type === 'งานภายในอาคาร'){
        let found = result.filter(x => (x.buildingId === job.buildingId && x.type === 'งานภายในอาคาร' ))
        if(found.length !== 0){
          let oldJob = found[0]
          let oldList = oldJob.jobList
          let payload = {
            ...oldJob, jobList: [job, oldList]
          }
          let noneLeft = result.filter(x => !(x.buildingId === job.buildingId && x.type === 'งานภายในอาคาร' ))
          result = [ ...noneLeft, payload]
        } else {
          result = [ ...result, {
            buildingId: job.buildingId,
            buildingName: job.building.name,
            type: job.type,
            jobList: [job]
          }]
        }
      } else {
        result = [ ...result, job ]
      }

    });

    return result
  }

  monthOnChange = (input) => {
    let {currentMonth, allJoblList} = this.state
    let { employeeId } = this.props
    if(input){
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }else{
      currentMonth.setMonth(currentMonth.getMonth() - 1)
    }

    let result = allJoblList.filter(x => {
      return moment(x.timestamp).isSame(moment(currentMonth), 'month')
    })
    result = this.reformatJobList(result)
    this.setState(() => ({
      currentMonth,
      jobList: result
    }))
  }

  changePage = page => {
    if(page === 'main'){
      this.props.changePage('main')
    }else{
      this.setState(() => ({
        currentPage: page
      }))
    }
  }

  render(){
    let  { currentPage, allJoblList } = this.state
    let workingJobList = allJoblList.filter(x => x.status === 'กำลังทำ')
    workingJobList = this.reformatJobList(workingJobList)
    return (
      currentPage !== 'createNewJob' ?
      <div className="row">
        <div className="col-12">
          <h3>รายงานซ่อม</h3>
        </div>
        <div className="col-12">
          <div onClick={() => this.changePage('working')} className={`${currentPage !== 'working' ? 'sub-menu-item' : 'sub-menu-item-check'}`}>
            Working
          </div>
          <div onClick={() => this.changePage('assign')} className={`${currentPage !== 'assign' ? 'sub-menu-item' : 'sub-menu-item-check'}`}>
            Assigned
          </div>
          <div onClick={() => this.changePage('list')} className={`${currentPage !== 'list' ? 'sub-menu-item' : 'sub-menu-item-check'}`}>
            Others
          </div>
          <div onClick={() => this.changePage('room')} className={`${currentPage !== 'room' ? 'sub-menu-item' : 'sub-menu-item-check'}`}>
            Room
          </div>
        </div>
        {
          currentPage === 'list' &&
          <div>
            <div className="d-flex flex-row justify-content-center mt-4">
              <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(false)} color="#f2c66f" icon={faChevronCircleLeft} />
              <span id="month-title">
                {moment(this.state.currentMonth).format('MMMM')}
              </span>
              <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(true)} color="#f2c66f" icon={faChevronCircleRight} />
            </div>
            <div className="d-flex flex-row justify-content-center mt-4">
              <table style={{color: 'white', fontSize: '13px'}} className="table">
                <tbody>
                  {
                    this.state.jobList.map(x => {
                      let htmlCode = ''
                      if(x.type === 'งานภายในอาคาร' || x.type === 'งานภายในห้องพัก'){
                        htmlCode =
                         <SubJobList job={x} />
                      } else {
                        htmlCode =
                        <SubJobListDetail job={x} />
                      }
                      return htmlCode

                    })
                  }
                </tbody>
              </table>
            </div>
            <BottomNav
              icon1='รายงานใหม่'
              icon2={faUndoAlt}
              onClick1={() => this.changePage('createNewJob')}
              onClick2={() => this.changePage('main')}
               />
          </div>
        }


        {
          currentPage === 'working' &&
          <JobListView
            jobList={workingJobList}
            changePage={this.changePage}
             />
        }

        {
          currentPage === 'room' &&
          <div>
            <div className="d-flex flex-row justify-content-center mt-4">
            </div>
            <div className="d-flex flex-column mb-3 pb-3">
                {
                  this.state.buildingList.map(x => (
                    <div>
                    <p className="py-2 pl-2 text-center" style={{color: 'white'}}><u>{x.name}</u></p>
                    <div className="room-selection-building">
                      {this.state.roomList.filter(y => y.buildingId === x.id).map(room => (
                        <div className="room-item">
                          {room.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  ))
                }
            </div>
            <BottomNav
              icon1='รายงานใหม่'
              icon2={faUndoAlt}
              onClick1={() => this.changePage('createNewJob')}
              onClick2={() => this.props.changePage('main')}
               />
          </div>
        }

      </div>:
      <CreateNewJob
        employeeId={this.props.employeeId} changePage={this.changePage}
         />

    )
  }
}

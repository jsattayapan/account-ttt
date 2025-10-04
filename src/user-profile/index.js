import React from 'react'

import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import numeral from 'numeral'

import ProfileView from './profile-view'
import TimetableView from './timetable-view'
import SalaryView from './salary-view'
import JobReportView from './job-report'
import ProblemReportView from './problem-report-view'
import JobDescription from './job-description/main'


import {
  faChevronCircleRight, faChevronCircleLeft, faArrowUp, faArrowDown,faUsersCog,
  faBuilding, faSave, faCloudSun, faBed,faExclamationTriangle, faCoffee, faUndoAlt,
  faUser, faCalendarAlt, faHome, faTools, faFileInvoiceDollar,faBullhorn, faPencilAlt, faLocationArrow,faChevronDown
 } from '@fortawesome/free-solid-svg-icons'

import { IP, REPORT_JOB_PERMISSION,
  getEmployeeProfileByLineId,
} from './tunnel'

export default class UserProfile extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      page: 'main',
      name: '',
      id: '',
      imageUrl: 'person.png',
      department: '',
      role: '',
      phone: '',
      startJob: '',
      workingTimeText: '',
      pagePermission: []
    }
  }

  componentDidMount(){
    getEmployeeProfileByLineId({id: this.props.id}, res => {
      if(res.status){
        this.setState(() => (res.employee))
        console.log(res.employee);
      }else{
        // window.location.replace("http://192.168.100.32:3000/");
        Swal.fire({
          'title': res.msg,
          'icon': 'danger',
          color: 'white',
          background: '#333',
          confirmButtonText: 'ปิด',
        })
      }
    })
  }

  changePage = page => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.setState(() => ({
      page
    }))
  }

  verify = pageId => {
    let found = this.state.pagePermission.filter(x => x.pageId === pageId)
    if(found.length === 0){
      return false
    }else{
      return true
    }
  }

  render(){


    return (
      <div className="container-fluid user-profile-container pt-4">
        {
          this.state.page === 'main' &&
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <div className="profile-block">
                <div className="block-item">
                  <img id="profile-image" src={`${IP}/public/employee/${this.state.imageUrl !== null ? this.state.imageUrl : 'person.png'}`} width="60px" height="60px" />
                </div>
                <div className="block-item name-info">
                  <p id="name">{this.state.name}</p>
                  <p>ID: {this.state.id}</p>
                </div>
                <div className="block-item">
                  <div onClick={() => this.changePage('profile')} className="profile-btn">
                    ดูข้อมูลส่วนตัว
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <div className="circle-head">
                <p>เวลาสะสม</p>
                <p>{this.state.workingTimeText}</p>
                <p id="lastest-update-time"><FontAwesomeIcon icon={faUndoAlt} /> {moment().format('hh:mm A')}</p>
              </div>
            </div>
          </div>
          <div className="main-menu mt-4">
            <div onClick={() => this.changePage('timetable')} className="menu-item">
              <FontAwesomeIcon size="2x" icon={faCalendarAlt} />
              <p class="menu-item-sub">ตารางาน</p>
            </div>
            <div onClick={() => this.changePage('SalaryView')} className="menu-item">
              <FontAwesomeIcon size="2x" icon={faFileInvoiceDollar} />
              <p class="menu-item-sub">สลิปเงินเดือน</p>
            </div>
            { this.verify(REPORT_JOB_PERMISSION) ? <div onClick={() => this.changePage('jobReport')} className="menu-item">
              <FontAwesomeIcon size="2x" icon={faTools} />
              <p class="menu-item-sub">แจ้งซ่อม</p>
            </div> : <div className="menu-item">
            </div>}
          </div>
          <div className="main-menu mt-4">
            <div className="menu-item">
            </div>
            <div onClick={() => this.changePage('problemReport')} className="menu-item">
              <FontAwesomeIcon size="2x" icon={faExclamationTriangle} />
              <p class="menu-item-sub">แจ้งปัญหา</p>
            </div>
            <div className="menu-item">
              {
              //   <FontAwesomeIcon size="2x" icon={faBullhorn} />
              // <p class="menu-item-sub">ข่าวสาร</p>
            }
            </div>
          </div>
          <div style={{height:'180px', width: '50px'}}>

          </div>
        </div>
        }
        {
          this.state.page === 'profile' && <ProfileView
          id={this.state.id}
          name={this.state.name}
          phone={this.state.phone}
          imageUrl={this.state.imageUrl}
          department={this.state.department}
          role={this.state.role}
          startJob={this.state.startJob}
          jobDescription={this.state.jobDescription.description !== null}
          changePage={this.changePage} />
        }
        {
          this.state.page === 'timetable' && <TimetableView employeeId={this.state.id} changePage={this.changePage} />

        }
        {
          this.state.page === 'SalaryView' && <SalaryView changePage={this.changePage} lineId={this.state.lineId} employeeId={this.state.id} />
        }
        {
          this.state.page === 'jobReport' && <JobReportView verify={this.verify} employeeId={this.state.id} changePage={this.changePage} />
        }
        {
          this.state.page === 'problemReport' && <ProblemReportView employeeId={this.state.id} changePage={this.changePage} />
        }
        {
          (this.state.page === 'jobDescription' && this.state.id !== '') && <JobDescription employee={this.state} changePage={this.changePage} />
        }
      </div>
    )
  }

}

export const BottomNav = props => (
  <nav className="navbar fixed-bottom navbar-dark bg-dark justify-content-around text-center">
    {
      typeof props.icon1 === 'string' ?
      <span onClick={props.onClick1} style={{color: '#f2c66f'}}>{props.icon1}</span>
      :   <span className="navbar-brand"><FontAwesomeIcon color={props.icon1 === null ? '#212529' : '#fff'} onClick={props.onClick1}  icon={props.icon1} /></span>
    }

    <span className="navbar-brand"><FontAwesomeIcon onClick={props.onClick2} icon={props.icon2} /></span>
  </nav>
)

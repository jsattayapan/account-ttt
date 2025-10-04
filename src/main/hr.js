import React from 'react'
import { StaffTimetable } from './hr/staff-timetable'
import { StaffList } from './hr/staff-list.js'
import StaffTimetableDaily from './hr/staff-timetable-daily'
import StaffTimetableByDate from './hr/staff-timetable-by-date.js'
import WorkingHour from './hr/working-hour.js'
import Dormitory from './hr/dormitory.js'


import { SubMenuComponent } from './view-props'



export class HrFingerScanAnalysis extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'รายชื่อพนักงาน',
      resultImport: []
    }
  }
  changePage = page => {
    this.setState(() => ({currentPage: page }))
  }
  render(){
    const menuDisplays = [
      'รายชื่อพนักงาน',
      'ตารางงาน',
      'ตารางเวลา',
      'ตารางเวลารายวัน',
      'สรุปเวลาทำงาน',
      'หอพักพนักงาน'
    ]
    return(
      <div className="row">
        <SubMenuComponent name='Hr' currentPage={this.state.currentPage} menuDisplays={menuDisplays} changePage={this.changePage} />
        <div className="col-12">
          {
            this.state.currentPage === 'ตารางงาน' && <StaffTimetable />
          }
          {
            this.state.currentPage === 'รายชื่อพนักงาน' && <StaffList user={this.props.user} />
          }
          {
            this.state.currentPage === 'ตารางเวลา' && <StaffTimetableDaily user={this.props.user} />
          }
          {
            this.state.currentPage === 'ตารางเวลารายวัน' && <StaffTimetableByDate user={this.props.user} />
          }
          {
            this.state.currentPage === 'สรุปเวลาทำงาน' && <WorkingHour user={this.props.user} />
          }
          {
            this.state.currentPage === 'หอพักพนักงาน' && <Dormitory user={this.props.user} />
          }

        </div>
      </div>
    )
  }
}

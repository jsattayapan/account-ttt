import React from 'react'
import StaffTimetableManager from './dept-manager/staff-timetable'
import KitchenStoreManagement from './dept-manager/kt-store-management'
import EngineerJobsManagement from './dept-manager/eng-jobs-management'
import EngineerBuildingProperty from './dept-manager/eng-building-property'
import StoreManagement from './dept-manager/store-manual'
import ManagerJobReporter from './dept-manager/manager-job-reporter'
import CheckListPage from './checkList/empCheckListPage'
import { getCheckList } from './checkList/tunnel'

export class DeptManager extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'ตารางงานพนักงาน',
      resultImport: [],
      showCheckList: false
    }
  }
  componentDidMount(){
    getCheckList(res => {
      if(res.status){
        console.log(res);
        const foundCheckList = res.checkLists.filter(x => x.departmentId === this.props.user.departmentManagerId)
        console.log(this.props.user.departmentManagerId);
        if(foundCheckList.length){
          this.setState(() => ({
            showCheckList: true
          }))
        }
      }
    })
  }
  render(){
    return(
      <div className="row">
        <div className="col-12">
          <div className="row mb-5" style={{
              backgroundColor: '#33383E',
              marginTop: '-25px',
              display: 'flex'
            }}>
            <MenuItem currentPage={this.state.currentPage} onClick={() => this.setState(() => ({currentPage: 'ตารางงานพนักงาน'}))} name="ตารางงานพนักงาน" />
          <MenuItem currentPage={this.state.currentPage} onClick={() => this.setState(() => ({currentPage: 'แจ้งงานซ่อม'}))} name="แจ้งงานซ่อม" />
            {
              this.props.user.position === 'FULL' && <MenuItem currentPage={this.state.currentPage} onClick={() => this.setState(() => ({currentPage: 'Stock ในแผนก'}))} name="Stock ในแผนก" />
            }
            {
              this.props.user.position === 'FULL' && <MenuItem currentPage={this.state.currentPage} onClick={() => this.setState(() => ({currentPage: 'งานในแผนกช่าง'}))} name="งานในแผนกช่าง" />
            }
            {
              this.props.user.position === 'FULL' && <MenuItem currentPage={this.state.currentPage} onClick={() => this.setState(() => ({currentPage: 'อาคารและห้อง'}))} name="อาคารและห้อง" />
            }
            {
              this.props.user.position === 'FULL' && <MenuItem currentPage={this.state.currentPage} onClick={() => this.setState(() => ({currentPage: 'จัดการ Stock'}))} name="จัดการ Stock" />
            }

            {
              this.props.user.departmentManagerId === 'uyw83ikfozqhp8' && <MenuItem currentPage={this.state.currentPage} onClick={() => this.setState(() => ({currentPage: 'งานในแผนกช่าง'}))} name="งานในแผนกช่าง" />
            }
            {
              this.props.user.departmentManagerId === 'uyw83ikfozqhp8' && <MenuItem currentPage={this.state.currentPage} onClick={() => this.setState(() => ({currentPage: 'อาคารและห้อง'}))} name="อาคารและห้อง" />
            }
            {
              this.state.showCheckList && <MenuItem currentPage={this.state.currentPage} onClick={() => this.setState(() => ({currentPage: 'Check List'}))} name="Check List" />
            }


          </div>
        </div>
        <div className="col-12">
          {
            this.state.currentPage === 'ตารางงานพนักงาน' && <StaffTimetableManager user={this.props.user} />
          }

          {
            this.state.currentPage === 'Stock ในแผนก' && <KitchenStoreManagement user={this.props.user} />
          }
          {
            this.state.currentPage === 'งานในแผนกช่าง' && <EngineerJobsManagement user={this.props.user} />
          }
          {
            this.state.currentPage === 'อาคารและห้อง' && <EngineerBuildingProperty user={this.props.user} />
          }
          {
            this.state.currentPage === 'จัดการ Stock' && <StoreManagement user={this.props.user} />
          }
          {
            this.state.currentPage === 'แจ้งงานซ่อม' && <ManagerJobReporter user={this.props.user} />
          }
          {
            this.state.currentPage === 'Check List' && <CheckListPage user={this.props.user} />
          }
        </div>
      </div>
    )
  }
}



function MenuItem (props) {
  console.log(props.currentPage, props.name);
  return(
    <div onClick={props.onClick} className={`align-center ${props.currentPage === props.name ? 'menu-item-select' : 'menu-item'}`}>
    {props.name}
    </div>
  )
}

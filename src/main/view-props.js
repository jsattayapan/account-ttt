import React from 'react'
import logo from './../assets/logo.png'
import background from './../assets/background.jpg'
import Restaurant from './restaurant'
import StockView from './stock'
import ResortView from './resort'
import KitchenMain from './kitchenMain'
import HouseKeeping from './houseKeeping'
import Select from 'react-select'
import Boss from './boss/index'
import Dormitory from './hr/dormitory'
import EmployeeListForHr from './hr/employeeListForHr'
import StaffTimetableDaily from './hr/staff-timetable-daily'
import StaffTimetableByDate from './hr/staff-timetable-by-date'
import PositionDocument from './hr/position-document'
import PositionList from './hr/position-list'
import HRChecklist from './hr/hr-checklist'
import HRInspection from './hr/hr-inspection'
import HrAdmin from './hr/hr-admin/employeeListForHr'
import Salary from './hr/salaryView/view-container'





import {CheckList} from './checkList.js'

import { HrFingerScanAnalysis } from './hr.js'
import { Assets } from './assets.js'
import { DeptManager } from './dept-manager'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faPen, faUtensils, faShoppingCart, faHotel, faUserFriends, faTasks, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import { updateUserImage } from './tunnel'
import { IP } from './../constanst'

export default class ViewProps extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        currentPage: ''
      }
    }

    componentDidMount() {
      let position = this.props.user.position
      let departmentId = this.props.user.departmentManagerId
      if(departmentId){
        this.setState(() => ({currentPage: 'Head Of Department'}))
      }

      if(position === 'HR'){
        this.setState(() => ({currentPage: 'Human Resource Admin'}))
      }
      if(position === 'FULL' || position === 'A.C. Supervisor'){
        this.setState(() => ({currentPage: 'Human Resource Admin'}))
      }
      if(position === 'Reservation'){
        this.setState(() => ({currentPage: 'Resorts Report'}))
      }
    }

    changePage = (value) => {
      this.setState(()=> ({currentPage: value}))
    }

    imageOnChange = (event) => {
    updateUserImage({username: this.props.user.username, image: event.target.files[0]}, (data) => {
      if(data.status){
        alert('รูปโปรไฟล์อัพเดท')
      }else{
        alert(data.msg)
      }
    })
  }

    render(){
      return(
        <div className="row">
          <div className="col-12 col-md-2 d-none d-md-block d-sm-none text-center">
            <div className="row pt-5 pb-5"
              style={{
                color: 'white',
                background: `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${background})`,
                backgroundSize: 'cover',
                textShadow: '1px 1px #000000'
              }}
              >
              <div className="col-12 mb-3">
                <label for="imageChangeInput" className="fixIcon">
                  <FontAwesomeIcon title="แก้ไขข้อมูล" icon={faPen}  />
                </label>
                <input id="imageChangeInput" ref={this.fileUpload} type="file" onChange={this.imageOnChange} style={{display: 'none'}} />
              <img src={this.props.user.imageUrl !== null ? IP + '/public/uploads/' + this.props.user.imageUrl : IP + '/public/uploads/person.png'} className="personIcon" alt="Smiley face" height="120" width="120" />

              </div>
              <div className="col-12">
                <p><b>{this.props.user.first_name} {this.props.user.last_name}</b></p>
              </div>
              <div className="col-12">
                <p><b>{this.props.user.position}</b></p>
              </div>
              <div className="col-12">
                <button onClick={this.props.logout} className="btn btn-danger">ออกจากระบบ</button>
              </div>
            </div>
            {/* Accountant => Jep' Report & Purchase Report */}
          {
            (this.props.user.position === 'A.C. Supervisor' || this.props.user.position === 'FULL') &&
            <div>
            <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'ร้านเจี๊ยบ Report'} />
            <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Purcharse Report'} />
          </div>
          }

          {
            this.props.user.username === 'Ladawan' &&
            <div>
              <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Dorm'} />
            </div>
          }

          {
            this.props.user.position === 'HR' &&
            <div>
              <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Dorm'} />
              <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Human Resource Admin'} />
            <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'HR Inspection'} />
              <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Daily Schedule'} />
              <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Daily Scan Time'} />
              <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'PositionDocument'} />
              <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'PositionList'} />


            </div>
          }


          {/* Reservation => Room Report */}
          {
            (this.props.user.position === 'FULL' || this.props.user.position === 'Reservation' || this.props.user.position === 'A.C. Supervisor') &&
            <div>
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Resorts Report'} />
            </div>
          }

          { (this.props.user.position === 'FULL') &&
            <div>
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Hr'} />
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Human Resource Admin'} />
                
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Assets'} />
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Check List'} />
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Boss'} />
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'PositionDocument'} />
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'PositionList'} />
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'HR Checklist'} />
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'HR Inspection'} />
    
            </div>
          }

            { this.props.user.username === 'olotem321'  &&
            <div>
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Salary'} />
            </div>
          }

          { (this.props.user.position === 'Kitchen Admin' || this.props.user.position === 'FULL') &&
            <div>
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Kitchen'} />
            </div>
          }


          { (this.props.user.position === 'House Keeping Manager' || this.props.user.position === 'FULL') &&
            <div>
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'House Keeping'} />
            </div>
          }

          { /* Department Manager => Department's assets */ }
          {
            this.props.user.departmentManagerId &&
            <div>
                <MenuBar currentPage={this.state.currentPage} onClick={this.changePage} value={'Head Of Department'} />
            </div>
          }



          <div className="row pt-5">
            <div className="col-12 d-none d-md-block text-center logoImage">
              <img src={logo} height="120" width="120" />
            </div>
          </div>
          </div>

            <div className="col-12 pt-3 d-md-none d-sm-block text-center main-menu-mobile">
              <ul>
                {
                  (this.props.user.position === 'A.C. Supervisor' || this.props.user.position === 'FULL') &&
                  <li className={`${this.state.currentPage === 'ร้านเจี๊ยบ Report' ? 'main-menu-mobile-selected': ''}`} onClick={() => this.changePage('ร้านเจี๊ยบ Report')} ><FontAwesomeIcon icon={faUtensils} size='2x'/></li>
                }
                {
                  (this.props.user.position === 'A.C. Supervisor' || this.props.user.position === 'FULL') &&
                  <li className={`${this.state.currentPage === 'Purcharse Report' ? 'main-menu-mobile-selected': ''}`} onClick={() => this.changePage('Purcharse Report')} ><FontAwesomeIcon icon={faShoppingCart} size='2x'/></li>
                }
                {
                  (this.props.user.position === 'FULL' || this.props.user.position === 'Reservation' || this.props.user.position === 'Assistant to General Manager') &&
                  <li className={`${this.state.currentPage === 'Resorts Report' ? 'main-menu-mobile-selected': ''}`} onClick={() => this.changePage('Resorts Report')} ><FontAwesomeIcon icon={faHotel} size='2x'/></li>
                }
                {
                  (this.props.user.position === 'FULL') &&
                  <li className={`${this.state.currentPage === 'Hr' ? 'main-menu-mobile-selected': ''}`} onClick={() => this.changePage('Hr')} ><FontAwesomeIcon icon={faUserFriends} size='2x'/></li>
                }
                {
                  (this.props.user.position === 'FULL') &&
                  <li className={`${this.state.currentPage === 'Check List' ? 'main-menu-mobile-selected': ''}`} onClick={() => this.changePage('Check List')} ><FontAwesomeIcon icon={faCheckCircle} size='2x'/></li>
                }
                {
                  (this.props.user.position === 'FULL') &&
                  <li className={`${this.state.currentPage === 'Boss' ? 'main-menu-mobile-selected': ''}`} onClick={() => this.changePage('Boss')} ><FontAwesomeIcon icon={faShieldAlt} size='2x'/></li>
                }
                {
                  (this.props.user.position === 'Kitchen Admin' || this.props.user.position === 'FULL') &&
                  <li className={`${this.state.currentPage === 'Kitchen' ? 'main-menu-mobile-selected': ''}`} onClick={() => this.changePage('Kitchen')} ><FontAwesomeIcon icon={faUtensils} size='2x'/></li>
                }

                {
                  this.props.user.departmentManagerId &&
                  <li className={`${this.state.currentPage === 'Head Of Department' ? 'main-menu-mobile-selected': ''}`} onClick={() => this.changePage('Head Of Department')} ><FontAwesomeIcon icon={faTasks} size='2x'/></li>
                }
              </ul>
            </div>
          <div className="col-12 mx-auto col-md-10">
            <br />
          {this.state.currentPage === 'ร้านเจี๊ยบ Report' && <Restaurant user={this.props.user} />}
          {this.state.currentPage === 'Purcharse Report' && <StockView user={this.props.user} />}
          {this.state.currentPage === 'Resorts Report' && <ResortView user={this.props.user} />}
          {this.state.currentPage === 'Hr' && <HrFingerScanAnalysis user={this.props.user} />}
          {this.state.currentPage === 'Assets' && <Assets user={this.props.user} />}
          {this.state.currentPage === 'Head Of Department' && <DeptManager user={this.props.user} />}
          {this.state.currentPage === 'Kitchen' && <KitchenMain user={this.props.user} />}
          {this.state.currentPage === 'House Keeping' && <HouseKeeping user={this.props.user} />}
          {this.state.currentPage === 'Check List' && <CheckList user={this.props.user} />}
          {this.state.currentPage === 'Boss' && <Boss user={this.props.user} />}
          {this.state.currentPage === 'Dorm' && <Dormitory user={this.props.user} />}
          {this.state.currentPage === 'Human Resource' && <EmployeeListForHr user={this.props.user} />}

          {this.state.currentPage === 'Human Resource Admin' && <HrAdmin user={this.props.user} />}
          {this.state.currentPage === 'Daily Schedule' && <StaffTimetableDaily user={this.props.user} />}
          {this.state.currentPage === 'Daily Scan Time' && <StaffTimetableByDate user={this.props.user} />}
          {this.state.currentPage === 'PositionDocument' && <PositionDocument user={this.props.user} />}
          {this.state.currentPage === 'PositionList' && <PositionList user={this.props.user} />}
          {this.state.currentPage === 'HR Checklist' && <HRChecklist user={this.props.user} />}
          {this.state.currentPage === 'HR Inspection' && <HRInspection user={this.props.user} />}
            {this.state.currentPage === 'Salary' && <Salary user={this.props.user} />}



          </div>
        </div>
      )
    }
  }

  function MenuBar (props) {
    return(
      <div className={`row ${props.currentPage === props.value ? 'menuBarBtn-selected' : 'menuBarBtn'}`} onClick={() => props.onClick(props.value)}>
        <div className="col-12 text-center">
          {props.value}
        </div>
      </div>
    )
  }

  export function SubMenuComponent (props) {
    const { currentPage, menuDisplays, changePage, name } = props
    return (
      <div className="col-12">
        <div className="row mb-5 d-none d-md-flex" style={{
            backgroundColor: '#33383E',
            marginTop: '-25px'
          }}>
          {
            menuDisplays.map(x =>
              <MenuItem currentPage={currentPage} onClick={() => changePage(x)} name={x} />
            )
          }
        </div>
        <div className="row mb-5 d-md-none">
          <div className="col-12">
            <label className="label-control">{name}</label>
            <Select onChange={e => changePage(e.value)} options={menuDisplays.map(x => ({label: x, value: x}))} />
          </div>
        </div>
      </div>
    )
  }

  function MenuItem (props) {
    return(
      <div onClick={props.onClick} className={`align-center ${props.currentPage === props.name ? 'menu-item-select' : 'menu-item'}`}>
      {props.name}
      </div>
    )
  }

import React from 'react'
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import Select from 'react-select';
import {
  faPen,
  faSave,
  faUndoAlt,
  faExclamationTriangle,
  faTimesCircle
 } from '@fortawesome/free-solid-svg-icons'
import { IP } from './../../../constanst'
import {
  getEmployeeListForHr,
  updateEmployeeAttribute,
  submitNoteToEmployee,
  getEmployeeNoteListById,
  deleteEmployeeNoteByNoteId,
  getLogsByEmployeeId,
  getLeaveById,
  getEmployeePublicHoliday,
  getDepartments,
  downloadTimescanBydepartmentAndMonthWithOT,
  getPublicHolidayList,
  getEmployeeTimeScanById,
  getEmployeeUnapproveRequestByEmployeeId,
  getEmployeeUnapproveRequest,
  getEmployeeDocumentById,
  submitDocument,
    getPositions,
    updateEmployeePosition,
    getChecklistList,
    getEmployeeChecklistLink,
    createLinkChecklistEmployee,
    resignEmployee,
    getChecklistRecordListByEmployee,
    submitProbationResult,
    getWarningById,
    updateWarningApprove,
    getFingerPrintListById,
    deleteEmployeeFingerPrints,
    addFingerPrintToEmployee
 } from './../tunnel'
import server from './../../../login/tunnel'
import CreateNewEmployee from './createNewEmployee';
import Notes from './employeeProfile/notes';
import LogsList from './employeeProfile/logs';
import LeaveList from './employeeProfile/leave';
import Timetable from './employeeProfile/timetable';
import Document from './employeeProfile/document';
import Checklist from './employeeProfile/checklist';
import Warning from './employeeProfile/warning';

import './hr-admin.css'

import OTExtraLeaveRequest from './otExtraLeaveRequest'

import { ReactComponent as Icon } from './bouncing-circles.svg';
import ReactDOMServer from 'react-dom/server';










export default class EmployeeListForHr extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      employeeId: '',
      page: 'main'
    }
  }

  setEmployee = (id = '') => {
    this.setState(() => ({
      employeeId: id,
      page: 'user-info'
    }))
  }

  backMainPage = () => {
    this.setState(() => ({
      employeeId: '',
      page: 'main'
    }))
  }

  createNewEmployeePageOnClick = () => {
    this.setState(() => ({
      page: 'create-employee'
    }))
  }

  render(){
    let { employeeId, page } = this.state
    return(
      <div className="container" >
        { page === 'main' ?
          <Main
            setEmployee={this.setEmployee}
            openCreateNewEmployee={this.createNewEmployeePageOnClick}
            user={this.props.user}
            />
          : page === 'create-employee' ?
            <CreateNewEmployee backBtn={this.backMainPage} user={this.props.user}  />
          :
          <Profile
            employeeId={employeeId}
            backBtn={this.backMainPage}
            user={this.props.user}
             />
        }
      </div>
    )
  }
}

const SubMenuList = props => (
  <li
    className="subMenuLi"
    onClick={() => props.onClick(props.text)}
    style={{position: 'relative', cursor:'pointer', display: 'inline', padding: '13px', borderBottom: props.text === props.subPage ? '4px solid orange': ''}}
    >
    {props.text}
    {
      props.notify ? <span style={{position: 'absolute', top: '5px', right: '0px', width:'10px', height: '10px', backgroundColor: 'red', borderRadius: '50%'}}></span> : ''
    }


  </li>
)



class Profile extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      subPage: 'Profile',
      employeeInfo: '',
      noteList: [],
      logsList: [],
      leaveList: [],
      employeePublicHolidayList: [],
      timetableList: [],
      timetableRequest: [],
      scanTimeRequest: [],
      leaveRequest: [],
      documentList: [],
        checklistRecordList: [],
    departmentList:[],
        positionList: [],
        checklistList:[],
        selectedChecklist: null,
        checlistLinkList:[],
        warningList:[],
        fingerPrintList: []
    }
  }

  componentDidMount(){
    this.loadEmployeeInfo()
    this.getFingerPrintList()
    this.getNoteList()
    this.getLogsList()
    this.getLeaveList()
    this.getTimetable()
    this.getRequestList()
    this.getDocumentList()
      this.getPositionList()
      this.getDepartmentList()
      this.getChecklistList()
      this.getEmployeeChecklistLink()
      this.getChecklistRecordList()
      this.getWarningList()
  }


    openResign = () => {
        Swal.fire({
  title: 'พนักงานออกจากงาน',
  input: 'password',
  inputLabel: 'ยืนยันผู้ใช้',
  inputPlaceholder: 'กรุณาใส่รหัสผ่านผุ้ใช้',
  inputAttributes: {
    autocapitalize: 'off',
    autocomplete: 'off',
    maxlength: 128
  },
  showCancelButton: true,
  confirmButtonText: 'ต่อไป',
  cancelButtonText: 'ยกเลิก',
  inputValidator: (value) => {
    if (!value) {
      return 'Password is required';
    }
    // return undefined or null means valid
  }
}).then((result) => {
  if (result.isConfirmed) {
    const password = result.value;
    console.log('Password entered:', password);
    // Proceed — e.g., call your auth function
      server.login({username: this.props.user.username , password}, res => {
            if(res.status){
          this.openResignRemark()
      }else{
          Swal.fire({
          title: res.msg,
          icon: 'error'
        })
      }
            })
  }
});
    }

    openResignRemark = () => {
        Swal.fire({
  title: 'หมายเหตุการออกงาน',
            inputLabel:'ตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก',
  input: 'textarea',// pre-filled content
  inputPlaceholder: 'รายละเอียด',
  showCancelButton: true,
  inputValidator: (value) => {
      if (!value) {
      return 'กรุณาระบุหมายเหตุการออกงาน';
    }
  }
}).then(result => {
  if (result.isConfirmed) {
    let value = result.value.trim() === '' ? null : result.value.trim()
    console.log(value)
      resignEmployee({id: this.props.employeeId , username: this.props.user.username, remark: value}, res => {
          if(res.status){
              Swal.fire(
              'สำเร็จ!',
              'ข้อมูลถูกบันทึก',
              'success'
          )
              this.props.backBtn()
          }else {
              Swal.fire({
          title: res.msg,
          icon: 'error'
        })
          }
      })
  }
});
    }


    openLinkChecklist = () => {
        console.log(this.state.employeeInfo)
        let validateList = this.state.checklistList
        .filter(list => {
            let found = this.state.checklistLinkList.find(link => link.checklistId === list.id)
            return found ? false :true
        })
        .filter(list => (list.type === 'employee'
                                                                   || list.refId === this.state.employeeInfo.positionId
                                                                   || list.refId === this.state.employeeInfo.departmentId)).map(list => ({
            value: list.id, label: list.name
        }))
        console.log(validateList)
    Swal.fire({
      title: 'เลือก Checklist',
      html: `
<div style="width:400px;">
    <select id="checklistSelect" class="swal2-select">
      <option value="">-- กรุณาเลือกCheckList --</option>
      ${validateList
        .map(list => `<option value="${list.value}">${list.label}</option>`)
        }
    </select>

    <input type="date" id="dateInput" class="swal2-input" style="margin-top:10px;" />
</div>
  `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
    const checklist = document.getElementById('checklistSelect').value;
    const date = document.getElementById('dateInput').value;

    if (!checklist) {
      Swal.showValidationMessage('กรุณาเลือกChecklist');
      return false;
    }
    if (!date) {
      Swal.showValidationMessage('กรุณาเลือกวันที่');
      return false;
    }

    return { checklist, date };
  }
    }).then(result => {
      if (result.isConfirmed) {
        console.log('Selected:', result.value);
          createLinkChecklistEmployee({checklistId: result.value.checklist, date: result.value.date, employeeId: this.props.employeeId}, res => {
              if(res.status){
                  Swal.fire(
              'สำเร็จ!',
              'ข้อมูลถูกบันทึก',
              'success'
          )
              }
          })
      }
    });
  };

    getPositionList = () => {
        getPositions(res => {
            if(res.status){
                this.setState(() => ({
                    positionList: res.positionList
                }))
            }
        })
    }

    getWarningList = () => {
      getWarningById({employeeId: this.props.employeeId}, res => {
        if(res.status){
          this.setState(() => ({
              warningList: res.warningList
          }))
        }
      })
    }


    getFingerPrintList = () => {
      getFingerPrintListById({employeeId: this.props.employeeId}, res => {
        if(res.status){
          this.setState(() => ({
              fingerPrintList: res.fingerPrintList
          }))
        }
      })
    }


    updateWarningApproveOnClick = (e, id) => {
      let imageFile = e.target.files[0]
      updateWarningApprove({imageFile, id}, res => {
        if(res.status){
          Swal.fire("สำเร็จ!", "ทำการบันทึกเรียบร้อยแล้ว", "success");
          this.getWarningList()
        } else {
          Swal.fire("ผิดพลาด!", res.msg || "ไม่สามารถบันทึกได้", "error");
        }
      })
    }

    getDepartmentList = () => {
        getDepartments(res => {
            if(res.status){
                this.setState(() => ({
                    departmentList: res.departments
                }))
            }
        })
    }

  getRequestList = () => {
    getEmployeeUnapproveRequestByEmployeeId({employeeId: this.props.employeeId},res => {
      if (res.status) {
        let { timetableRequestData, scanTimeRequestData, leaveRequestData} = res
        console.log(res);

         this.setState(() => ({
          timetableRequest: timetableRequestData,
          scanTimeRequest: scanTimeRequestData,
          leaveRequest: leaveRequestData
         }))

      }
  })
  }

  removeRequestWhenSuccess = (requestId, date, employeeId) => {
     let found = this.state.leaveRequest.filter(req => req.id === requestId)
    if(found.length){
      this.getLeaveList()
      this.loadEmployeeInfo()
    }
    // this.getTimetable()
    this.setState(() => ({
      timetableRequest: this.state.timetableRequest.filter(req => req.id !== requestId),
      scanTimeRequest: this.state.scanTimeRequest.filter(req => req.id !== requestId),
      leaveRequest: this.state.leaveRequest.filter(req => req.id !== requestId)
     }))
}

  getTimetable = () => {
    getEmployeeTimeScanById({employeeId: this.props.employeeId, month: new Date() } ,res => {
      if(res.status){
        this.setState(() => ({
          timetableList: res.payload
        }))
      }
    })
  }

  getLogsList = () => {
    getLogsByEmployeeId({employeeId: this.props.employeeId}, res =>{
      if(res.status){

        this.setState(() => ({
          logsList: res.logList
        }))
      }
    })
  }


  getEmployeeChecklistLink = () => {
    getEmployeeChecklistLink({employeeId: this.props.employeeId}, res =>{
      if(res.status){

        this.setState(() => ({
          checklistLinkList: res.checklistLinkList
        }))
      }
    })
  }


  getChecklistList = () => {
    getChecklistList( res =>{
      if(res.status){
          console.log(res)
        this.setState(() => ({
          checklistList: res.checklistList
        }))
      }
    })
  }

  getLeaveList = () => {
    getLeaveById({employeeId: this.props.employeeId}, res =>{
      if(res.status){
        console.log(res);
        this.setState(() => ({
          leaveList: res.leaveList
        }))
      }
    })
    getEmployeePublicHoliday({employeeId: this.props.employeeId}, res =>{
      if(res.status){
        this.setState(() => ({
          employeePublicHolidayList: res.employeePublicHolidayList
        }))
      }
    })
  }

  loadEmployeeInfo = () => {
    getEmployeeListForHr({employeeId: this.props.employeeId},res => {
      if(res.status){
        console.log(res);

        this.setState(() => ({
          employeeInfo: res.list[0]
        }))
      }
    })
  }

  getNoteList = () => {
    getEmployeeNoteListById({employeeId: this.props.employeeId}, res => {
      if(res.status){

        this.setState(() => ({
          noteList: res.noteList.filter(x => x.type === 'admin')
        }))
      }
    })
  }

  getDocumentList = () => {
    getEmployeeDocumentById({employeeId: this.props.employeeId}, res => {

      if(res.status){
        this.setState(() => ({
          documentList: res.documentList
        }))
      }
    })
  }

  getChecklistRecordList = () => {
      getChecklistRecordListByEmployee({employeeId: this.props.employeeId}, res => {

      if(res.status){
        this.setState(() => ({
          checklistRecordList: res.checklistRecordList
        }))
      }
    })
  }

  setSubPage = subPage => {
    this.setState(() => ({
      subPage
    }))
  }

  submitNewNote = (note, callback) => {
    submitNoteToEmployee({
      note,
      employeeId: this.props.employeeId,
      createBy: this.props.user.username // this.props.user.username
    }, res => {
      if(res.status){
        this.getNoteList()
      }

      callback(res)
    })
  }

  deleteNote = (id, callback) => {
    deleteEmployeeNoteByNoteId({id}, res => {
      if(res.status){
        this.getNoteList()
      }
      callback(res)
    })
  }

  submitNewDocument = (file, filename, callback) => {
    submitDocument({
      employeeId: this.props.employeeId, file, filename
    }, res => {
      console.log(res);

      if(res.status){
        this.getDocumentList()
      }else{
        Swal.fire({
          title: res.msg,
          icon: 'error'
        })
      }
      callback(res.status)
    })
  }

  shouldNotify = (title) => {
    let { timetableRequest, scanTimeRequest, leaveRequest} = this.state
    if(title === 'ตารางเวลา'){
      return timetableRequest.length + scanTimeRequest.length
    }
    if(title === 'ประวัติการลา'){
      return leaveRequest.length
    }
    return false
  }

  submitPositionChange = (positionId, callback) => {
      let position = this.state.positionList.find(pos => pos.id === positionId)
      updateEmployeePosition({username: this.props.user.username,
                             employeeId: this.props.employeeId,
                              positionId,
                              role: position.name,
                              departmentId: position.departmentId
                             }, res => callback(res))
  }

  submitProbationResult = ({ status,  level, salary, incentive }, callback) => {
      submitProbationResult({employeeId: this.props.employeeId,
                             level, status, salary, incentive, createBy: this.props.user.username  },res => {
          if(res.status){
              this.loadEmployeeInfo()
              this.getLogsList()
          }
          callback(res)
      })
  }

  render(){
    let {backBtn} = this.props
    let { fingerPrintList, documentList, timetableRequest,leaveRequest, warningList,scanTimeRequest, subPage, employeeInfo, noteList, logsList, leaveList, employeePublicHolidayList, timetableList, checklistRecordList} = this.state
    let subPageList = ['Profile', 'ตารางเวลา', 'ประวัติการลา' ,  'เอกสาร', 'ใบเตือน', 'Notes']
    if(this.props.user.permissionList.includes('VIEW_EMP_LOGS')){
      subPageList = [...subPageList, 'Logs']
    }
      if(this.props.user.permissionList.includes('VIEW_EMP_CHECK_RECORD')){
      subPageList = [...subPageList, 'ใบประเมิน']
    }
    return(
      <div className="row">
        <div className="col-10 mt-3">
          <ul className="p-3" style={{borderBottom: '1px solid #e3e3e3'}}>
            {
              subPageList.map(page => <SubMenuList onClick={this.setSubPage} text={page} subPage={subPage} notify={this.shouldNotify(page)} />)
            }
          </ul>
        </div>
        <div className="col-2 mt-3">
          <button onClick={() => backBtn()}  className="btn btn-danger">กลับ</button>
        </div>
        <div className="col-3 text-center mt-3">
          <img
            src={employeeInfo.imageUrl ? IP + '/public/employee/' + employeeInfo.imageUrl : IP + '/public/employee/person.png'}
            className={employeeInfo.active ? "personIconActive" : "personIconInactive"}
            alt="Smiley face"
            height="80"
            width="80" />
          <h5 className="mt-2">{employeeInfo.id}</h5>
          <p style={{fontSize: '15px'}}>{employeeInfo.name}</p>
          <div className="row">
             <div className="col-12" style={{height: '100px'}}></div>


{ this.props.user.permissionList.includes('LINK_EMP_CHECKLIST') ? <div className="col-12"><button onClick={this.openLinkChecklist} className="btn btn-info w-100 my-1">Link Checklist</button></div> : ''}
              <div className="col-12"><button onClick={this.openResign} className="btn btn-danger w-100 my-1">Resign</button></div>
       </div>
        </div>
        <div className="col-9">
          {
            subPage === 'Profile' && <SubProfile reloadFingerPrintList={this.getFingerPrintList} fingerPrintList={fingerPrintList} user={this.props.user} employeeInfo={employeeInfo}
            departmentList={this.state.departmentList} positionList={this.state.positionList}
            submitPositionChange={this.submitPositionChange}
            getLogList={this.getLogsList} loadEmployeeInfo={this.loadEmployeeInfo} />
          }
          {
            subPage === 'Notes' && <Notes noteList={noteList} submitNewNote={this.submitNewNote} deleteNote={this.deleteNote} />
          }

          {
            subPage === 'Logs' && <LogsList loglist={logsList} />
          }

          {
            subPage === 'ประวัติการลา' && <LeaveList user={this.props.user} removeRequestWhenSuccess={this.removeRequestWhenSuccess} leaveRequest={leaveRequest} employeeInfo={employeeInfo} leaveList={leaveList} employeePublicHolidayList={employeePublicHolidayList} />
          }

          {
            subPage === 'ตารางเวลา' && <Timetable user={this.props.user} removeRequestWhenSuccess={this.removeRequestWhenSuccess} employeeInfo={employeeInfo} timeList={timetableList} timetableRequest={timetableRequest} scanTimeRequest={scanTimeRequest}  />
          }
          {
            subPage === 'เอกสาร' && <Document submitNewDocument={this.submitNewDocument} user={this.props.user} employeeInfo={employeeInfo} documentList={documentList}   />
          }
          {
            subPage === 'ใบเตือน' && <Warning user={this.props.user} employeeInfo={employeeInfo} warningList={warningList} updateWarningApproveOnClick={this.updateWarningApproveOnClick}  />
          }

          {
            subPage === 'ใบประเมิน' && <Checklist submitProbationResult={this.submitProbationResult} checklist={checklistRecordList} user={this.props.user} employeeInfo={employeeInfo}  />
          }

        </div>
      </div>
    )
  }
}




class SubProfile extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  submitChange = (attribute, value, callback) => {
    console.log(attribute, value);
    updateEmployeeAttribute({employeeId: this.props.employeeInfo.id, attribute, value,
      createBy: this.props.user.username // user.username
    } ,res => {
      if(res.status){
        callback(res)
      }else{
        Swal.fire({
          title: res.msg,
          icon: 'error'
        })
      }
    })
  }

  openUpdateDefaultDayOff = () => {
    Swal.fire({
      title: 'อัพเดทวันหยุดประจำสัปดาห์',
      input: 'select',
      inputOptions: {
        1: 'วันอาทิตย์',   // Sunday
        2: 'วันจันทร์',     // Monday
        3: 'วันอังคาร',     // Tuesday
        4: 'วันพุธ',        // Wednesday
        5: 'วันพฤหัสบดี',   // Thursday
        6: 'วันศุกร์',      // Friday
        7: 'วันเสาร์'       // Saturday
      },
      inputPlaceholder: 'เลือกวันหยุด',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'กรุณาระบุวันที่ต้องการบันทึกเป็นวันหยุด!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedDay = result.value;
        this.submitChange('defaultDayOff', selectedDay, res => {
          if(res.status){
            Swal.fire(
              'สำเร็จ!',
              'ข้อมูลถูกบันทึก',
              'success'
          )
            this.props.loadEmployeeInfo()
            this.props.getLogList()
          }
        })
      }
    });

  }

  openUpdateDatePickerPopUp = (title, attribute) => {
    Swal.fire({
      title: `อัพเดท ${title}`,
      html: `
        <input type="date" id="date" class="swal2-input">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const date = document.getElementById("date").value;
        if (!date) {
          Swal.showValidationMessage(`กรุณาระบุ ${title} ให้ถูกต้อง`);
        }
        return { date };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitChange(attribute, moment(result.value.date).format("DD/MM/YYYY"), res => {
          if(res.status){
            Swal.fire(
              'สำเร็จ!',
              'ข้อมูลถูกบันทึก',
              'success'
          )
            this.props.loadEmployeeInfo()
            this.props.getLogList()
          }
        })


      }
    });
  }

  openUpdatePopUp = (title, attribute) => {
    Swal.fire({
      title: `อัพเดท ${title}`,
      input: 'text',
      inputPlaceholder: title,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return `กรุณาระบุ ${title} ให้ถูกต้อง`;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {

        this.submitChange(attribute, result.value, res => {
          if(res.status){
            Swal.fire(
              'สำเร็จ!',
              'ข้อมูลถูกบันทึก',
              'success'
          )
            this.props.loadEmployeeInfo()
            this.props.getLogList()
          }
        })
      }
    });

  }

  handleDeleteFinger = (fingerId, fingerScanId) => {
    let employeeInfo = this.props.employeeInfo
    Swal.fire({
      title: 'ลบลายนิ้วมือพนักงาน',
      input: 'password',
      inputLabel: 'ยืนยันผู้ใช้',
      inputPlaceholder: 'กรุณาใส่รหัสผ่านผุ้ใช้',
      inputAttributes: {
      autocapitalize: 'off',
      autocomplete: 'off',
      maxlength: 128
      },
      showCancelButton: true,
      confirmButtonText: 'ต่อไป',
      cancelButtonText: 'ยกเลิก',
      inputValidator: (value) => {
      if (!value) {
        return 'Password is required';
      }
      // return undefined or null means valid
      }
      }).then((result) => {
      if (result.isConfirmed) {
      const password = result.value;
      // Proceed — e.g., call your auth function
        server.login({username: this.props.user.username , password}, res => {
              if(res.status){
            deleteEmployeeFingerPrints({employeeId: employeeInfo.id, fingerId, fingerScanId}, res => {
              if(res.status){
                this.props.reloadFingerPrintList()
              }
            })
        }else{
            Swal.fire({
            title: res.msg,
            icon: 'error'
          })
        }
              })
      }
      });
  }

  openAddFingerPrint = () => {
    let employeeInfo = this.props.employeeInfo
      let validateList = [{value: "1", label: 'Avatara'},{value: "2", label: 'Samed Pavilion'},{value: "NYU7250900753", label: 'Tecko AVA'} , {value: "NYU7250900825", label: 'Tecko PAV'} ]
      console.log(validateList)
  Swal.fire({
    title: 'เลือกสถานที่ และ ID',
    html: `
<div style="width:400px;">
  <select id="fingerScanSelect" class="swal2-select">
    <option value="">-- กรุณาเลือกสถานที่ --</option>
    ${validateList
      .map(list => `<option value="${list.value}">${list.label}</option>`)
      }
  </select>

  <input placeholder="Finger ID (ถ้ามี)" type="number" id="fingerId" class="swal2-input" style="margin-top:10px;" />
</div>
`,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
  const fingerScanId = document.getElementById('fingerScanSelect').value;
  const fingerId = document.getElementById('fingerId').value;

  if (!fingerScanId) {
    Swal.showValidationMessage('กรุณาเลือกสถานที่');
    return false;
  }

  return { fingerScanId, fingerId };
}
  }).then(result => {
    if (result.isConfirmed) {
      const {fingerScanId, fingerId} = result.value
      addFingerPrintToEmployee({employeeId: employeeInfo.id, fingerScanId, fingerId}, res => {
        if(res.status){
          this.props.reloadFingerPrintList()
        }else{
          Swal.fire({
          title: res.msg,
          icon: 'error'
        })
        }
      })
    }
  });
};


  openUpdatePositionPopUp = () => {
      let employeeInfo = this.props.employeeInfo
      let inputOptions = this.props.departmentList.reduce((result, dept) => {
      result[dept.name] = this.props.positionList
      .filter(x => x.departmentId === dept.id)
      .reduce((empResult, emp) => {
        empResult[emp.id] = `${emp.name}`
        return empResult
      }, {})
      return result
    }, {})


      Swal.fire({
  title: 'เลือกตำแหน่งาน',
  input: 'select',
  inputOptions,
  inputPlaceholder: 'required',
  showCancelButton: true,
  inputValidator: function (value) {
    return new Promise(function (resolve, reject) {
      if (value !== '') {
          if(value === employeeInfo.positionId){
              resolve('ตำแหน่งงานซ้ำงานปัจจุบัน');
          }else{
              resolve();
          }

      } else {
        resolve('กรุณาเลือกตำแหน่งาน');
      }
    });

  }
}).then(result => {
  if(result.isConfirmed){

      this.props.submitPositionChange(result.value, res => {
          if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'ข้อมูลถูกบันทึก'
        })
              this.props.loadEmployeeInfo()
      }else{
        Swal.fire({
          icon: 'error',
          title: res.msg
        })
      }
      })

  }
})
  }



  render(){
    const days = [
      'วันอาทิตย์', // 1
      'วันจันทร์',   // 2
      'วันอังคาร',   // 3
      'วันพุธ',      // 4
      'วันพฤหัสบดี', // 5
      'วันศุกร์',    // 6
      'วันเสาร์'     // 7
    ];
    let {employeeInfo, fingerPrintList} = this.props
    return( employeeInfo !== undefined && <div className="row">
        <div className="col-12">
          <h4><u>ข้อมูลส่วนตัว</u></h4>
        </div>
        <TextField title='หมายเลขประชาชน/พาสปอร์ต' value={employeeInfo.nationalId} updatable={false}
          openUpdatePopUp={() => this.openUpdatePopUp('หมายเลขประชาชน/พาสปอร์ต', 'nationalId')}
        />
        <TextField title='เบอร์โทร' value={employeeInfo.phone} updatable={this.props.user.permissionList.includes('UPDATE_EMP_GENERAL_INFO')}
          openUpdatePopUp={() => this.openUpdatePopUp('เบอร์โทร', 'phone')}
        />
        <TextField title='ที่อยู่' value={employeeInfo.address} updatable={this.props.user.permissionList.includes('UPDATE_EMP_GENERAL_INFO')}
          openUpdatePopUp={() => this.openUpdatePopUp('ที่อยู่', 'address')}
        />
        <TextField title='วันเกิด' value={employeeInfo.dob} updatable={false}
          openUpdatePopUp={() => this.openUpdateDatePickerPopUp('วันเกิด', 'dob')}
        />


        <TextField title='สัญชาติ' value={employeeInfo.nationality} />

        <div className='mt-3'></div>
        <div className="col-12">
          <h4><u>ข้อมูลการทำงาน</u></h4>
        </div>
        <div className="col-12">
          <table style={{maxWidth: '320px'}} className="table table-bordered">
            <thead>
              <tr>
                <th>ลายนิ้วมือแสกนนิ้ว <button onClick={this.openAddFingerPrint} className="btn btn-success btn-sm">+ ลายนิ้วมือ</button></th>
              </tr>
            </thead>
            <tbody>
              {
                fingerPrintList.map(x => <tr>
                  <td>{x.fingerScanId === "1" ? 'Avatara' : x.fingerScanId === "2" ? 'Samed Pavilion' : x.fingerScanId === 'NYU7250900753' ?  'TeckoAva' : 'TeckoPav'} [#{x.fingerId}] <button onClick={() => this.handleDeleteFinger(x.fingerId, x.fingerScanId)} className="btn btn-danger btn-sm">ลบ</button></td>
                </tr>)
              }
            </tbody>
          </table>
        </div>


        <TextField title='เริ่มทำงาน' value={employeeInfo.startJob} />
        <TextField title='Department' value={employeeInfo.departmentName} />
        <TextField title='ตำแหน่ง' value={employeeInfo.role} updatable={true}
          openUpdatePopUp={() => this.openUpdatePositionPopUp()} />


        <div className="col-12">

          &nbsp;<span>{!employeeInfo.defaultDayOff? <span>{!employeeInfo.defaultDayOff && <span style={{color:'red'}}>*</span>} วันหยุดประจำสัปดาห์ : ไม่ถูกบันทึก <button onClick={this.openUpdateDefaultDayOff} className='btn btn-sm btn-success'>Update</button></span>
          :
          <TextField title='วันหยุดประจำสัปดาห์' value={days[employeeInfo.defaultDayOff - 1]} updatable={this.props.user.permissionList.includes('UPDATE_EMP_DEFAULT_DAY_OFF')}
          openUpdatePopUp={this.openUpdateDefaultDayOff}
        />
    }
        </span>
        </div>

        <TextField title='บัญชีรับเงินเดือน' value={employeeInfo.bankAccount} updatable={false}
          openUpdatePopUp={() => this.openUpdatePopUp('บัญชีรับเงินเดือน', 'bankAccount')}
        />
      </div>
    )
  }
}

const TextField = props => (
  <div className="col-12 my-2 text-field-updatable">
     <style>
        {`
          .text-field-updatable .action-btn {
            visibility: hidden;
          }

          .text-field-updatable:hover .action-btn {
            visibility: visible;
          }
        `}
      </style>
    <label>{(props.value === null || props.value === '') && <span style={{color:'red'}}>*</span>} {props.title} : </label>&nbsp;<span>{props.value} {(props.updatable || props.value === '' || props.value === null) && <button onClick={props.openUpdatePopUp} className='btn action-btn btn-sm btn-success'>Update</button> }</span>
  </div>
)

class InputTextField extends React.Component {
  constructor(props){
    super(props)
    console.log(this.props);
    this.state = {
      inputValue: '',
      showEdit: false,
      savedValue: ''
    }
  }

  submitValueChange = () => {
    let { inputValue } = this.state
    let {title, submitChange, name} = this.props
    if(inputValue === ''){
      Swal.fire({
        title:'กรุณาใส่'+title,
        icon: 'error'
      })
      return
    }
    submitChange(name, inputValue, res => {
      if(res.status){
        this.setState(() => ({
          showEdit: false,
          savedValue: inputValue
        }))
      }
    })
  }

  textOnChange = (e) => {
    let { value } = e.target
    this.setState(() => ({
      inputValue: value
    }))
  }

  toggleShowEdit = () => {
    this.setState(() => ({
      showEdit: !this.state.showEdit,
      inputValue: '',
    }))
  }

  render(){
    let {showEdit, inputValue, savedValue} = this.state
    let {title, value} = this.props
    let displayValue = savedValue !== '' ? savedValue : value
    return(
      <div className="col-12 my-2">
        <label>{title} : </label>&nbsp;
        {!showEdit ? <span>{displayValue}</span> : <input placeholder={displayValue} onChange={this.textOnChange} value={inputValue}  />}&nbsp;&nbsp;
        {!showEdit ?
          <span onClick={this.toggleShowEdit} className="subMenuLi"><FontAwesomeIcon icon={faPen} /></span>
            :
            <span>
            <span onClick={this.submitValueChange} className="subMenuLi"><FontAwesomeIcon color='green' icon={faSave} /></span>
            &nbsp;
            <span onClick={this.toggleShowEdit} className="subMenuLi"><FontAwesomeIcon color='red' icon={faUndoAlt} /></span>
          </span>
        }

      </div>
    )
  }
}


class Main extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      employeeList: [],
      departmentList:[],
      requestList:[],
      showRequest: false,
      closestHoliday : null
    }
  }

  componentDidMount(){
    getEmployeeListForHr({}, res => {
      if(res.status){
        console.log(res.list[0]);
        this.setState(() => ({
          employeeList: res.list
        }))
      }
    })
    getDepartments(res => {
      if(res.status){
        console.log(res);

        this.setState(() => ({
          departmentList: res.departments
        }))
      }
    })
    getPublicHolidayList(res => {
      console.log(res);
      if(res.status) {
          this.setState(() => ({
            closestHoliday: this.findClosestHoliday(res.publicHolidayList)
          }))

      }
    })
    getEmployeeUnapproveRequest(res => {
      console.log(res);
      if(res.status) {
          this.setState(() => ({
            requestList: res.employeeList
          }))

      }
    })
  }

  updateRequestList = list => {
      this.setState(() => ({
        requestList: list,
        showRequest: list.length > 0
      }))
    }

  findClosestHoliday = (list) => {
    const today = moment();
    const sortedItems = list
        .map(item => {
        const [day, month, year] = item.date.split("/").map(Number);
        return {
        ...item,
        sortableDate: new Date(year, month - 1, day)
        };
    })
    .sort((b, a) => b.sortableDate - a.sortableDate);

    const upcomingItems = sortedItems.filter(item => moment(item.sortableDate).isSameOrAfter(today, 'day'));

  if (upcomingItems.length === 0) {
    return null; // No upcoming dates
  }

  // Find the closest upcoming date


    return upcomingItems[0]

}

  getDurationFromNow(dateString) {
    // Parse the date string with the format 'DD/MM/YYYY'
    const inputDate = moment(dateString, 'DD/MM/YYYY');

    // Get the current date
    const now = moment();

    // Calculate the difference in years, months, and days
    const years = now.diff(inputDate, 'years');
    inputDate.add(years, 'years');

    const months = now.diff(inputDate, 'months');
    inputDate.add(months, 'months');

    const days = now.diff(inputDate, 'days');

    // Return the duration
    return { years, months, days };
  }

  openDownloadMonthlyTimetable(departmentList){
    console.log(departmentList);

    let html = departmentList.reduce((string, dep) => {
      string += `<button id="btn-${dep.id}" class="swal2-confirm swal2-styled" style="margin: 5px;">${dep.name}</button>`
      return string
    }, '')
    Swal.fire({
      title: 'เลือกแผนก',
      html,
      showCancelButton: true,
      showConfirmButton: false, // Hide the default confirm button
      didRender: () => {
        for(const dep of departmentList){
          document.getElementById('btn-'+dep.id).addEventListener('click', () => {
            Swal.update({
              title: ReactDOMServer.renderToString(
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ marginRight: '8px' }}> กำลังโหลด</span>
                  <Icon width="24" height="24" style={{ marginRight: '8px' }} /> {/* SVG Icon */}

                </div>
              )

            })
            downloadTimescanBydepartmentAndMonthWithOT({departmentId: dep.id}, res => {
              if(res.status){
                Swal.update({
                  title:'เลือกแผนก',
                })
                console.log(res.uri)
                window.open(res.uri)

              }else{
                alert(res.msg)
                Swal.update({
                  title: 'เลือกแผนก'
                })
              }
            })
          });
        }

      }
    });
  }

  checkTimetableDownloadableDate(){
    const today = moment();

    // Define the start and end dates of the range
    const startDate = moment().startOf('month').date(21); // 21st of the current month
    const endDate = moment().startOf('month').date(25);
    return today.isBetween(startDate, endDate, 'day', '[]')
  }

  render(){
    let { employeeList,departmentList, requestList, showRequest } = this.state
    let {setEmployee} = this.props
    employeeList = employeeList.filter(x => x.active)
    return(
      <div className="row">
        <style>
          {
            `
            .tooltiper {
              position: relative;

            }

            /* Tooltiper text */
            .tooltiper .tooltiptext {
              visibility: hidden;
              width: 180px;
              background-color: black;
              color: #e3e3e3;
              text-align: center;
              padding: 5px 0;
              border-radius: 6px;

              /* Position the tooltip text - see examples below! */
              position: absolute;
              top: -5px;
              right: 105%;
              z-index: 1;
            }
            .tooltiper:hover .tooltiptext {
              visibility: visible;
            }
            `
          }
        </style>
        <div className='col-6 mt-4 text-right'>
          <br />
        {this.state.closestHoliday ? <h5>{moment().isSame(moment(this.state.closestHoliday.sortableDate), 'day') ? 'วันหยุดวันนี้ ' : 'วันหยุดต่อไป '} {moment(this.state.closestHoliday.sortableDate).format('DD/MM/YYYY')} {this.state.closestHoliday.name}</h5> : ''}
        </div>
        <div className="col-6 mt-4 text-right">


          { this.props.user.permissionList.includes('DOWNLOAD_ MONTHLY_TIMETABLE') ? <button onClick={() => this.openDownloadMonthlyTimetable(departmentList)} className='btn btn-secondary m-4' disabled={!(departmentList.length !== 0 && this.checkTimetableDownloadableDate()) }>ตารางงานประจำเดือน</button> : ''}
          {
            this.props.user.permissionList.includes('CREATE_NEW_EMPLOYEE') ? <button onClick={this.props.openCreateNewEmployee} className='btn btn-success'>สร้างพนักงานใหม่</button> : ''
          }

{

this.props.user.permissionList.includes('APPROVE_EMP_TIME_REQ') ?
<button style={{position:'relative'}} onClick={() => {this.setState(() => ({showRequest: !showRequest}))}} className='btn btn-success m-4' disabled={requestList.length === 0}>Rquest ({requestList.length}){
      requestList.length ? <span style={{position: 'absolute', top: '-5px', right: '-5px', width:'15px', height: '15px', backgroundColor: 'red', borderRadius: '50%'}}></span> : ''
    }

  </button> : ''
}

        </div>
        <div className='col-12' style={{position:'relative'}}>

        {showRequest ?
    <div style={{boxShadow:'0px 4px 8px rgba(0, 0, 0, 0.5)', padding: '10px',zIndex:'100', position: 'absolute', top: '-5px', right: '100px', background: '#e3e3e3', color: 'black', width: '700px'}}>
    <span onClick={() => {this.setState(() => ({showRequest: !showRequest}))}}  style={{ float: 'right', cursor: 'pointer'}}><FontAwesomeIcon size='2x'   color='black' icon={faTimesCircle} /> </span>
<OTExtraLeaveRequest user={this.props.user} updateRequestList={this.updateRequestList} list={requestList} />
    </div>
    :''}
        </div>

        <div className='col-12'>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{width: '10%'}}>รหัสพนักงาน</th>
                <th style={{width: '5%'}}>ระดับ</th>
                <th style={{width: '35%'}}>พนักงาน</th>
                <th style={{width: '15%'}}>อายุงาน</th>
                <th style={{width: '15%'}}>เบอร์โทร</th>
                <th style={{width: '5%'}}>สัญชาติ</th>
                <th style={{width: '10%'}}></th>
              </tr>
            </thead>
            <tbody>
              {
                departmentList.map(dept => <React.Fragment key={dept.id}>
                  <tr>
                    <td colSpan="7"><h3><b>{dept.name}</b></h3></td>
                  </tr>
                  {
                employeeList.filter(emp => emp.departmentId === dept.id).map(emp => {
                  let showWarning = false
                  let warningMsg = [];
                  let duration = this.getDurationFromNow(emp.startJob)
                  if(emp.nationalId === null || emp.nationalId === ''){
                    warningMsg = [...warningMsg, 'หมายเลขประชาชน/พาสปอร์ต']
                    showWarning = true
                  }
                  if(emp.dob === null || emp.dob === ''){
                    warningMsg = [...warningMsg, 'วันเกิด']
                    showWarning = true
                  }

                  if(emp.phone === null || emp.phone === ''){
                    warningMsg = [...warningMsg, 'เบอร์โทร']
                    showWarning = true
                  }
                  if(emp.address === null || emp.address === '' || emp.address === '-'){
                    warningMsg = [...warningMsg, 'ที่อยู่']
                    showWarning = true
                  }
                  if(emp.bankAccount === null || emp.bankAccount === ''){
                    warningMsg = [...warningMsg, 'เลขบัญชีธนาคาร']
                    showWarning = true
                  }
                  if(emp.defaultDayOff === 0){
                    warningMsg = [...warningMsg, 'วันหยุดประจำสัปดาห์']
                    showWarning = true
                  }

                    let background = '#fff'
                    if(emp.performanceStatus === 'Good'){
                        background = '#90EE90'
                    }
                    if(emp.performanceStatus === 'Average'){
                        background = '#FFFACD'
                    }
                    if(emp.performanceStatus === 'Poor'){
                        background = '#FFB6B6'
                    }
                    if(emp.performanceStatus === 'Fail'){
                        background = '#D3D3D3'
                    }

                  return (
                  <tr style={{background}}>
                    <td className="align-middle" style={{width: '10%'}}>{emp.id}</td>
                    <td className="align-middle text-center" style={{width: '5%'}}><b>{emp.level}</b></td>
                    <td className="align-middle" style={{width: '35%'}}>
                      <div className="row">
                        <div className="col-2">
                          <img
                            src={emp.imageUrl ? IP + '/public/employee/' + emp.imageUrl : IP + '/public/employee/person.png'}
                            className={emp.active ? "personIconActive" : "personIconInactive"}
                            alt="Smiley face"
                            height="60"
                            width="60" />
                        </div>
                        <div className="col-10">
                          <div className="col-12">
                            {emp.name}
                          </div>
                          <div className="col-12">
                            {emp.departmentName} - {emp.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle" style={{width: '15%'}}>{`${duration.years ? `${duration.years}y` : ''} ${duration.months ? `${duration.months}m` : ''} ${duration.days}d`}</td>
                    <td className="align-middle" style={{width: '15%'}}>{emp.phone}</td>
                    <td className="align-middle text-center" style={{width: '5%'}}>{emp.nationality}</td>
                    <td className="align-middle" style={{width: '15%'}}>
                      <button onClick={() => setEmployee(emp.id)} className="btn btn-link mx-1">ดูโปรไฟล์</button>
                      {showWarning && <span className='tooltiper' ><FontAwesomeIcon  color='#d9d571' icon={faExclamationTriangle} />
                      <span className="tooltiptext">
                        <u>ไม่พบข้อมูล</u>
                        <ul>
                          {warningMsg.map(msg => <li style={{textAlign: 'left'}}>{msg}</li>)}
                        </ul>
                      </span>
                      </span>}

                    </td>
                  </tr>
                )})
              }
                </React.Fragment>)
              }

            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

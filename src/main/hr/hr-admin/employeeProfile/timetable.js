
import React, {useEffect, useState, useRef} from 'react'
import moment from 'moment'
import 'moment/locale/th';
import Swal from 'sweetalert2'
import './MonthSelector.css'; // Custom CSS for styling
import { getEmployeeTimeScanById, hrProcessTimeScanRequest, hrProcessTimetableRequest } from './../../tunnel'
import { FaEllipsisV } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ScanTimeRequestBlock, TimeTableRequestBlock} from './../components/requestBlock'

const smallText = {fontSize: '14px', lineHeight: 0.8}

const Timetable = props => {
    let [timetableList, setTimetableList] = useState([]);
    let [date,setDate] = useState(new Date())
    const [menuState, setMenuState] = useState({ isVisible: false, index: null });
    const menuRef = useRef(null); // Create a ref for the popup menu

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuState({ isVisible: false, index: null });
          }
        };

        // Add the event listener for clicks outside
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          // Remove the event listener when component unmounts
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [menuRef]);

    useEffect(() => {
        moment.locale('th');
        setTimetableList(props.timeList)
        getTimetableByMonth(new Date())
      }, []);

      const getTimetableByMonth = (date) => {

        getEmployeeTimeScanById({employeeId: props.employeeInfo.id, month: date } ,res => {
            if(res.status){
              setTimetableList( res.payload)
            }
          })
      }

      const handleHrProcessTimeScanRequest = (requestId, status, date, employeeId, callback) => {
        hrProcessTimeScanRequest({requestId, status, approveBy: props.user.username}, res => {
            if(res.status){
                let toastProps = {position: "bottom-right",}
                if(!status){
                    toastProps['icon'] = '❌'
                }
                toast.success( `${status ? "อนุมัติ" : "ปฏิเสธ"} เพิ่มเวลาแสกนนิ้ว ID:` + employeeId + " วันที่:" + date + " สำเร็จ", toastProps)
                props.removeRequestWhenSuccess(requestId, date, employeeId)
                getTimetableByMonth(moment(date, 'DD/MM/YYYY'))
                callback()
            }else{
                toast.error(res.msg)
                callback()
            }
        })
    }

    const handleHrProcessTimetableRequest = (requestId, status, date, employeeId, callback) => {
        hrProcessTimetableRequest({requestId, status}, res => {
            if(res.status){
                let toastProps = {position: "bottom-right",}
                if(!status){
                    toastProps['icon'] = '❌'
                }
                toast.success( `${status ? "อนุมัติ" : "ปฏิเสธ"} ปรับตารางงาน ID:` + employeeId + " วันที่:" + date + " สำเร็จ", toastProps)
                props.removeRequestWhenSuccess(requestId, date, employeeId)
                getTimetableByMonth(moment(date, 'DD/MM/YYYY'))
                callback()
            }else{
                toast.error(res.msg)
                callback()
            }
        })
    }

      const handleMenuClick = (index) => {
        setMenuState({
          isVisible: !menuState.isVisible,
          index: menuState.index === index ? null : index,
        });
      };

      const handleMenuAction = (action, rowIndex) => {
        console.log(`Action "${action}" selected on row ${rowIndex}`);
        setMenuState({ isVisible: false, index: null });
      };

    return (
        <div className='row'>
            <div className='col-12'>
                {
                    (props.timetableRequest.length + props.scanTimeRequest.length) && props.user.permissionList.includes('APPROVE_EMP_TIME_REQ') ?
                    <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th style={{width: '60%'}}>รายการ</th>
                            <th style={{width: '20%'}}>บันทึกเมื่อ</th>
                            <th style={{width: '20%'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.scanTimeRequest.map(str => <ScanTimeRequestBlock str={str} handleHrProcessTimeScanRequest={handleHrProcessTimeScanRequest} />)}
                        {props.timetableRequest.map(str => <TimeTableRequestBlock ttr={str} handleHrProcessTimetableRequest={handleHrProcessTimetableRequest} />)}

                    </tbody>
                    <ToastContainer />
                </table> : ''

                }

            </div>
            <div className='col-12 align-center'>
                <MonthSelector getTimetableByMonth={getTimetableByMonth} />
            </div>
            <div style={{boxShadow:'0px 4px 8px rgba(0, 0, 0, 0.5)', padding: '10px'}}>
                <table className='table table-bordered table-striped '>
                    <thead>
                        <tr>
                            <th>วันที่</th>
                            <th>เข้า</th>
                            <th>พัก</th>
                            <th>กลับเข้า</th>
                            <th>ออก</th>
                            <th>สรุป</th>
                            {/* <th></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            timetableList.map((time, index) => {
                                let result = setDateAndSumCol(time)

                                return (
                                    <tr style={{minHeight: 60}}>
                                        <td>{`${time.date}`}<br/>
                                        <ul style={{listStyleType: 'none', padding: '0', margin: '0'}}>
                                          {result.dateCol.map(de => <li>{de}</li>)}
                                          </ul></td>
                                        <td>{`${time.start ? time.start.time : '-'}`}</td>
                                        <td>{`${time.break ? time.break.time : '-'}`}</td>
                                        <td>{`${time.continue ? time.continue.time : '-'}`}</td>
                                        <td>{`${time.end ? time.end.time : '-'}`}</td>
                                        <td>
                                        <ul style={{listStyleType: 'none', padding: '0', margin: '0'}}>
                                          {result.sumCol.map(de => <li>{de}</li>)}
                                          </ul></td>
                                        {/* <td>
                                        <div className="actions-container" ref={menuRef}>
                                            <button
                                            className="icon-button"
                                            onClick={() => handleMenuClick(index)}
                                            >
                                            <FaEllipsisV />
                                            </button>
                                            {menuState.isVisible && menuState.index === index && (
                                            <div className="popup-menu">
                                                <ul>
                                                <li onClick={() => handleMenuAction('Edit', index)}>Edit</li>
                                                <li onClick={() => handleMenuAction('Delete', index)}>Delete</li>
                                                <li onClick={() => handleMenuAction('View', index)}>View</li>
                                                </ul>
                                            </div>
                                            )}
                                        </div>
                                        </td> */}

                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}




const  minutesToDisplay = minutes => {
    if(!minutes){
      return '***'
    }else{
      if(parseInt(minutes/60)){
        return  parseInt(minutes/60) + 'h ' + minutes % 60 + 'm'
      } else {
        return minutes % 60 + ' m'
      }

    }
  }

const setDateAndSumCol = x => {
    let dateCol = []
    let sumCol = []
    if(x.result === 'leave'){
      dateCol = [x.leave.type]
      sumCol = [x.remark]
      return {dateCol, sumCol}
    }

    if(x.timetable === undefined){
      dateCol = ['(-)']
      sumCol = ['***']
      return {dateCol, sumCol}
    }

    if(x.result === 'uncountable'){
      dateCol = [...dateCol, '']
      sumCol = [...sumCol,'***']
    }



    if(x.result === 'dayOff'){
      dateCol = [...dateCol, 'วันหยุด']
      sumCol = [...sumCol,'วันหยุดประจำสัปดาห์']
    }
    if(x.result === 'dayOff+OT'){
        dateCol = [...dateCol, 'วันหยุด']
      sumCol = ['วันหยุดประจำสัปดาห์' , ` OT: ${minutesToDisplay(x.countableOTTime)}`]
    }

    if(x.result === 'working' || x.result === 'working+OT'){
      sumCol = [...sumCol,'SW: '+minutesToDisplay(x.countableWorkingTime)]
      if(x.workDuration - x.countableWorkingTime > 0){
        sumCol = [...sumCol,'สาย/ออกก่อน: '+minutesToDisplay(x.workDuration - x.countableWorkingTime)]
      }


    }

    if(x.timetable.startTime !== null){
      if(x.timetable.breakTime === null){
        dateCol = [...dateCol, `(${moment(x.timetable.startTime).format('kk:mm')} - ${moment(x.timetable.endTime).format('kk:mm')})`]
      }else{
        dateCol = [...dateCol, `(${moment(x.timetable.startTime).format('kk:mm')} - ${moment(x.timetable.breakTime).format('kk:mm')},\n${moment(x.timetable.continueTime).format('kk:mm')} - ${moment(x.timetable.endTime).format('kk:mm')})`]
      }
      if(x.result === 'uncountable'){
        sumCol = [...sumCol,'ขาดงาน/คำนวนเวลาไม่ได้']
      }
    }

    if(x.ot_timetable){
        dateCol = [...dateCol, '('+`${moment(x.ot_timetable.start).format('kk:mm')} - ${moment(x.ot_timetable.end).format('kk:mm')}`+')OT']
    }

    if(x.result === 'working+OT'){
      sumCol = [...sumCol, '   OT:'+minutesToDisplay(x.countableOTTime)]
    }

    return {dateCol, sumCol}
    }

const MonthSelector = (props) => {
    const currentMonthIndex = moment().month();
    const currentYear = moment().year();

    // Generate the past 12 months including the current month
    const months = [];
    for (let i = -1; i < 12; i++) {
      const month = moment().subtract(i, 'months');
      months.push({
        label: month.format('MMMM YYYY'),  // Month name and year (e.g., "September 2023")
        value: month.month(),               // Month index
        year: month.year()                  // Year of the month
      });
    }

    // State to hold the currently selected month and year
    const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Handle the month change from the dropdown
    const handleMonthChange = (e) => {
      const selectedOption = months[e.target.value];
      setSelectedMonth(selectedOption.value);
      setSelectedYear(selectedOption.year);
      const selectedMoment = moment({ year: selectedOption.year, month: selectedOption.value });
      props.getTimetableByMonth(selectedMoment.toDate())
    };

    return (
      <div className="month-selector">
        {/* Month Dropdown */}
        <select
          className="month-dropdown"
          value={months.findIndex(month => month.value === selectedMonth && month.year === selectedYear)}
          onChange={handleMonthChange}
          aria-label="Select Month"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

export default Timetable

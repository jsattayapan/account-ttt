import React, {useState, useEffect} from "react";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IP } from './../../../constanst'
import { getEmployeeUnapproveRequest, hrProcessTimeScanRequest, hrProcessTimetableRequest, hrProcessLeaveRequest } from './../tunnel'

const thTextStyle = { textAlign:"center", border:'2px solid black',fontWeight:'normal', background: '#5a9cf2', color: '#fff' }
const tdTextStyle = { textAlign:"center", background: '#ccc' }
const smallText = {fontSize: '14px', lineHeight: 0.8}



export const OTExtraLeaveRequest = props => {

    let [employeeList, setEmployeeList] = useState([]);

    const handleHrProcessTimeScanRequest = (requestId, status, date, employeeId, callback) => {
        hrProcessTimeScanRequest({requestId, status, approveBy: props.user.username }, res => {
            if(res.status){
                let toastProps = {position: "bottom-right",}
                if(!status){
                    toastProps['icon'] = '❌'
                }
                toast.success( `${status ? "อนุมัติ" : "ปฏิเสธ"} เพิ่มเวลาแสกนนิ้ว ID:` + employeeId + " วันที่:" + date + " สำเร็จ", toastProps)
                removeRequestWhenSuccess(requestId, date, employeeId)
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
                removeRequestWhenSuccess(requestId, date, employeeId)
                callback()
            }else{
                toast.error(res.msg)
                callback()
            }
        })
    }


    const handleHrProcessLeaveRequest = (requestId, status, date, employeeId, callback) => {
        hrProcessLeaveRequest({requestId, status, approveBy: props.user.username}, res => {
            if(res.status){
                let toastProps = {position: "bottom-right",}
                if(!status){
                    toastProps['icon'] = '❌'
                }
                toast.success( `${status ? "อนุมัติ" : "ปฏิเสธ"} บันทึกวันลา ID:` + employeeId + " วันที่:" + date + " สำเร็จ", toastProps)
                removeRequestWhenSuccess(requestId, date, employeeId)
                callback()
            }else{
                toast.error(res.msg)
                callback()
            }
        })
    }

    const removeRequestWhenSuccess = (requestId, date, employeeId) => {
        let newEmployeeList = employeeList.map(emp => {
            if(emp.id === employeeId && date === emp.date){
                emp.leaveRequestList = emp.leaveRequestList.filter(req => req.id !== requestId)
                emp.scanTimeRequestList = emp.scanTimeRequestList.filter(req => req.id !== requestId)
                emp.timetableRequestList = emp.timetableRequestList.filter(req => req.id !== requestId)
            }
            return emp
        }).filter(emp => (emp.leaveRequestList.length > 0 || emp.scanTimeRequestList.length > 0 || emp.timetableRequestList.length > 0))
        setEmployeeList(newEmployeeList)
        if(props.updateRequestList){
          props.updateRequestList(newEmployeeList)
        }
    }

    useEffect(() => {
        if(props.list === undefined){
            getEmployeeUnapproveRequest(res => {
                if (res.status) {
                    console.log(res.employeeList);

                    setEmployeeList(res.employeeList);

                }
            })
        }else{
            setEmployeeList(props.list);
        }

    }, []);

    return (
        <div className="row m-2" style={{zIndex: '100'}}>
            <div className="col-12 my-2">
                <h4>Request แก้ไข เวลาเข้าออกงาน ตารางงาน OT และวันหยุด</h4>
            </div>
            <div className="col-12">
                {employeeList.map(emp => <EmployeeRequestBlock employee={emp}
                handleHrProcessTimeScanRequest={handleHrProcessTimeScanRequest}
                handleHrProcessTimetableRequest={handleHrProcessTimetableRequest}
                handleHrProcessLeaveRequest={handleHrProcessLeaveRequest}
                />)}
            </div>
            <ToastContainer />
        </div>
    )
}

const EmployeeRequestBlock = props => {
    return (
        <div  style={{background:'#f0f0f0'}} className="row my-2 py-4">
            <div className="col-4">
                <div className="d-flex">
                    <div className="mx-2">
                        {
                            props.employee.imageUrl !== null ?
                            <img style={{ height: '60px', objectFit: 'contain' }} src={IP + '/public/employee/' + props.employee.imageUrl} />
                            :
                            <div className="profile-image"></div>
                        }

                    </div>
                    <div className="">
                        <div className="col-12 sub-text">{props.employee.id}</div>
                        <div className="col-12">{props.employee.name}</div>
                        <div className="col-12  sub-text">{props.employee.role}</div>
                    </div>
                </div>
            </div>
            <div className="col-8">
                    <table style={{width: '400px'}}>
                        <thead>
                            <tr>
                                <th style={{background:"#ccc", textAlign:"center", }}  colSpan={4}>{moment(props.employee.date, "DD/MM/YYYY").format("dddd, DD MMM YYYY")}</th>
                            </tr>
                            <tr>
                                <th style={thTextStyle}>เข้า</th>
                                <th style={thTextStyle}>พัก</th>
                                <th style={thTextStyle}>กลับเข้า</th>
                                <th style={thTextStyle}>ออก</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={tdTextStyle}>{props.employee.startTime !== null ? '('+moment(props.employee.startTime).format('HH:mm')+')' : '-'}</td>
                                <td style={tdTextStyle}>{props.employee.breakTime !== null ? '('+moment(props.employee.breakTime).format('HH:mm')+')' : '-'}</td>
                                <td style={tdTextStyle}>{props.employee.continueTime !== null ? '('+moment(props.employee.continueTime).format('HH:mm')+')' : '-'}</td>
                                <td style={tdTextStyle}>{props.employee.endTime !== null ? '('+moment(props.employee.endTime).format('HH:mm')+')' : '-'}</td>
                            </tr>
                            <tr>
                                <td style={tdTextStyle}>{props.employee.startScan !== '' ? props.employee.startScan : '-'}</td>
                                <td style={tdTextStyle}>{props.employee.breakScan !== '' ? props.employee.breakScan : '-'}</td>
                                <td style={tdTextStyle}>{props.employee.continueScan !== '' ? props.employee.continueScan : '-'}</td>
                                <td style={tdTextStyle}>{props.employee.endScan !== '' ? props.employee.endScan : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
            </div>
            <div className="col-12 text-center mt-3">
                <h5 style={{fontSize: '16px', textDecoration: 'underline'}}>รายการแก้ไข</h5>
            </div>
            <div className="col-12">
                <table>
                    <thead>
                        <tr>
                            <th style={{width: '20%'}}>บันทึกเมื่อ</th>
                            <th style={{width: '60%'}}>รายการ</th>
                            <th style={{width: '20%'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.employee.timetableRequestList.map(ttr => <TimeTableRequestBlock ttr={ttr} handleHrProcessTimetableRequest={props.handleHrProcessTimetableRequest} /> )}
                        {props.employee.scanTimeRequestList.map(str => <ScanTimeRequestBlock str={str} handleHrProcessTimeScanRequest={props.handleHrProcessTimeScanRequest} />)}
                        {props.employee.leaveRequestList.map(lr => <LeaveRequestBlock lr={lr} handleHrProcessLeaveRequest={props.handleHrProcessLeaveRequest}/>)}
                    </tbody>
                </table>
            </div>
        </div>
    )


}

const LeaveRequestBlock = props => {

    const [isDisabled, setIsDisabled] = useState(false);
    const handleClick = (id, status, date, employeeId) => {
        setIsDisabled(true)
        props.handleHrProcessLeaveRequest(id, status, date, employeeId, () => {
            setIsDisabled(false)
        })
    }

    let lr = props.lr

    return (<tr style={{background:'#fff', border:'2px solid #e3e3e3'}}>
        <td style={{width: '20%'}}>
            <span style={smallText}>{moment(lr.createAt).format('DD/MM/YYYY')}</span>
            <br/>
            <span style={smallText}>โดย: {lr.createBy}</span>
        </td>
        <td>
            <span>แจ้ง: <span style={{textDecoration: 'underline'}}>{lr.type} ({lr.numberOfDay} วัน)</span></span>
            <br/>
            <span>หมายเหตุ: <span style={{textDecoration: 'underline'}}>{lr.remark}</span></span>
        </td>
        <td style={{width: '20%'}}>
            <div className="d-flex justify-content-around">
            <button onClick={() => handleClick(lr.id, true, lr.date, lr.employeeId )} className="btn btn-success" disabled={isDisabled}>อนุมัติ</button>
            <button onClick={() => handleClick(lr.id, false, lr.date, lr.employeeId )} className="btn btn-danger" disabled={isDisabled}>ปฏิเสธ</button>
            </div>
        </td>
    </tr>)
}

const TimeTableRequestBlock = props => {

    const [isDisabled, setIsDisabled] = useState(false);
    const handleClick = (id, status, date, employeeId) => {
        setIsDisabled(true)
        props.handleHrProcessTimetableRequest(id, status, date, employeeId, () => {
            setIsDisabled(false)
        })
    }

    let ttr = props.ttr
    const timeText = ttr.breakTime === null ? moment(ttr.startTime).format('HH:mm') + ' - ' + moment(ttr.endTime).format('HH:mm')
    : moment(ttr.startTime).format('HH:mm') + ' - ' + moment(ttr.breakTime).format('HH:mm') + ', ' + moment(ttr.continueTime).format('HH:mm') + ' - ' + moment(ttr.endTime).format('HH:mm')
    return (<tr style={{background:'#fff', border:'2px solid #e3e3e3'}}>
        <td style={{width: '20%'}}>
            <span style={smallText}>{moment(ttr.createAt).format('DD/MM/YYYY')}</span>
            <br/>
            <span style={smallText}>โดย: {ttr.createBy}</span>
        </td>
        <td>
            <span>เปลี่ยนเวลา: <span style={{textDecoration: 'underline'}}>{timeText}</span></span>
            <br/>
            <span>หมายเหตุ: <span style={{textDecoration: 'underline'}}>{ttr.remark}</span></span>
        </td>
        <td style={{width: '20%'}}>
            <div className="d-flex justify-content-around">
                <button onClick={() => handleClick(ttr.id, true, ttr.date, ttr.employeeId )} className="btn btn-success" disabled={isDisabled}>อนุมัติ</button>
                <button onClick={() => handleClick(ttr.id, false, ttr.date, ttr.employeeId )} className="btn btn-danger" disabled={isDisabled}>ปฏิเสธ</button>
            </div>
        </td>
    </tr>)

}

const ScanTimeRequestBlock = props => {
    const [isDisabled, setIsDisabled] = useState(false);
    const handleClick = (id, status, date, employeeId) => {
        setIsDisabled(true)
        props.handleHrProcessTimeScanRequest(id, status, date, employeeId, () => {
            setIsDisabled(false)
        })
    }

    let str = props.str
    const engType = str.type === 'start' ? 'เข้า' : str.type === 'break' ? 'พัก': str.type === 'continue' ? 'กลับเข้า': 'ออก';
    return (<tr style={{background:'#fff', border:'2px solid #e3e3e3'}}>
        <td style={{width: '20%'}}>
            <span style={smallText}>{moment(str.createAt).format('DD/MM/YYYY')}</span>
            <br/>
            <span style={smallText}>โดย: {str.createBy}</span>
        </td>
        <td>
            <span>แจ้งเพิ่มเวลาแสกนิ้ว: <span style={{textDecoration: 'underline'}}>{engType}งาน : {str.time}</span></span>
            <br/>
            <span>หมายเหตุ: <span style={{textDecoration: 'underline'}}>{str.remark}</span></span>
        </td>
        <td style={{width: '20%'}}>
            <div className="d-flex justify-content-around">
                <button onClick={() => handleClick(str.id, true, str.date, str.employeeId )} className="btn btn-success" disabled={isDisabled}>อนุมัติ</button>
                <button onClick={() => handleClick(str.id, false, str.date, str.employeeId )} className="btn btn-danger" disabled={isDisabled}>ปฏิเสธ</button>
            </div>
        </td>
    </tr>)
}

export default OTExtraLeaveRequest

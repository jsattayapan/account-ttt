import React, {useEffect, useState, useRef} from 'react'
import moment from 'moment'

const smallText = {fontSize: '14px', lineHeight: 0.8}

export const TimeTableRequestBlock = props => {

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
        
        <td>
        <span>วันที่: <span style={{textDecoration: 'underline'}}>{ttr.date}</span></span>
        <br/>
            <span>เปลี่ยนเวลา: <span style={{textDecoration: 'underline'}}>{timeText}</span></span>
            <br/>
            <span>หมายเหตุ: <span style={{textDecoration: 'underline'}}>{ttr.remark}</span></span>
        </td>
        <td style={{width: '20%'}}>
            <span style={smallText}>{moment(ttr.createAt).format('DD/MM/YYYY')}</span>
            <br/>
            <span style={smallText}>โดย: {ttr.createBy}</span>
        </td>
        <td style={{width: '20%'}}>
            <div className="d-flex justify-content-around">
                <button onClick={() => handleClick(ttr.id, true, ttr.date, ttr.employeeId )} className="btn btn-success" disabled={isDisabled}>อนุมัติ</button>
                <button onClick={() => handleClick(ttr.id, false, ttr.date, ttr.employeeId )} className="btn btn-danger" disabled={isDisabled}>ปฏิเสธ</button>
            </div>
        </td>
    </tr>)
                        
}

export const ScanTimeRequestBlock = props => {
    const [isDisabled, setIsDisabled] = useState(false);
    const handleClick = (id, status, date, employeeId) => {
        setIsDisabled(true)
        props.handleHrProcessTimeScanRequest(id, status, date, employeeId, () => {
            setIsDisabled(false)
        })
    }

    let str = props.str
    const engType = str.type === 'start' ? 'เข้า' : str.type == 'break' ? 'พัก': str.type == 'continue' ? 'กลับเข้า': 'ออก';
    return (<tr style={{background:'#fff', border:'2px solid #e3e3e3'}}>
       
        <td>
        <span>วันที่: <span style={{textDecoration: 'underline'}}>{str.date}</span></span>
        <br/>
            <span>แจ้งเพิ่มเวลาแสกนิ้ว: <span style={{textDecoration: 'underline'}}>{engType}งาน : {str.time}</span></span>
            <br/>
            <span>หมายเหตุ: <span style={{textDecoration: 'underline'}}>{str.remark}</span></span>
        </td>
        <td style={{width: '20%'}}>
            <span style={smallText}>{moment(str.createAt).format('DD/MM/YYYY')}</span>
            <br/>
            <span style={smallText}>โดย: {str.createBy}</span>
        </td>
        <td style={{width: '20%'}}>
            <div className="d-flex justify-content-around">
                <button onClick={() => handleClick(str.id, true, str.date, str.employeeId )} className="btn btn-success" disabled={isDisabled}>อนุมัติ</button>
                <button onClick={() => handleClick(str.id, false, str.date, str.employeeId )} className="btn btn-danger" disabled={isDisabled}>ปฏิเสธ</button>
            </div>
        </td>
    </tr>)
}

export const LeaveRequestBlock = props => {

    const [isDisabled, setIsDisabled] = useState(false);
    const handleClick = (id, status, date, employeeId) => {
        setIsDisabled(true)
        props.handleHrProcessLeaveRequest(id, status, date, employeeId, () => {
            setIsDisabled(false)
        })
    }

    let lr = props.lr

    return (<tr style={{background:'#fff', border:'2px solid #e3e3e3'}}>
        
        <td>
        <span>วันที่: <span style={{textDecoration: 'underline'}}>{lr.date}</span></span>
        <br/>
            <span>แจ้ง: <span style={{textDecoration: 'underline'}}>{lr.type} ({lr.numberOfDay} วัน)</span></span>
            <br/>
            <span>หมายเหตุ: <span style={{textDecoration: 'underline'}}>{lr.remark}</span></span>
        </td>
        <td style={{width: '20%'}}>
            <span style={smallText}>{moment(lr.createAt).format('DD/MM/YYYY')}</span>
            <br/>
            <span style={smallText}>โดย: {lr.createBy}</span>
        </td>
        <td style={{width: '20%'}}>
            <div className="d-flex justify-content-around">
            <button onClick={() => handleClick(lr.id, true, lr.date, lr.employeeId )} className="btn btn-success" disabled={isDisabled}>อนุมัติ</button>
            <button onClick={() => handleClick(lr.id, false, lr.date, lr.employeeId )} className="btn btn-danger" disabled={isDisabled}>ปฏิเสธ</button>
            </div>
        </td>
    </tr>)
}
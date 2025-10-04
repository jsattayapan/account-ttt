import React, {useEffect, useState} from 'react'
import moment from 'moment';
import {hrProcessLeaveRequest} from './../../tunnel'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {LeaveRequestBlock} from './../components/requestBlock'

const LeaveList = props => {

    const sortedItems = props.leaveList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

// Step 2: Group by year
const groupedByYear = sortedItems.reduce((groups, item) => {
    const date = new Date(item.startDate)
    const year = date.getFullYear();
    if (!groups[year]) {
        groups[year] = [];
    }
    groups[year].push(item);
    return groups;
}, {});


const handleHrProcessLeaveRequest = (requestId, status, date, employeeId, callback) => {
    hrProcessLeaveRequest({requestId, status, approveBy: props.user.username}, res => {
        if(res.status){
            let toastProps = {position: "bottom-right",}
            if(!status){
                toastProps['icon'] = '❌'
            }
            toast.success( `${status ? "อนุมัติ" : "ปฏิเสธ"} บันทึกวันลา ID:` + employeeId + " วันที่:" + date + " สำเร็จ", toastProps)
            props.removeRequestWhenSuccess(requestId, date, employeeId)

            callback()
        }else{
            toast.error(res.msg)
            callback()
        }
    })
}

    const remainPublicHoliday = props.employeePublicHolidayList.filter(day => day.status === 'valid')


    return(
        <div className='row'>
            <style>
          {
            `
            .tooltiper {
              position: relative;

            }

            .tooltiper:hover {
              cursor: help;

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
              top: 50px;

              z-index: 1;
            }
            .tooltiper:hover .tooltiptext {
              visibility: visible;
            }
            `
          }
        </style>
            <div className='col-12 mb-2'>
                <h4>สิทธิการลาคงเหลือ</h4>
            </div>
            <div className='col-4 text-center'>
                <div style={{display: 'inline-block'}} className='tooltiper'>
                <h4 style={{color:'#0373fc'}}><b>{remainPublicHoliday.length}</b></h4>
                    <b>Extra</b>
                    <span className="tooltiptext">
                        <u>วันหยุดคงเหลือ</u>
                        <ul>
                          {remainPublicHoliday.map(day => <li style={{textAlign: 'left'}}>{day.name}</li>)}
                        </ul>
                      </span>
                </div>
            </div>
            <div className='col-4 text-center'>
                <h4 style={{color:'#0373fc'}}><b>{props.employeeInfo.remainSickLeaveDay}</b></h4>
                <b>ลาป่วย</b>
            </div>
            <div className='col-4 text-center'>
            <h4 style={{color:'#0373fc'}}><b>{props.employeeInfo.remainYearlyLeaveDay}</b></h4>
                <b>พักร้อน</b>
            </div>
            <div className='col-12'>
                {
                    props.leaveRequest.length ?
                    <div style={{boxShadow:'0px 4px 8px rgba(0, 0, 0, 0.5)', padding: '10px'}}>
                    <table className='table table-bordered table-striped' >
                    <thead>
                        <tr>

                            <th style={{width: '60%'}}>รายการ</th>
                            <th style={{width: '20%'}}>บันทึกเมื่อ</th>
                            <th style={{width: '20%'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.leaveRequest.map(lr => <LeaveRequestBlock lr={lr} handleHrProcessLeaveRequest={handleHrProcessLeaveRequest}/>)}

                    </tbody>
                    <ToastContainer />
                </table></div> : ''

                }

            </div>
            <div className='col-12 mt-4'>
                <h4>ประวัติการลา</h4>
            </div>
            <div className='col-12'>
            <table className='table table-striped'>
                    {
                        Object.keys(groupedByYear)
                        .sort((a, b) => b - a) // Sort years in ascending order
                        .map(year =>
                        <tbody>
                            <tr>
                                <th style={{ width: '15%'}} className="text-center" >วันที่หยุดในปี {year}</th>
                                <th style={{ width: '30%'}} className="text-center">รายละเอียด</th>
                                <th style={{ width: '15%'}} className="text-center">ประเภท</th>
                                <th style={{ width: '13%'}} className="text-center">ส่งคำร้องโดย</th>
                                <th style={{ width: '14%'}} className="text-center">วันที่บันทึก</th>
                                <th style={{ width: '13%'}} className="text-center">อนุมัติโดย</th>
                            </tr>
                            {
                                groupedByYear[year].map(leave =>
                                    <tr>
                                        <td style={{width: '15%'}} >{moment(leave.startDate).format('DD/MM/YYYY')}</td>
                                        <td style={{width: '30%'}}>{leave.remark}</td>
                                        <td style={{width: '15%'}}>{leave.type}</td>
                                        <td style={{width: '13%'}}>{leave.createBy}</td>
                                        <td style={{width: '14%'}}>{moment(leave.timestamp).format('DD/MM/YYYY')}</td>
                                        <td style={{width: '13%'}}>{leave.approveBy}</td>

                                    </tr>

                                )
                            }
                        </tbody>
                        )
                    }
                </table>
            </div>
        </div>
    )
}

export default LeaveList;

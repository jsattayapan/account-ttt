import React, {useEffect, useState} from 'react'
import moment from 'moment'
import Swal from 'sweetalert2'
import { IP } from './../../../../constanst'

const  isMoreThan2Months = (dateStr) => {
  const inputDate = moment(dateStr, "DD/MM/YYYY");
  const twoMonthsAgo = moment().subtract(2, "months");
  return inputDate.isBefore(twoMonthsAgo, "day");
}

export const Checklist = props => {
    const getGrade = (p, m) => {
  const pc = (p / m) * 100;
  return { 
    percentage: pc.toFixed(2), 
    grade: pc >= 90 ? 'A' : pc >= 70 ? 'B' : pc >= 50 ? 'C' : 'D' 
  };
};
    
    
    
     const levelList = [
                  {label: 'E', levels: ['E1','E2','E3','E4','E5','E6']},
                  {label: 'I', levels: ['I1','I2','I3','I4','I5','I6']},
                  {label: 'M', levels: ['M1','M2','M3','M4','M5','M6']},
                  {label: 'U', levels: ['U1','U2','U3','U4','U5','U6']},
                  {label: 'A', levels: ['A1','A2','A3','A4','A5','A6']},
                  {label: 'S', levels: ['S1','S2','S3','S4','S5','S6']},
                  ]
    
    
    const openProbationPopup = () => {
        Swal.fire({
  title: 'ประเมินผล',
  html: `
    <div>
      <div class="row mb-2">
        <div class="col-6">
          <button id="btn-pass" class="btn btn-outline-success w-100">ผ่าน</button>
        </div>
        <div class="col-6">
          <button id="btn-fail" class="btn btn-outline-danger w-100">ไม่ผ่าน</button>
        </div>
      </div>

      <div id="pass-fields" style="display:none;">
        <select id="levelSelect" class="swal2-select mb-2">
          <option value="">-- กรุณาเลือก Level --</option>
          ${levelList
            .map(list => `
              <optgroup label="${list.label}">
                ${list.levels.map(lvl => `<option value="${lvl}">${lvl}</option>`).join('')}
              </optgroup>
            `)
            .join('')}
        </select>

        <div class="swal2-input-label">เงินเดือน</div>
        <input type="number" id="salaryInput" class="swal2-input" placeholder="ระบุเงินเดือน">

        <div class="swal2-input-label">Incentive</div>
        <input type="number" id="incentiveInput" class="swal2-input" placeholder="ระบุ Incentive">
      </div>
    </div>
  `,
  showCancelButton: true,
  confirmButtonText: 'บันทึก',
  didOpen: () => {
    const btnPass = document.getElementById('btn-pass');
    const btnFail = document.getElementById('btn-fail');
    const passFields = document.getElementById('pass-fields');

    btnPass.addEventListener('click', () => {
      btnPass.className = 'btn btn-success w-100';
      btnFail.className = 'btn btn-outline-danger w-100';
      passFields.style.display = 'block';
    });

    btnFail.addEventListener('click', () => {
      btnFail.className = 'btn btn-danger w-100';
      btnPass.className = 'btn btn-outline-success w-100';
      passFields.style.display = 'none';
    });
  },
  preConfirm: () => {
    const passBtn = document.getElementById('btn-pass').classList.contains('btn-outline-success');
    const failBtn = document.getElementById('btn-fail').classList.contains('btn-outline-danger');
    const level = document.getElementById('levelSelect')?.value;
    const salary = document.getElementById('salaryInput')?.value;
    const incentive = document.getElementById('incentiveInput')?.value || 0;
    const status = !passBtn
    
    if(passBtn && failBtn){
        Swal.showValidationMessage('กรุณาเลือกผลการประเมิน');
              return false;
    }
    
    if(status){
        if(!level){
            Swal.showValidationMessage('กรุณาใส่ระดับพนักงาน');
              return false;
        }
        if(!salary){
                Swal.showValidationMessage('กรุณาใส่ฐานเงินเดือน');
                  return false;
            }
        if(parseInt(salary) < 0){
                    Swal.showValidationMessage('กรุณาใส่ฐานเงินเดือนให้ถูกต้อง');
                      return false;
                }
    }

    return { status,  level, salary, incentive };
  }
}).then(result => {
  if (result.isConfirmed) {
    console.log(result.value); // { status,  level, salary, incentive }
    props.submitProbationResult(result.value, res => {
        if(res.status){
            Swal.fire(
              'สำเร็จ!',
              'ข้อมูลถูกบันทึก',
              'success'
          )
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
    
    const employee = props.employeeInfo
                  
   
    return(
      <div className='row'>
        <div className='col-6'>
                  <h4>ผลการประเมิน</h4>
              </div>
        <div className='col-6 float_right'>
                  {
                (isMoreThan2Months(employee.startJob) && !employee.level && !employee.performanceStatus) ? 
                <button onClick={openProbationPopup} className="btn btn-warning">ประเมินผลทดลองงาน</button>: ''}
              </div>
              <div className='col-12'>
                  <table className='table table-striped'>
                      <thead>
                          <tr>
                              
                              <th style={{width: '50%'}}>ประวัติ Inspection </th>
                            <th>วันที่บันทึก</th>
                            <th> </th>
                            <th> </th>
                            <th> </th>
                          </tr>
                      </thead>
                      <tbody>
                          {props.checklist.length !== 0 ? 
                          props.checklist.map(link => 
                              <tr>
                                <td style={{width: '50%'}}>
                                    {link.name}
                                    </td>
                                    <td>{moment(new Date(link.createAt)).format('DD MMM')}</td>
                                    <td>{link.createBy}</td>
                                    <td>{link.points}/{link.maxPoint} ({getGrade(link.points, link.maxPoint).grade})</td>
                                    <td>
                                    <a 
                href={`${IP}/public/employeeChecklistRecord/${link.id}.pdf`}
                target="_blank" 
                rel="noopener noreferrer" 
className="btn btn-success btn-sm">ดูผล</a>
                                    </td>
                                    
                            </tr>
                          )   :
                          <tr>
                              <td align='center' colSpan={4}>ไม่มีข้อมูล</td>
                          </tr>
                      }
                      </tbody>
                  </table>
              </div>
      </div>
    )
  }

  export default Checklist
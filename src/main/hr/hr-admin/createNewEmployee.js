import React, {useState, useEffect} from "react";
import Select from 'react-select';
import Swal from 'sweetalert2'
import moment from 'moment'
import { getDepartments, hrSubmitNewEmployee, getPositions } from './../tunnel'

export const CreateNewEmployee = props => {

    let [nationality, setNationality] = useState('')
    let [dayOff, setDayOff] = useState('')
    let [departments, setDepartments] = useState([])
    let [selectedDepartment, setSelectedDepartment] = useState('')
    let [employer, setEmployer] = useState('')
    let [imageUrl, setImageUrl] = useState('')
    let [imageFile, setImageFile] = useState({})
    let [positionList, setPositionList] = useState([])
    let [validatePositionList, setValidatePositionList] = useState([])
    let [selectedPosition, setSelectedPosition] = useState(null)

    let [nationalId, setNationalId] = useState('')
    let [name, setName] = useState('')
    let [dob, setDob] = useState('')
    let [phone, setPhone] = useState('')
    let [address, setAddress] = useState('')
    let [role, setRole] = useState('')
    let [bankAccount, setBankAccount] = useState('')
    let [startJob, setStartJob] = useState('')


    useEffect(() => {
        //get available Employee Id

        //get all departments
        getDepartments(res => {
            if(res.status){
                console.log(res);
                setDepartments(res.departments.map(dept => ({value: dept.id, label: dept.name})))
            }
        })
        
        getPositions(res => {
            if(res.status){
                setPositionList(res.positionList)
            }
        })

    },[])
    
    const setPositionListByDepartment = departmentId => {
        setValidatePositionList(positionList.filter(pos => pos.departmentId === departmentId).map(pos => ({value: pos.id, label: pos.name})))
    }
    

    const handleCreateEmployeeButtonClick = () => {
        let errorList = []
        if(imageUrl === ''){
            errorList = [ ...errorList, 'กรุณาใส่รูปโปรไฟล์พนักงาน']
        }
        if(nationalId.trim() === ''){
            errorList = [ ...errorList, 'กรุณาใส่หมายเลขประชาชน/พาสปอร์ต']
        }
        if(name.trim() === ''){
            errorList = [ ...errorList, 'กรุณาใส่ชื่อ - นามสกุล']
        }
        if(dob.trim() === ''){
            errorList = [ ...errorList, 'กรุณาใส่วันเกิด']
        }
        if(phone.trim() === ''){
            errorList = [ ...errorList, 'กรุณาใส่เบอร์โทร']
        }
        if(employer.trim() === ''){
            errorList = [ ...errorList, 'กรุณาเลือกหน่วยงาน']
        }
        if(selectedDepartment.trim() === ''){
            errorList = [ ...errorList, 'กรุณาเลือกแผนก']
        }
        if(selectedPosition === null){
            errorList = [ ...errorList, 'กรุณาใส่ตำแหน่งงาน']
        }
        if(startJob.trim() === ''){
            errorList = [ ...errorList, 'กรุณาใส่วันที่เริ่มงาน']
        }

        if(errorList.length === 0){

            hrSubmitNewEmployee({
                nationalId,
                dob: moment(dob).format('DD/MM/YYYY'),
                selectedDepartment,
                role: selectedPosition.label,
                positionId: selectedPosition.value,
                startJob: moment(startJob).format('DD/MM/YYYY'),
                dayOff,
                bankAccount,
                name,
                nationality,
                phone,
                address,
                employer,
                imageFile
            }, res => {
                if(res.status){
                    Swal.fire(
                        "สำเร็จ!",
                        `ข้อมูลถูกต้อง`,
                        "success"
                      );
                      props.backBtn()
                      
                }else{
                    Swal.fire(
                        "เกิดข้อผิดพลาด",
                        res.msg,
                        "error"
                      );
                }
            })
        }else{
            const errorListHtml = errorList.map(msg => `<li>${msg}</li>`).join('');
            Swal.fire({
                title: 'ข้อมูลไม่ถูกต้อง',
                html: `<ul style="text-align: left;">
                ${errorListHtml}
              </ul>`,
                icon: 'error',
            })
        }
        
    }

    const imageOnChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                setImageFile(file)
                setImageUrl(event.target.result)
            };
            reader.readAsDataURL(file);
        }
    }

    const nationalities = [
        {label:'ไทย', value: 'ไทย'},
        {label:'ลาว', value: 'ลาว'},
        {label:'กัมบูชา', value: 'กัมบูชา'},
        {label:'พม่า', value: 'พม่า'},
      ]
    
      const daysOfWeek = [
        { label: 'วันอาทิตย์', value: '1' },
        { label: 'วันจันทร์', value: '2' },
        { label: 'วันอังคาร', value: '3' },
        { label: 'วันพุธ', value: '4' },
        { label: 'วันพฤหัสบดี', value: '5' },
        { label: 'วันศุกร์', value: '6' },
        { label: 'วันเสาร์', value: '7' }
      ];

      const employerList = [
        {label:'Avatara', value: 'AV'},
        {label:'Pavilion', value: 'PV'},
        {label:'ฝึกงาน', value: 'TN'}
      ]

    const onNationalityChange = e => {
        setNationality(e.value)
    }

    return (
        <div style={{maxWidth: '900px'}} className="row m-auto">
            <style>
        {`
          table tr {
            margin: 0 0 30px 0;
          }
        
          .fixIconEmp:hover {
          cursor: pointer;
          }
        
        .red-text {
        color: red;
        }

        `}
      </style>
            <div className="col-12 mt-2 mb-4">
                <h4>สร้างพนักงานใหม่</h4>
            </div>
            <div className="col-12">
                <h5>ข้อมูลส่วนตัว</h5>
                <hr />
                <table>
                    <tbody>
                        <tr>
                            <th style={{width: '40%'}}>รูปโปรไฟล์พนักงาน <span className="red-text">*</span></th>
                            <td>
                                <label for="employeeChangeInput" >
                                     {
                                        imageUrl === '' ? <div className="d-flex justify-content-center align-items-center mx-4 fixIconEmp" 
                                        style={{width: '160px', height: '160px', background: '#e3e3e3', borderRadius: '50%'}}>
                                    + รูปโปรไฟล์
                                    </div> :
                                        <img
                                        className="mx-4 fixIconEmp"
                                        src={imageUrl}
                                        style={{borderRadius: '50%'}}
                                        alt="User Profile"
                                        height="160"
                                        width="160" />
                                     }                                     
                                 </label>
                                 <input id="employeeChangeInput"type="file" accept="image/*" onChange={imageOnChange} style={{display: 'none'}} />
                      
                                
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: '40%'}}>หมายเลขประชาชน/พาสปอร์ต <span className="red-text">*</span></th>
                            <td><input onChange={(e) => setNationalId(e.target.value)}  style={{width: '100%'}} type="text" /></td>
                        </tr>
                        <tr>
                            <th style={{width: '40%'}}>ชื่อ - นามสกุล <span className="red-text">*</span></th>
                            <td><input onChange={(e) => setName(e.target.value)} style={{width: '100%'}} type="text" /></td>
                        </tr>
                        <tr>
                            <th style={{width: '40%'}}>สัญชาติ <span className="red-text">*</span></th>
                            <td>
                                <Select 
                                    styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                                    onChange={onNationalityChange} options={nationalities} 
                                    />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: '40%'}}>วันเกิด <span className="red-text">*</span></th>
                            <td><input type="date" onChange={(e) => setDob(e.target.value)} style={{width: '100%'}} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="col-12 mt-4">
                <h5>ข้อมูลติดต่อ</h5>
                <hr />
                <table>
                    <tbody>
                        <tr>
                            <th style={{width: '40%'}}>เบอร์โทร <span className="red-text">*</span></th>
                            <td><input onChange={(e) => setPhone(e.target.value)} type="text" style={{width: '100%'}} /></td>
                        </tr>
                        <tr>
                            <th style={{width: '40%'}}>ที่อยู่</th>
                            <td><textarea onChange={(e) => setAddress(e.target.value)} style={{width: '100%'}}></textarea></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="col-12 mt-4">
                <h5>การทำงาน</h5>
                <hr />
                <table>
                    <tbody>
                        <tr>
                            <th style={{width: '40%'}}>หน่วยงาน <span className="red-text">*</span></th>
                            <td><Select 
                                    styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                                    onChange={(e) => setEmployer(e.value)} options={employerList} 
                                    />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: '40%'}}>แผนก <span className="red-text">*</span></th>
                            <td><Select 
                                    styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                                    onChange={(e) => {
                                        setSelectedDepartment(e.value)
                                        setPositionListByDepartment(e.value)
                                        setSelectedPosition(null)
                                    }} options={departments} 
                                    />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: '40%'}}>ตำแหน่งงาน <span className="red-text">*</span></th>
                            <td><Select 
                                    styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                                    onChange={(e) => {
                                        console.log(e)
                                        setSelectedPosition(e)
                                    }} options={validatePositionList} 
                                    value={selectedPosition}
                                    /></td>
                        </tr>
                        <tr>
                            <th style={{width: '40%'}}>วันที่เริ่มงาน <span className="red-text">*</span></th>
                            <td><input type="date" onChange={(e) => setStartJob(e.target.value)} style={{width: '100%'}} /></td>
                        </tr>
                        <tr>
                            <th style={{width: '40%'}}>วันหยุดประจำสัปดาห์</th>
                            <td><Select 
                                    styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                                    onChange={e => setDayOff(e.value)} options={daysOfWeek} 
                                    /></td>
                        </tr>
                        <tr>
                            <th style={{width: '40%'}}>บัญชีธนาคาร</th>
                            <td><input onChange={(e) => setBankAccount(e.target.value)} type="text" style={{width: '100%'}} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="col-12 my-4 d-flex justify-content-end">
                <button onClick={handleCreateEmployeeButtonClick} className="btn btn-success mx-4">บันทึก</button>
                <button onClick={props.backBtn} className="btn btn-danger">ยกเลิก</button>
            </div>
        </div>
    )
}

export default CreateNewEmployee;
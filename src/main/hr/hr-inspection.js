import React, {useState} from "react"
import Swal from 'sweetalert2';
import { useEffect } from "react"
import {getChecklistLinkList, getChecklistHistrory, getAnswerByRecordId, 
    getChecklistItemByChecklistId, uploadChecklistAnswer, submitChecklistRecord } from './tunnel'
    import { IP } from './../../constanst'
import moment from "moment"



import ReactDOM from 'react-dom';


const HRInspection = (props) => {
    let [linkList, setLinkList] = useState([])
    let [recordList, setRecordList] = useState([])
    let [currentPage, setCurrentPage] = useState('list')
    let [checklist, setCheckList] = useState('')
    let [associate, setAssociate] = useState('')
    let [showHistrory, setShowHistrory] = useState(false)

    


    useEffect(() => {
        getChecklistLinkListFunc();
    },[])

    const getChecklistLinkListFunc = () => {
        getChecklistLinkList(res => {
            if(res.status){
                setLinkList(sortByNextDue(res.linkList))
            }
        })
        
        getChecklistHistrory(res => {
            console.log(res)
            if(res.status){
                setRecordList(sortByCreateByDesc(res.recordList))
            }
        })
    }

    const sortByCreateByDesc = (list) => {
        return [...list].sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
      };

      const sortByNextDue = (list) => {
        return [...list].sort((a, b) => new Date(a.nextCheck) - new Date(b.nextCheck));
      };

    const startInspectClick = (checklist, as) => {
//        setCurrentPage('inspect')
//        setCheckList(checklist)
//        setAssociate(as)
        let maxPoint = 0
        
        getChecklistItemByChecklistId({checklistId: checklist.checklistId}, res => {
            console.log(res)
            if(res.status){
                maxPoint = res.itemList.length * 4
                
            }
        })
        
        Swal.fire({
      title: 'บันทึกผลการประเมิน',
      html: `
<div style="width:400px;">
    <h6>${checklist.name}</h6>
<h6>[${as.id}] ${as.name}</h6>
     <input id="pdfInput" type="file" accept="application/pdf" />
    <input placeholder='คะแนนรวม' type="number" id="points" class="swal2-input" style="margin-top:10px;" />
<input placeholder='ประเมินโดย' type="text" id="inspectBy" class="swal2-input" style="margin-top:10px;" />
</div>
  `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
    const points = document.getElementById('points').value;
    const pdfInput = Swal.getPopup().querySelector('#pdfInput');
          const inspectBy = document.getElementById('inspectBy').value;

    if (!points) {
      Swal.showValidationMessage('กรุณาใส่คะแนนรวม');
      return false;
    }
    if(parseInt(points) < 0 || parseInt(points) > maxPoint){
        Swal.showValidationMessage('กรุณาใส่คะแนนรวมให้ถูกต้อง');
      return false;
    }
    if (!inspectBy) {
      Swal.showValidationMessage('กรุณาระบุผู้ประเมิน');
      return false;
    }
          
          if (!pdfInput.files.length) {
      Swal.showValidationMessage('กรุณาอัพโหลดใบประเมิน');
      return false;
    }

    return { pdfInput: pdfInput.files[0], inspectBy,  points, maxPoint};
  }
    }).then(result => {
      if (result.isConfirmed) {
        console.log('Selected:', result.value);
          submitChecklistRecord({
              linkId: checklist.id, 
              createBy: props.user.username,
              inspectBy: result.value.inspectBy,
              checklistId: checklist.checklistId,
              points: result.value.points,
              maxPoint: result.value.maxPoint, 
              file: result.value.pdfInput
          }, res => {
              if(res.status){
                  Swal.fire(
              'สำเร็จ!',
              'ข้อมูลถูกบันทึก',
              'success'
          )
                  getChecklistLinkListFunc()
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

    const viewInspectResultClick = (checklist, as) => {
        setCurrentPage('result')
        setCheckList(checklist)
        setAssociate(as)
    }

    const openNewWindow = (cl, ass) => {
        const newWindow = window.open('', '_blank');
        newWindow.document.body.innerHTML = '<div id="new-window-root"></div>';
        ReactDOM.render(
          <React.StrictMode>
            <InspectionPrint checklist={cl} associate={ass}/>
          </React.StrictMode>,
          newWindow.document.getElementById('new-window-root')
        );
      };

      function checkDateColor(date) {
        const today = new Date().setHours(0, 0, 0, 0);
        const inputDate = new Date(date).setHours(0, 0, 0, 0);
      
        return inputDate < today ? 'red' : inputDate === today ? 'orange' : 'green';
      }

    

return currentPage === 'result'? <InspectionResult  backBtn={() => setCurrentPage('list')} checklist={checklist} associate={associate} /> : currentPage === 'inspect'? <InspectionStart getChecklistLinkList={getChecklistLinkListFunc}  backBtn={() => setCurrentPage('list')} checklist={checklist} associate={associate} /> :<div className="p-2">
    {console.log(linkList)}
    <div className="col-12">
        <h3>Inspect List</h3> <button onClick={() => setShowHistrory(!showHistrory)} className="btn btn-info">{showHistrory ? 'ดูรายการกำหนดส่ง' : 'ดูประวัติ'}</button>
    </div>
    <div className="col-12">
        {
            showHistrory ? 
            <table className="table table-border">
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
                        {
                            recordList.map(link => <tr>
                                <td style={{width: '50%'}}>
                                    <div>
                                    <b>{link.clName}</b>
                                    <br />
                                    <b>สำหรับ: </b>{link.type === 'employee' && `[${link.linkId}] `}{link.linkName}
                                    </div>
                                    </td>
                                    <td>{moment(new Date(link.createAt)).format('DD MMM')}</td>
                                    <td>{link.createBy}</td>
                                    <td>{link.points}/{link.maxPoint}</td>
                                    <td>
                                    <button onClick={() => viewInspectResultClick({
                                        id:link.id, 
                                        name: link.clName, 
                                        type: link.type,
                                        createAt: link.createAt,
                                        checklistId: link.checklistId,
                                        inspectBy: link.inspectBy,
                                                points: link.points,
                                                maxPoint: link.maxPoint,
                                                     filename: link.filename
                                        },{id: link.linkId, name: link.linkName})} className="btn btn-success btn-sm">ดูผล</button>
                                    </td>
                                    
                            </tr>)
                        }
                       
                        
                    </tbody>
                </table>
            :
            <table className="table table-border">
                    <thead>
                        <tr>
                            <th style={{width: '50%'}}>รายการ Inspection </th>
                            <th>กำหนด </th>
                            <th> </th>
                            <th> </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            linkList.map(link => <tr>
                                <td style={{width: '50%'}}>
                                    <div>
                                    <b>{link.checklistName}</b>
                                    <br />
                                    <b>สำหรับ: </b>[{link.linkId}] {link.linkName}
                                    </div>
                                    </td>
                                    <td style={{color:checkDateColor(new Date(link.nextCheck))}}>{moment(new Date(link.nextCheck)).format('DD/MM/YYYY')}</td>
                                    <td><button onClick={() => openNewWindow({
                                        id:link.id, 
                                        name: link.checklistName, 
                                        type: link.type,
                                        checklistId: link.checklistId,
                                        },{id: link.linkId, name: link.linkName, deptName: link.deptName, role: link.role, imageUrl: link.imageUrl})} className="btn btn-info btn-sm">Download</button></td>
                                    <td><button onClick={() => startInspectClick({
                                        id:link.id, 
                                        name: link.checklistName, 
                                        type: link.type,
                                        checklistId: link.checklistId,
                                        createBy: props.user.username
                                        },{id: link.linkId, name: link.linkName},)} className="btn btn-success btn-sm">Start Inspect</button></td>
                            </tr>)
                        }
                       
                        
                    </tbody>
                </table>
        }
    

    </div>
</div>
}



const InspectionStart = (props) => {

    let [questionList, setQuestionList] = useState([]);
    let [showSaveButton, setShowSaveButton] = useState(false);
    let [inspectBy, setInspectBy] = useState('');
    useEffect(() => {
        getChecklistItemByChecklistId({checklistId: props.checklist.checklistId}, res => {
            console.log(res)
            if(res.status){
                
                setQuestionList(res.itemList.sort((a,b) => a.ind - b.ind))
            }
        })
    },[])

    const answerClick = (index, answer) => {
        let newlist = [...questionList]
        let obj = { ...questionList[index], answer}
        newlist[index] = obj
        setQuestionList(newlist)
        checkSaveAble(newlist, inspectBy);
    }
    

    const noteChange = (index, note) => {
        let newlist = [...questionList]
        let obj = { ...questionList[index], note}
        newlist[index] = obj
        setQuestionList(newlist)
    }

    const checkSaveAble = (newlist, text) => {
        var result = newlist.filter(que => (que.answer === undefined || que.answer === ''))
        setShowSaveButton(result.length === 0 && text !== '')
        
    }

    

    const submitRecord = async () => {

        const confirmed = window.confirm('กรุณาตรวจสอบข้อมูลให้ถูกต้องการทำการบันทึก เนื่องจากหลังจากบันทึกแล้วจะไม่สามารถแก้ไข้ข้อมูลได้?');
    if (confirmed) {
//        createChecklistLinkRecord({linkId: props.checklist.id, createBy: props.checklist.createBy, inspectBy, checklistId: props.checklist.checklistId}, async (res) =>  {
//            if(res){
//
//                await Promise.all(questionList.map(subject => uploadChecklistAnswer({recordId: res.id, questionId: subject.id, answer: subject.answer, note: subject.note}, () => {})))
//                props.getChecklistLinkList();
//                props.backBtn();
//
//            }else{
//                alert(res.msg);
//            }
//        })
    }
       
        
    }

    const textareaStyle = {
        width: '100%',
        height: '100px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        lineHeight: '1.5',
        resize: 'vertical',
      };

     return (<div className="p-2" >
        <button onClick={props.backBtn} className="btn btn-danger btn-sm">Back</button>
        <br />
        <div className="col-12 mt-2">
            <h4>{props.checklist.name}</h4>
            <b>สำหรับ: </b>{props.checklist.type === 'employee' && `[${props.associate.id}] `}{props.associate.name}
        </div>
        <div className="col-12 mt-2">
            <b>ประเมินโดย: </b>
            <input value={inspectBy} onChange={(e) => {
                let text = e.target.value
                setInspectBy(text)
                checkSaveAble(questionList, text)
            }} />
        </div>
        <div style={{maxHeight: '600px', overflow: 'scroll'}}>
        {
            questionList.map((que,i) => (<div style={{maxWidth: '500px'}} className="border my-1 p-3">
                <div className="col-12 mt-1">
                    <h6>{i+1}.{que.title}</h6>
                </div>
                <div className="row">
                    <div className="col-3 ">
                        
                        <button onClick={() => answerClick(i, 'ดีเยี่ยม')} className={
                            que.answer === 'ดีเยี่ยม' ? "btn btn-info" : "btn btn-light"
                        }>ดีเยี่ยม</button>
                    </div>
                    <div className="col-3">
                    <button onClick={() => answerClick(i, 'ดี')} className={
                            que.answer === 'ดี' ? "btn btn-success" : "btn btn-light"
                        }>ดี</button>
                    </div>
                    <div className="col-3">
                    <button onClick={() => answerClick(i, 'พอใช้')} className={
                            que.answer === 'พอใช้' ? "btn btn-warning" : "btn btn-light"
                        }>พอใช้</button>
                    </div>
                    <div className="col-3">
                    <button onClick={() => answerClick(i, 'ปรับปรุง')} className={
                            que.answer === 'ปรับปรุง' ? "btn btn-danger" : "btn btn-light"
                        }>ปรับปรุง</button>
                    </div>
                </div>
                
                <div className="mt-2">
                    <h6 style={{textDecoration: 'underline'}}>คำแนะนำ</h6>
                    <textarea onChange={(e) => {
                        noteChange(i, e.target.value)
                    }} value={que.note ? que.note : ''} style={textareaStyle} />
                </div>
            
            </div>))
        }
        </div>

        
        <br />
        <p style={{color: 'red'}}>* กรุณาเลือกคำตอบของทุกหัวข้อ และระบุผู้ประเมิน เพื่อทำการบันทึก</p>
        <button onClick={showSaveButton ? submitRecord: () => {}} className={showSaveButton ? "btn btn-success": "btn btn-light"}>บันทึก</button>
    </div>)
}



const InspectionResult = (props) => {

    let [questionList, setQuestionList] = useState([]);
    let [showSaveButton, setShowSaveButton] = useState(false);
    let [pdfUrl, setPdfUrl] = useState('')
    useEffect(() => {
        fetch(`${IP}/public/employeeChecklistRecord/${props.checklist.filename}`)
    .then(res => res.blob())
    .then(blob => {
      setPdfUrl(URL.createObjectURL(blob));
    });
    },[])
    
    
 

   

    const textareaStyle = {
        width: '100%',
        minHeight: '100px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        lineHeight: '1.5',
        resize: 'vertical',
      };
    
    
    const getGrade = (p, m) => {
  const pc = (p / m) * 100;
  return { 
    percentage: pc.toFixed(2), 
    grade: pc >= 90 ? 'A' : pc >= 70 ? 'B' : pc >= 50 ? 'C' : 'D' 
  };
};

     return (<div className="p-2 row" >
       <div className="col-12 mt-2">
           <button onClick={props.backBtn} className="btn btn-danger btn-sm">Back</button>
       </div>
        
        
        <div className="col-6 mt-2">
            <h4>{props.checklist.name}</h4>
            <b>สำหรับ: </b>{props.checklist.type === 'employee' && `[${props.associate.id}] `}{props.associate.name}
            <br />
            <b>บันทึกเมื่อ: </b>{moment(new Date(props.checklist.createAt)).format('DD/MM/YYYY')}
            <br />
            <b>ประเมินโดย: </b>{props.checklist.inspectBy}
            
        </div>
        <div className="col-6 mt-2">
            <h4>คะแนน: {props.checklist.points}/{props.checklist.maxPoint}</h4>
            <h1>Grade: {getGrade(props.checklist.points, props.checklist.maxPoint).grade}</h1>
            
        </div>
        <div className="col-12">
            <div style={{ marginTop: 20, width: "80%", height: "980px" }}>
          <embed
            src={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        
      </div>
        </div>
        
      
      
        
    </div>)
}


const InspectionPrint = (props) => {
    let [questionList, setQuestionList] = useState([]);
    useEffect(() => {
        getChecklistItemByChecklistId({ checklistId: props.checklist.checklistId }, res => {
            console.log(res)
            if (res.status) {
                
                setQuestionList(res.itemList.sort((a,b) => a.ind - b.ind))
            }
        })
    }, [])



    const answerStyle = {
        width: '50px',
        textAlign: 'center',
        fontSize: '12px'
    }
    
    const grouped = Object.values(
  questionList.sort((a,b) => a.ind - b.ind).reduce((acc, item) => {
    if (!acc[item.header]) {
      acc[item.header] = { header: item.header, list: [] };
    }
    acc[item.header].list.push(item);
    return acc;
  }, {})
);

    return (<div className="p-2" >
        <div style={{ display: 'flex', flexDirection: 'row', }}>
            {(props.checklist.type === 'employee' || props.checklist.type === 'position') ?
                <div style={{ marginRight: '10px' }}>
                    <img id="profile-image" src={`${IP}/public/employee/${props.associate.imageUrl !== '' ? props.associate.imageUrl : 'person.png'}`} width="120px" height="120px" />
                </div>
                : <div className="col-12 mt-2">

                </div>}
            <div className="col-12 mt-2">
                <b>หัวข้อ: </b>{props.checklist.name}
                <br/>
                <b>สำหรับ: </b>{props.checklist.type === 'employee' && `[${props.associate.id}] `}{props.associate.name}
                <br />
                <b>แผนก: </b>{props.associate.deptName} <b>ตำแหน่ง: </b>{props.associate.role}
            </div>

        </div>
        <div style={{ display: 'flex', flexDirection: 'column'}} >
        
        {
                grouped.map(question => (
                <div>
                       <h5>{question.header}</h5>
                {
                            question.list.map((ea, i) => (<div style={{
                display: 'flex', flexDirection: 'row',
                    justifyContent: 'space-between',
            }} >
                           <span style={{fontSize: '12px'}}>{i+1}. {ea.title}</span>
                           <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingRight: '10px' }}>
                        <div style={answerStyle}>

                            4
                        </div>
                        <div style={answerStyle}>
                        3
                        </div>
                        <div style={answerStyle}>
                            2
                        </div>
                        <div style={answerStyle}>
                            1
                        </div>
                    </div>
                            
                            </div>))
                        }
                </div>
                ))
            }
            </div>

        <br />
        <br />
        <div>
                       <div style={{ float: 'left', width: '250px' }}>
                 <u>ความคิดเห็นของผู้ประเมิน:</u>
            </div>
            <div style={{ float: 'right', borderBottom: '1px solid grey', width: '250px' }}>
                ประเมินโดย:
            </div>
            <br />
            <br />
            <div style={{ float: 'right', borderBottom: '1px solid grey', width: '250px' }}>
                คะแนน:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/{questionList.length * 4}
            </div>
            <br />
            <br />
            <div style={{ float: 'right', borderBottom: '1px solid grey', width: '250px' }}>
                วันที่:
            </div>
            
        </div>

    </div>)
}



export default HRInspection;
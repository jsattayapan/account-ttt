import React, { useState } from "react";
import {
    getPositions,
    getDepartments,
    getChecklistList,
    createNewChecklist,
    addNewChecklistItem,
    getChecklistItemByChecklistId
} from './tunnel'
import { useEffect } from "react";






const ChecklistList = (props) => {

    let [departmentList, setDepartmentList] = useState([]);
    let [positionList, setPositionList] = useState([]);
    let [currentPage, setCurrentPage] = useState('list');
    let [linkObject, setLinkId] = useState({id:'', name: ''});
    let [linkType, setLinkType] = useState(false);
    let [checklistList, setChecklistList] = useState([])
    let [checklist, setChecklist] = useState(null)
    useEffect(() => {
        getDepartments(res => {
            if (res.status) {
                setDepartmentList(res.departments);
            }
        })
        getPositions(res => {
            if (res.status) {
                setPositionList(res.positionList);
            }
        })
        getChecklistList(res => {
            if (res.status) {
                setChecklistList(res.checklistList);
            }
        })
        
    }, []);

    const setCheckPage = (id, type,status) => {
        console.log(id)
        setLinkId(id);
        setLinkType(type)
        setCurrentPage(status)
    }

    const reloadChecklist = () => {
        getChecklistList(res => {
            if (res.status) {
                setChecklistList(res.checklistList);
            }
        })
    }

    const viewChecklistInfo = (cl) => {
        setChecklist(cl)
        setCurrentPage('info')
    }



    return currentPage === 'new' ?<NewChecklist 
    backBtnClick={() => setCheckPage('','', 'list')}
    reloadChecklist={reloadChecklist}
    linkObject={linkObject} linkType={linkType} /> :
    currentPage === 'info' ?
    <ChecklistInfo checklist={checklist} backBtnClick={() => setCheckPage('list')} /> :
    (
        
        <div>
            {console.log(checklistList)}
            <div className="col-12 mt-2 px-2">
                <table className="table table-border">
                    <thead>
                        <tr>
                            <th>Employee <button 
                            onClick={() => setCheckPage({id:'', name: 'Employee'},'employee', 'new')}
                            className="btn btn-success btn-sm">+ Checklist</button></th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            checklistList.filter(cl => cl.type === 'employee').map(cl => <tr>
                                <td>{cl.name} <button onClick={() => viewChecklistInfo(cl)} className="btn btn-info btn-sm">Info</button></td>
                            </tr>)
                        }
                        
                    </tbody>
                </table>
            </div>
            {
                positionList.map(e =>
                    <div className="col-12 mt-2 px-2">
                        <table className="table table-border">
                            <thead>
                                <tr>
                                    <th>{e.name} <button onClick={() => setCheckPage(e,'position', 'new')}
                                     className="btn btn-success btn-sm">+ Checklist</button></th>
                                </tr>
                            </thead>


                            <tbody>
                            {
                            checklistList.filter(cl => cl.type === 'position' && cl.refId === e.id).map(cl => <tr>
                                <td>{cl.name} <button onClick={() => viewChecklistInfo(cl)} className="btn btn-info btn-sm">Info</button></td>
                            </tr>)
                        }
                            </tbody>
                        </table>
                    </div>)
            }
            {

                departmentList.map(e =>
                    <div className="col-12 mt-2 px-2">
                        <table className="table table-border">
                            <thead>
                                <tr>
                                    <th>{e.name} <button onClick={() => setCheckPage(e,'department', 'new')} className="btn btn-success btn-sm">+ Checklist</button></th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                            checklistList.filter(cl => cl.type === 'department' && cl.refId === e.id).map(cl => <tr>
                                <td>{cl.name} <button onClick={() => viewChecklistInfo(cl)} className="btn btn-info btn-sm">Info</button></td>
                            </tr>)
                        }
                            </tbody>
                        </table>
                    </div>)
            }

        </div>
    )
}



const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    width: '300px',
    boxSizing: 'border-box',
    marginTop: '8px',
  };

export const NewChecklist = (props) => {
 
    let [subjectList, setSubjectList] = useState([]);
    let [title, setTitle] = useState('');
    let [showSubmitButton, setShowSubmitButton] = useState(false);
    const [number, setNumber] = useState(7);

    useEffect(() => {
        // Function to be called whenever the count state changes
        checkSubmitButton();
      }, [title, subjectList]); 

    const checkSubmitButton = () => {
        setShowSubmitButton(title.trim() !== '' && subjectList.length !== 0)
    }

    const submitChecklist = async () =>  {
        let name = title;
        let defaultNextCheckDays = number;
        let type = props.linkType;
        let linkId = props.linkObject.id;
        console.log(props.linkObject)

        createNewChecklist({name, defaultNextCheckDays, type, linkId}, async (res) => {
            if(res.status){
               try{
                let id = res.checklistId
                await Promise.all(subjectList.map((subject, i) => addNewChecklistItem({checklistId: id, title: subject.title,header: subject.header, ind: i+ 1}, () => {})))
                alert('บันทึกสำเร็จ')
                props.reloadChecklist();
                props.backBtnClick()
               }
               catch(e){
                alert('Error!')
               }
            }else{
                alert('Error!')
            }
        })
        
        
    }




   
    return(
        <div className="px-2">
            <div className="col-12">
            <button onClick={props.backBtnClick} className="btn btn-danger">Bacnk</button>
            <br />
            <h3>{props.linkObject.name}</h3>
            <div >
      <label htmlFor="textInput">Title:</label>
      <input value={title} onChange={(e) => {
        setTitle(e.target.value)
        
      }} className="mx-2" type="text" id="textInput" style={inputStyle} />
    </div>
            </div>

            <div className="col-12 mt-2">
            <NumberInputSection number={number} setNumber={setNumber}  />
            </div>
            <SubjectList checkSubmitButton={checkSubmitButton} subjectList={subjectList} title={title} setSubjectList={setSubjectList} setTitle={setTitle} />
            <button onClick={showSubmitButton ? submitChecklist : () => {}} className={showSubmitButton? "btn btn-success" : "btn btn-dark"}>บันทึกแบบประเมินใหม่</button>


           
        </div>
    )


}


const numberInputStyle = {
    display: 'flex',
    alignItems: 'center',
  };
  
  const buttonStyle = {
    border: 'none',
    background: '#E2E8F0',
    color: '#4A5568',
    fontSize: '1rem',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '0.5rem',
  };


  const SubjectList = (props) => {
    let [title, setTitle] = useState('');
      let [header, setHeader] = useState('')
    

    
    return (
        <div>
        <div className="col-12">
            <div >
                <label htmlFor="textInput">หัวข้อการประเมิณ:</label>
                <br />
        <input className="mx-2" type="text" id="textInput" value={header} onChange={(e) => setHeader(e.target.value)} style={inputStyle} />
                <input className="mx-2" type="text" id="textInput" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
                <button onClick={() => {
                    props.setSubjectList([...props.subjectList, {title, header}])
                    setTitle('');
                }} className="btn btn-success">+ เพิ่ม</button>
                </div>
            </div>
           

            <div className="col-12 mt-2 ">
                <table className="table table-border">
                    <thead>
                        <tr>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.subjectList.map((e, i) =>  <tr>
                                <td>{e.title} <button onClick={()=> {
                                    props.setSubjectList(props.subjectList.slice(0, i).concat(props.subjectList.slice(i + 1)))
                                }} className="btn btn-danger">ลบ</button></td>
                                
                            </tr>)
                        }
                       
                    </tbody>
                </table>
            </div>
        </div>
    )
  }
  
  const NumberInputSection = (props) => {
    
  
    const handleIncrease = () => {
      if (props.number < 90) {
        props.setNumber(props.number + 1);
      }
    };
  
    const handleDecrease = () => {
      if (props.number > 7) {
        props.setNumber(props.number - 1);
      }
    };
  
    return (
      <div>
        
        <label htmlFor="numberInput">จำนวนวันการประเมิณครั้งต่อไป:</label>
        <div style={numberInputStyle}>
          <button onClick={handleDecrease} style={buttonStyle}>
            -
          </button>
          <span className="m-2">{props.number}</span>
          <button className="m-2" onClick={handleIncrease} style={buttonStyle}>
            +
          </button>
        </div>
      </div>
    );
  };


  const ChecklistInfo = (props) => {
    let [questionList, setQuestionList] = useState([])
    useEffect(() => {
        getChecklistItemByChecklistId({checklistId: props.checklist.id}, res => {
            if(res.status){
                const grouped = Object.values(
  res.itemList.sort((a,b) => a.ind - b.ind).reduce((acc, item) => {
    if (!acc[item.header]) {
      acc[item.header] = { header: item.header, list: [] };
    }
    acc[item.header].list.push(item);
    return acc;
  }, {})
);
                setQuestionList(grouped)
            }
        })
    }, [])
      
      
      
    return(<div>
        <button onClick={props.backBtnClick} className="btn btn-danger">Bacnk</button>
        <div className="col-12">
        <h3>{props.checklist.name}</h3>
        <ul>
            {
                questionList.map(question => <div>
                  <h6>{question.header}</h6>
                   <ul>
                    {question.list.map(ea => <li>{ea.title}</li>)}
                    </ul>
                </div>)
            }
        </ul>
        </div>

    </div>)
}

export default ChecklistList;


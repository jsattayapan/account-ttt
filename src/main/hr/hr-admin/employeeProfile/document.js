import React, { useState, useEffect } from "react";
import moment from 'moment'
import DragDropPDF from "../components/drag-drop-file";
import Swal from 'sweetalert2'
import { getEmployeeDocumentById } from './../../tunnel'

export const Document = (props) => {
  let [showAddSection, setShowAddSection] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  let [documentName, setDocumentName] = useState(null)
  

  const submitDocument = () => {
    props.submitNewDocument(selectedFile, documentName, status => {
      if(status){
        setShowAddSection(false)
      }
    })
  }
  const openUpdatePopUp = () => {
    Swal.fire({
      title: `ชื่อเอกสาร`,
      input: 'text',
      inputPlaceholder: 'ชื่อเอกสาร',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return `กรุณาระบุชื่อเอกสาร`;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setDocumentName(result.value)
        setShowAddSection(!showAddSection)
      }
    });
    
  }

  return (
    <div className="row m-4">
        <div className="col-12">
          <button onClick={() => {
            if(!showAddSection){
              openUpdatePopUp()
            }else{
              setShowAddSection(!showAddSection)
            }
            

            }} className="btn btn-link">{showAddSection ? '-' : '+'} เอกสาร</button>
          
        </div>
        {showAddSection ? (
        <div className="col-12 align-right py-2" style={{border: '1px solid #e3e3e3'}}>
          <p>ชื่อเอกสาร: {documentName}</p>
            <DragDropPDF setSelectedFile={setSelectedFile} />
            <button onClick={() => submitDocument()} className="btn btn-success" disabled={selectedFile === null}>บันทึก</button>
        </div>

      ) : '' }

<div className='col-12'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th style={{width: '65%'}}>รายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.documentList.length !== 0 ? 
                        props.documentList.map(doc => 
                          <tr>
                          <th>{doc.name}</th>
                          <td>{moment(doc.createAt).format('MMMM DD, YYYY')}</td>
                          <td><a target="_blank" href={'https://tunit3-samed.ap.ngrok.io/public/storageEmployeeDocument/'+doc.filename} className="btn btn-link">View</a></td>
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
    
  );
};

export default Document;

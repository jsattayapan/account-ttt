import React from 'react'
import { BottomNav } from './../index.js'
// import { newIssueReport } from './../../tunnel'
import {faUndoAlt, faHome} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBook
 } from '@fortawesome/free-solid-svg-icons'

export default class JobDescription extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      page: 'description'
    }
  }

  changePage = page => {
    this.setState(() => ({
      page
    }))
  }

  nl2br = (str) => {
    return str.replace(/(?:\r\n|\r|\n)/g, '**').split('**')
 }

 openDocument = (path) => {
   let uri = `https://tunit3-samed.ap.ngrok.io/public/storagePositionDocument/${path}`
   window.open(uri, "_blank");
 }

  render(){
    let emp = this.props.employee
    let page = this.state.page
    console.log(emp);
    let jb = {
      title: emp.jobDescription.name,
      department: emp.department,
      description: emp.jobDescription.description,
      duties: this.nl2br(emp.jobDescription.duties)
    }

    let documentLoad = emp.jobDocument.reduce((result, doc) => {
      let found = result.filter(x => x.type === doc.type)
      if(found.length === 0){
        result = [ ... result, {type: doc.type, docList: [doc]}]
      }else{
        let index = result.findIndex(x => x.type === doc.type)
        result[index]['docList'] = [ ... result[index].docList, doc]
      }
      return result
    }, [])
    console.log(documentLoad);

    return(
      <div className='row'>
        <div className="col-12">
          <h3>{jb.title} - {jb.department}</h3>
          <div className="d-flex flex-row py-3 text-center border">
            <div onClick={() => this.changePage('description')}
              style={{
                flexGrow: 1,
                fontSize: '20px',
                color: 'white',
                textDecoration: page === 'description' ? 'underline' : 'none'
              }}
              >Description</div>
            <div onClick={() => this.changePage('document')} style={{
              flexGrow: 1,
              fontSize: '20px',
              color: 'white',
              textDecoration: page === 'document' ? 'underline' : 'none'
            }}>Document ({emp.jobDocument.length})</div>
          </div>
          {
            this.state.page === 'description' ?
            <div className="d-flex px-3 flex-column border">
              <div className="col-12">
                <div className="d-flex flex-column">
                  <label style={{fontSize: '20px', color: '#a6a89e' }} className="label-control mt-4"><b>Description:</b></label>
                  <p style={{color: 'white'}}>{jb.description}</p>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex flex-column">
                  <label style={{fontSize: '20px', color: '#a6a89e' }} className="label-control mt-4">Duties:</label>
                  <ul >
                    {jb.duties.map(x => <li style={{color: 'white'}}>{x}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            :
            <div style={{color: 'white'}} className="d-flex px-3 flex-column border">
              {documentLoad.map(x => (
                <div className="col-12 py-1">
                  <h5 style={{textDecoration: 'underline'}}>{x.type}</h5>
                  {
                    x.docList.map(y => (
                      <p onClick={() => this.openDocument(y.filename)}><FontAwesomeIcon icon={faBook} /> {y.title}</p>
                    ))
                  }
                </div>
              ))}
            </div>
          }
        </div>

        <div style={{height:'250px', width: '50px'}}>

        </div>
        <BottomNav
          icon1={null}
          icon2={faUndoAlt}
          onClick1={faHome}
          onClick2={() => this.props.changePage('profile')}
           />
      </div>
    )
  }
}

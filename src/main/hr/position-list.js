import React from 'react'
import  {
  getPositions,
  getDepartments,
  getEmployeeList,
  submitDescription,
  submitDuties
} from './tunnel'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPen} from '@fortawesome/free-solid-svg-icons'

export default class PositionList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      page : 'main',
      positionList: [],
      departmentList: [],
      employeeList: [],
      selectedPosition: null,
      selectedDepartment: null
    }
  }

  reloadPositionList = () => {
    getPositions(res => {
      if(res.status){
        this.setState(() => ({
          positionList: res.positionList,
          selectedPosition: res.positionList.find(x => x.id === this.state.selectedPosition.id)
        }))
      }
    })
  }

componentDidMount(){
    getEmployeeList(res => {
      if(res.status){
        console.log(res);
        this.setState(() => ({
          employeeList: res.list.filter(x => x.active)
        }))
      }
    })
    getPositions(res => {
      if(res.status){
        this.setState(() => ({
          positionList: res.positionList
        }))
        console.log(res.positionList);
      }else{
        console.log(res.msg);
      }
    })
    getDepartments(res => {
      if(res.status){
        this.setState(() => ({
          departmentList: res.departments
        }))
      }
    })
  }

  viewPositionDetail = (position, department) => {
    this.setState(() => ({
      selectedPosition: position,
      selectedDepartment: department,
      page: 'positionDetail'
    }))
  }

  changeToMainPage = () => {
    this.setState(() => ({
      selectedPosition: null,
      selectedDepartment: null,
      page: 'main'
    }))
  }

  render() {
    const { page, selectedPosition, selectedDepartment } = this.state
    return (
      <div>
          {
         page === 'main' &&
          <div className="row m-2">
            <div className="col-12  py-3">
              <h3>ตำแหน่งงาน</h3>
            </div>
            {this.state.departmentList.map(x => <div className="col-12  py-2 my-2 bg-light">

              <h4>{x.name}</h4>
              <table className="table table-border">
                <thead>
                  <tr>
                    <th>ตำแหน่ง</th>
                    <th>จำนวนพนักงาน</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {  this.state.positionList.filter(y => y.departmentId === x.id).map(y =>
                      <tr>
                        <td>{y.name}</td>
                        <td>{this.state.employeeList.filter(emp => emp.positionId === y.id).length}/{y.maxCapacity}</td>
                        <td><button onClick={() => this.viewPositionDetail(y, x)}  className="btn mx-2 btn-sm btn-info">View Info.</button></td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>)}
          </div>
          }
          {
            (page === 'positionDetail' && selectedPosition !== null && selectedDepartment !== null) &&
            <PositionDetailPage
              position={selectedPosition}
              department={selectedDepartment}
              reload={this.reloadPositionList}
              changeToMainPage={this.changeToMainPage}
              />
          }
      </div>
    )
  }
}

class PositionDetailPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      page: 'job-description',
      editDuties:  false,
      editDescription: false,
      descriptionValue: '',
      dutiesValue: '',
    }
  }

  submitDescription = () => {
    submitDescription({description: this.state.descriptionValue, positionId: this.props.position.id}, res => {
      if(res.status){
        this.props.reload()
        this.setState(() => ({
          editDescription: false,
          descriptionValue: this.props.position.description
        }))
      }else{
        alert(res.msg)
      }
    })
  }


  submitDuties = () => {
    submitDuties({duties: this.state.dutiesValue, positionId: this.props.position.id}, res => {
      if(res.status){
        this.props.reload()
        this.setState(() => ({
          editDuties: false,
          dutiesValue: this.props.position.duties
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  componentDidMount(){
    this.setState(() => ({
      descriptionValue: this.props.position.description,
      dutiesValue: this.props.position.duties,
    }))
  }

  toggleDescription = () => {
    this.setState(() => ({
      editDescription: !this.state.editDescription
    }))
  }

  toggleDuties = () => {
    this.setState(() => ({
      editDuties: !this.state.editDuties
    }))
  }

  closeEditDescription = () => {
    this.setState(() => ({
      editDescription: false,
      descriptionValue: this.props.position.description
    }))
  }
  closeEditDuties = () => {
    this.setState(() => ({
      editDuties: false,
      dutiesValue: this.props.position.duties
    }))
  }


  nl2br = (str) => {
    return str.replace(/(?:\r\n|\r|\n)/g, '**').split('**')
 }


 descriptionOnChange = textareaaEvent => {
     console.log(textareaaEvent)
   this.setState(() => ({
     descriptionValue: textareaaEvent.target.value
   }))
 }

 dutiesOnChange = e => {
   this.setState(() => ({
     dutiesValue: e.target.value
   }))
 }

  render(){
    const { position, department, changeToMainPage } = this.props
    const { page, editDescription, editDuties, descriptionValue, dutiesValue } = this.state
    const duties = position.duties !== null ? this.nl2br(position.duties) : []
    const selectedPageStyle = { fontWeight: 'bold', textDecoration: 'underline'}
    return <div>
      <div className="row p-2">
        <div className="col-6">
          <h4>แผนก: {department.name}</h4>
          <h5>ตำแหน่ง: {position.name}</h5>
        </div>
        <div className="col-6 text-right">
          <button onClick={changeToMainPage}  className="btn mx-2 btn-danger">Back</button>
        </div>
        <div className="col-12 d-flex">
          <div className="p-2" style={page === 'job-description' ? selectedPageStyle : {}}>
            Job Description
          </div>
          <div className="p-2" style={page === 'document' ? selectedPageStyle : {}}>
            เอกสาร
          </div>
        </div>
        {
          page === 'job-description' &&
          <div className="col-12">
            <div className="row">
              <h4>Description:
                {editDescription ?

                  <span>
                    <button   onClick={this.submitDescription} className="btn mx-2 btn-sm btn-success">Save</button>
                    <button onClick={this.closeEditDescription}  className="btn mx-2 btn-sm btn-danger">Close</button>
                  </span>

                    :<span><FontAwesomeIcon size='1x' onClick={this.toggleDescription} color="#e8e8e8" icon={faPen} /></span>}
              </h4>
              {editDescription ?<textarea onChange={this.descriptionOnChange} style={{ height: '200px' }} value={descriptionValue} /> : <p>{position.description}</p>}
</div>
<div className="row">
                <h4>Duties & Responsiblities: {editDuties ?

                  <span>
                    <button   onClick={this.submitDuties} className="btn mx-2 btn-sm btn-success">Save</button>
                    <button onClick={this.closeEditDuties}  className="btn mx-2 btn-sm btn-danger">Close</button>
                  </span>

                    :<span><FontAwesomeIcon size='1x' onClick={this.toggleDuties} color="#e8e8e8" icon={faPen} /></span>}</h4>


                  {editDuties ?<textarea onChange={this.dutiesOnChange} style={{ height: '200px' }} value={dutiesValue} /> : <ul >
                    {duties.map(x => <li>{x}</li>)}
                  </ul>}

            </div>
          </div>
        }
      </div>
    </div>
  }
}

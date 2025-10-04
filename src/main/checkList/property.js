import React from 'react'
import Select from 'react-select'
import { getDepartments } from './../hr/tunnel'
import { createCheckList, getCheckList, getCheckListItemByCheckListId, createCheckListItem } from './tunnel'
import RoomCheckListDetail from './roomCheckListDetail'

export class Property extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showAddNewCheckList: false,
      checkLists: [],
      checkList: null,
      page: 'main',
      showAddNewItemForRoom: false
    }
  }
  componentDidMount() {
    getCheckList(res => {
      if(res.status){
        this.setState(() => ({
          checkLists: res.checkLists
        }))
      }
    })
  }
  closeOnRefresh = () => {
    this.setState(() => ({
      showAddNewCheckList:false
    }))
    this.componentDidMount()
  }

  openCheckListItems = checkList => {
      this.setState(() => ({
        checkList,
        page:'checkList'
      }))
  }

  backToMain = () => {
    this.setState(() => ({
      checkList: null,
      page:'main'
    }))
  }

  render(){
    return(
      <div className="row">
        { this.state.page === 'main' && <div className="col-12">
          <div className="row">
            <div className="col-12">
              <button className="btn btn-link" onClick={() => this.setState(() => ({showAddNewCheckList: true,  name: ''}))}>New Check List</button>
            </div>

            <div className="col-12">
              <button className="btn btn-link" onClick={() => this.setState(() => ({page: 'roomDetail'}))}>New Check List for room</button>
            </div>

            {
              this.state.showAddNewCheckList &&
              <CreateNewCheckList closeOnRefresh={this.closeOnRefresh} />
            }
            <div className="col-12 mb-2">
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th colSpan='2'>Avatara</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.checkLists.filter(x => x.property === 'Avatara').map(x => (
                    <TRCheckList onClick={() => this.openCheckListItems(x)} checkList={x} />
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className="col-12 mb-2">
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th colSpan='2'>Samed Pavilion</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.checkLists.filter(x => x.property === 'Samed Pavilion').map(x => (
                    <TRCheckList onClick={() => this.openCheckListItems(x)} checkList={x} />
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className="col-12 mb-2">
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th colSpan='2'>Lazy Sandals</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.checkLists.filter(x => x.property === 'Lazy Sandals').map(x => (
                      <TRCheckList onClick={() => this.openCheckListItems(x)} checkList={x} />
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>}

        {
          this.state.page === 'checkList' &&
          <div className="col-12">
            <CheckListItem backToMain={this.backToMain} checkList={this.state.checkList} />
          </div>
        }
        {
          this.state.page === 'roomDetail' &&
          <div className="col-12">
            <RoomCheckListDetail backToMain={this.backToMain} />
          </div>
        }
      </div>
    )
  }
}

class AddNewItemForRoom extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      textValue: ''
    }
  }

  textOnChange = e => {
    const { value } = e.target
    this.setState(() => ({
      textValue: value
    }))
  }

  render(){
    return (
      <div className="row">
        <div className="col-12">
          <label>รายการ: </label>
          <input type="text" className="form-control" onChange={this.textOnChange} value={this.state.textValue} />
        </div>
      </div>
    )
  }
}

class CheckListItem extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      checkListItems: [],
      showAddNewItems: false,
      name: ''
    }
  }
  componentDidMount(){
    getCheckListItemByCheckListId({checkListId: this.props.checkList.id}, res => {
      if(res.status){
        this.setState(() => ({
          checkListItems: res.checkListItems
        }))
      }
    })
  }
  nameOnChange = e => {
    const { value } = e.target
    this.setState(() => ({
      name: value
    }))
  }
  submitNewCheckListItem = () => {
    const { name } = this.state
    if(name.trim() === ''){
      alert('กรุณาระบุรายการ')
      return
    }
    createCheckListItem({checkListId: this.props.checkList.id, name}, res => {
      if(res.status){
        alert('ข้อมูลบันทึก')
        this.setState(() => ({
          name: '',
          showAddNewItems: false,
        }))
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }
  render(){
    return(
      <div className="row">
        <div className="col-12">
          <button className="btn btn-danger" onClick={this.props.backToMain}>กลับ</button>
        </div>
        <div className="col-12">
          <h3>{this.props.checkList.property}: {this.props.checkList.name}</h3>
          <p>รอบ: {this.props.checkList.round === 1 ? 'เช้า' : 'เช้า เย็น'}</p>
        </div>
        {!this.state.showAddNewItems && <div className="col-12">
          <button className="btn btn-success" onClick={() => this.setState(() => ({showAddNewItems: true}))}>เพิ่มรายการ</button>
        </div>}
        {
          this.state.showAddNewItems &&
          <div className="col-12">
            <div className="row">
              <div className="col-6">
                <label>รายการ: </label>
                <input onChange={this.nameOnChange} value={this.state.name} className="form-control" type="text" />
              </div>
              <div className="col-3">
                <button onClick={this.submitNewCheckListItem} className="btn btn-success">บันทึก</button>
              </div>
              <div className="col-3">
                <button onClick={() => this.setState(() => (
                    {
                      name: '',
                      showAddNewItems: false,
                    }))} className="btn btn-danger">ปิด</button>
              </div>
            </div>
          </div>
        }
        <div className="col-12">
          <table className="table table-bordered">
            <tbody>
              {
                this.state.checkListItems.map(x =>
                  <tr>
                    <td>{x.name}</td>
                    <td>{x.active}</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const TRCheckList = props => (
  <tr>
    <td><button onClick={props.onClick} className="btn btn-link">{props.checkList.name}</button></td>
    <td>รอบ: {props.checkList.round === 1 ? 'เช้า' : 'เช้า เย็น'}</td>
  </tr>
)

class CreateNewCheckList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      property: '',
      departmentId: '',
      round: '',
      departmentList: []
    }
  }

  submitNewProperty = () => {
    const { name, property, departmentId, round } = this.state
    if(name.trim() === ''){
      alert('กรุณาระบุชื่อรายการตรวจ')
      return
    }
    if(property.trim() === ''){
      alert('กรุณาเลือกสถานที่')
      return
    }
    if(departmentId.trim() === ''){
      alert('กรุณาเลือกแผนกที่รับผิดชอบ')
      return
    }
    if(round === ''){
      alert('กรุณาเลือกจำนวนครั้งที่ต้องตรวจในแต่ละวัน')
      return
    }

    createCheckList({name, property, departmentId, round}, res => {
      if(res.status){
        alert('บันทึกสำเร็จ')
        this.props.closeOnRefresh()
      }else{
        alert(res.msg)
      }
    })


  }

  componentDidMount(){
    getDepartments(res => {
      console.log(res);
      if(res.status){
        this.setState(() => ({
          departmentList: res.departments
        }))
      }
    })
  }

  nameOnChange = e => {
    const {value, id} = e.target
    this.setState(() => ({
      [id]: value
    }))
  }

  propertyOnChange = input => {
    this.setState(() => ({
      property: input.value
    }))
  }

  departmentOnChange = input => {
    this.setState(() => ({
      departmentId: input.value
    }))
  }

  roundOnChange = input => {
    this.setState(() => ({
      round: input.value
    }))
  }

  render(){
    const propertyOptions = [
      {value: 'Avatara', label: 'Avatara'},
      {value: 'Samed Pavilion', label: 'Samed Pavilion'},
      {value: 'Lazy Sandals', label: 'Lazy Sandals'},
    ]
    const roundOptions = [
      {value: 1, label: '1'},
      {value: 2, label: '2'},
    ]
    const departmentOptions = this.state.departmentList.map(x => ({value: x.id, label: x.name}))
    return(
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-md-3">
            <label className="">ชื่อ:</label>
            <input onChange={this.nameOnChange} id="name" value={this.state.name} type="text" className="form-control" />
          </div>
          <div className="col-12 col-md-3">
            <label className="">สถานที่:</label>
            <Select onChange={this.propertyOnChange} options={propertyOptions} />
          </div>
          <div className="col-12 col-md-3">
            <label className="">แผนกที่รับผิดชอบ:</label>
            <Select onChange={this.departmentOnChange} options={departmentOptions} />
          </div>
          <div className="col-12 col-md-3">
            <label className="">จำนวนรอบที่ตรวจต่อวัน:</label>
            <Select onChange={this.roundOnChange} options={roundOptions} />
          </div>
          <div className="col-12 col-md-2 mt-3">
            <button onClick={this.submitNewProperty} className="btn btn-success btn-block">บันทึก</button>
          </div>
          <div className="col-12 col-md-2 mt-3">
            <button onClick={this.props.closeOnRefresh} className="btn btn-danger btn-block">ปิด</button>
          </div>
        </div>
      </div>
    )
  }
}

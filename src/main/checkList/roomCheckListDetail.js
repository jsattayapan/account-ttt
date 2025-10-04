import React from 'react'
import { getRoomCheckListItems, submitNewRoomCheckListItem } from './tunnel'

export default class RoomCheckListDetail extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      checkListItems: [],
      showAddNewItems: false,
      itemName: ''
    }
  }

  componentDidMount(){
    getRoomCheckListItems(res => {
      if(res.status){
        this.setState(() => ({
          checkListItems: res.checkListItems
        }))
      }
    })
  }
  textOnChange = e => {
    const  { id, value } = e.target
    this.setState(() => ({
      [id]: value
    }))
  }

  submitNewRoomCheckListItem = () => {
    const { itemName } = this.state
    if(itemName.trim() === ''){
      alert('กรุณาระบุชื่อรายการที่ต้องเช็ค')
      return
    }
    submitNewRoomCheckListItem({itemName}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          showAddNewItemForRoom: false,
          itemName: ''
        }))
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return (
      <div className="row">
        <div className="col-12 my-1">
          <button onClick={this.props.backToMain} className="btn btn-link">กลับ</button>
        </div>
        <div className="col-12 my-1">
          <h3>รายการ CheckList ห้องพัก</h3>
        </div>
        <div className="col-12 my-1">
          <button onClick={() => this.setState(() => ({showAddNewItems: !this.state.showAddNewItems, itemName: ''}))} className="btn btn-success">เพิ่มรายการใหม่</button>
        </div>
        {
          this.state.showAddNewItems &&
          <div className="col-12 my-1">
            <div className="row">
              <div className="col-12">
                <label>รายการ</label>
                <input type="text" className="form-control" value={this.state.itemName} id="itemName" onChange={this.textOnChange} />
              </div>
              <div className="col-12">
                <button onClick={this.submitNewRoomCheckListItem} className="btn btn-success">บันทึก</button>
              </div>
            </div>
          </div>
        }
        <div className="col-12 my-1">
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

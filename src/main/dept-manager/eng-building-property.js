import React from 'react'
import { submitNewBuilding, getBuildingsAndProperties, submitNewProperty } from './tunnel'

export default class EngineerBuildingProperty extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showAddNewBuilding: false,
      buildingName:'',
      buildingList: [],
      propertyList: [],
      showBuildingDetail: false,
      selectedBuildingId: ''
    }
  }

  componentDidMount(){
    getBuildingsAndProperties(res => {
      if(res.status){
        this.setState(() => ({
          buildingList: res.buildingList,
          propertyList: res.propertyList
        }))
      }
    })
  }

  toggleAddNewBuilding = () => {
    const showAddNewBuilding = this.state.showAddNewBuilding
    this.setState(() => ({
      showAddNewBuilding: !showAddNewBuilding
    }))
  }

  textOnChange = e => {
    const value = e.target.value
    const name = e.target.name
    this.setState(() => ({
      [name]: value
    }))
  }

  submitNewBuilding = () => {
    const buildingName = this.state.buildingName
    if(buildingName.trim() === ''){
      alert('กรุณาใส่ชื่ออาคาร')
      return
    }
    submitNewBuilding({ name: buildingName }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          showAddNewBuilding: false,
          buildingName: ''
        }))
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }

  openBuldingDetail = (buildingId) => {
    this.setState(() => ({
      showBuildingDetail: true,
      selectedBuildingId: buildingId
    }))
  }

  backBtn = () => {
    this.setState(() => ({
      showBuildingDetail: false,
      selectedBuildingId: ''
    }))
  }

  render(){
    const showAddNewBuilding = this.state.showAddNewBuilding
    const buildingName = this.state.buildingName
    const buildingList = this.state.buildingList
    const showBuildingDetail = this.state.showBuildingDetail
    return(
      <div className="row">
        { !showBuildingDetail &&
          <div className="col-12">
            <div className="row">
              <div className="col-md-4 col-12">
                <button onClick={this.toggleAddNewBuilding} className="btn btn-link">{showAddNewBuilding ? '-' : '+'} เพิ่มอาคารใหม่</button>
              </div>
            </div>
            {
              showAddNewBuilding &&
              <div className="row">
                <div className="col-md-4 col-12">
                  <div className="form-group">
                    <label>ชื่อาคาร</label>
                    <input onChange={this.textOnChange} value={buildingName} name="buildingName" type="text" className="form-control"  />
                  </div>
                </div>
                <div className="col-md-2 col-12">
                  <button onClick={this.submitNewBuilding} className="btn btn-success">บันทึก</button>
                </div>
              </div>
            }
            <div className="row">
              {
                buildingList.map(x => (
                  <div onClick={() => this.openBuldingDetail(x.id)} className="col-md-3 col-12 my-3 py-3 mx-2 building-card">
                    <div className="row">
                      <div className="col-12 text-center">
                        <h3>{x.name}</h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 text-center">
                        จำนวนห้อง: <b>3</b>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
      }
        {
          showBuildingDetail && <BuildingDetail backBtn={this.backBtn} id={this.state.selectedBuildingId} />
        }
      </div>
    )
  }
}

class BuildingDetail extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showAddNewProperty: false,
      propertyName: '',
      propertyList: []
    }
  }

  componentDidMount(){
    getBuildingsAndProperties(res => {
      if(res.status){
        let propertyList = res.propertyList.filter(x => x.buildingId === this.props.id)
        this.setState(() => ({
          propertyList
        }))
      }
    })
  }

  textOnChange = e => {
    const value = e.target.value
    const name = e.target.name
    this.setState(() => ({
      [name]:value
    }))
  }

  toggleAddNewProperty = () => {
    const showAddNewProperty = this.state.showAddNewProperty
    this.setState(() => ({
      showAddNewProperty: !showAddNewProperty,
      propertyName: ''
    }))
  }

  submitNewProperty = () => {
    const name = this.state.propertyName
    if(name.trim() === ''){
      alert('กรุณาใส่ชื่อห้อง')
      return
    }

    submitNewProperty({ name, buildingId: this.props.id}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.setState(() => ({
          showAddNewProperty: false,
          propertyName: ''
        }))
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    const showAddNewProperty = this.state.showAddNewProperty
    return (
      <div className="col-12">
        <div className="row">
          <div className="col-md-3 col-12">
            <button onClick={this.props.backBtn} className="btn btn-danger">กลับ</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-12">
            <button onClick={this.toggleAddNewProperty} className="btn btn-link">{showAddNewProperty ? '-' : '+'} เพิ่มห้องในอาคารนี้</button>
          </div>
        </div>
        {
          showAddNewProperty &&
          <div className="row">
            <div className="col-md-4 col-12">
              <div className="form-group">
                <label>ชื่อห้อง</label>
                <input onChange={this.textOnChange} value={this.state.propertyName} name='propertyName' type="text" className="form-control" />
              </div>
            </div>
            <div className="col-md-4 col-12">
              <button onClick={this.submitNewProperty} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }
        <div className="row">
          {
            this.state.propertyList.map(x => (
              <div className="col-md-3 col-12 my-3 py-3 mx-2 building-card">
                <div className="row">
                  <div className="col-12 text-center">
                    <h3>{x.name}</h3>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

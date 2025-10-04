import React from 'react'
import Select from 'react-select'
import { createQuotation } from './tunnel'

export default class CreateQuotation extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      groupName: '',
      checkIn: '',
      checkOut: '',
      numberOfGuest: '',
      numberOfRoom: '',
      property: '',
      avaDouble: '',
      avaTwin: '',
      avaTriple: '',
      pavDouble: '',
      pavTwin: '',
      pavTriple: '',
      pavFamily: '',
    }
  }

  textOnChange = e => {
    const {value, id} = e.target
    this.setState(() => ({
      [id]: value
    }))
  }

  propertyOnChange = e => {
    const { value } = e
    this.setState(() => ({
      property: value
    }))
  }

  submitCreateQuotation = () => {
    const {
      groupName,
      checkIn,
      checkOut,
      numberOfGuest,
      numberOfRoom,
      property,
      avaDouble,
      avaTwin,
      avaTriple,
      pavDouble,
      pavTwin,
      pavTriple,
      pavFamily,
    } = this.state

    // if(groupName === ''){
    //   alert('กรุณาระบุ Group name')
    //   return
    // }
    //
    // if(numberOfGuest === ''){
    //   alert('กรุณาระบุจำนวนผู้เข้าพัก')
    //   return
    // }
    //
    // if(numberOfRoom === ''){
    //   alert('กรุณาระบุจำนวนห้องพัก')
    //   return
    // }
    //
    // if(checkIn === ''){
    //   alert('กรุณาระบุ Check In')
    //   return
    // }
    // if(checkOut === ''){
    //   alert('กรุณาระบุ Check Out')
    //   return
    // }
    //
    // if(property === ''){
    //   alert('กรุณาระบุโรงแรม')
    //   return
    // }
    // if(property === 'Avatara Resort'){
    //   if(avaDouble === ''){
    //     alert('กรุณาระบุราคา Deluxe Double')
    //     return
    //   }
    //   if(avaTwin === ''){
    //     alert('กรุณาระบุราคา Deluxe Twin')
    //     return
    //   }
    //   if(avaTriple === ''){
    //     alert('กรุณาระบุราคา Deluxe Triple')
    //     return
    //   }
    // }
    //
    // if(property === 'Samed Pavilion Resort'){
    //   if(pavDouble === ''){
    //     alert('กรุณาระบุราคา Deluxe Double')
    //     return
    //   }
    //   if(pavTwin === ''){
    //     alert('กรุณาระบุราคา Deluxe Twin')
    //     return
    //   }
    //   if(pavTriple === ''){
    //     alert('กรุณาระบุราคา Deluxe Triple')
    //     return
    //   }
    //   if(pavFamily === ''){
    //     alert('กรุณาระบุราคา Deluxe Family')
    //     return
    //   }
    // }

    createQuotation({groupName,
    checkIn,
    checkOut,
    numberOfGuest,
    numberOfRoom,
    property,
    avaDouble,
    avaTwin,
    avaTriple,
    pavDouble,
    pavTwin,
    pavTriple,
    pavFamily,
  }, res => {
      if(res.status){
        window.open(res.uri)
      }else{
        alert(res.msg)
      }
    })
  }

  openBuffetMenu = () => {
    window.open('https://tunit3-samed.ap.ngrok.io/public/quotation/group-buffet-menu.pdf')
  }

  render(){

    const propertyOptions = [
      {label: 'Avatara Resort', value: 'Avatara Resort'},
      {label: 'Samed Pavilion Resort', value: 'Samed Pavilion Resort'},
    ]

    return(
      <div className="row">
        <div className="col-12">
          <h3>สร้างใบเสนอราคา</h3>
        </div>
        <div className="col-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Group Name</span>
            </div>
            <input onChange={this.textOnChange} type="text" value={this.state.groupName} id="groupName" className="form-control" />
          </div>
        </div>
        <div className="col-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">จำนวนผู้เข้าพัก (โดยประมาณ)</span>
            </div>
            <input onChange={this.textOnChange} type="text" value={this.state.numberOfGuest} id="numberOfGuest" className="form-control" />
          </div>
        </div>
        <div className="col-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">จำนวนห้องพัก (โดยประมาณ)</span>
            </div>
            <input onChange={this.textOnChange} type="text" value={this.state.numberOfRoom} id="numberOfRoom" className="form-control" />
          </div>
        </div>
        <div className="col-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Check In</span>
            </div>
            <input onChange={this.textOnChange} type="date" value={this.state.checkIn} id="checkIn" className="form-control" />
          </div>
        </div>
        <div className="col-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Check Out</span>
            </div>
            <input onChange={this.textOnChange} type="date" value={this.state.checkOut} id="checkOut" className="form-control" />
          </div>
        </div>
        <div className="col-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">เลือกโรงแรม</span>
            </div>
            <Select className="form-control" options={propertyOptions} onChange={this.propertyOnChange} />
          </div>
        </div>
        <div className="col-12 my-3">
          <h4>{this.state.property}</h4>
        </div>
        <div className="col-12">
          {
            this.state.property === 'Avatara Resort' &&
            <div className="row">
              <div className="col-4">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Deluxe Double</span>
                  </div>
                  <input onChange={this.textOnChange} type="text" value={this.state.avaDouble} id="avaDouble" className="form-control" />
                  <div className="input-group-append">
                    <span className="input-group-text">บาท</span>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Deluxe Twin</span>
                  </div>
                  <input onChange={this.textOnChange} type="text" value={this.state.avaTwin} id="avaTwin" className="form-control" />
                  <div className="input-group-append">
                    <span className="input-group-text">บาท</span>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Deluxe Triple</span>
                  </div>
                  <input onChange={this.textOnChange} type="text" value={this.state.avaTriple} id="avaTriple" className="form-control" />
                  <div className="input-group-append">
                    <span className="input-group-text">บาท</span>
                  </div>
                </div>
              </div>
            </div>
          }
          {
            this.state.property === 'Samed Pavilion Resort' &&
            <div className="row">
              <div className="col-3">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Deluxe Double</span>
                  </div>
                  <input onChange={this.textOnChange} type="text" value={this.state.pavDouble} id="pavDouble" className="form-control" />
                  <div className="input-group-append">
                    <span className="input-group-text">บาท</span>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Deluxe Twin</span>
                  </div>
                  <input onChange={this.textOnChange} type="text" value={this.state.pavTwin} id="pavTwin" className="form-control" />
                  <div className="input-group-append">
                    <span className="input-group-text">บาท</span>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Deluxe Triple</span>
                  </div>
                  <input onChange={this.textOnChange} type="text" value={this.state.pavTriple} id="pavTriple" className="form-control" />
                  <div className="input-group-append">
                    <span className="input-group-text">บาท</span>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Deluxe Family</span>
                  </div>
                  <input onChange={this.textOnChange} type="text" value={this.state.pavFamily} id="pavFamily" className="form-control" />
                  <div className="input-group-append">
                    <span className="input-group-text">บาท</span>
                  </div>
                </div>
              </div>
            </div>
          }
          <div className="row">
          <div className="col-4">
            <button onClick={this.submitCreateQuotation} className="btn btn-success">สร้างใบเสนอราคา</button>
          </div>
          <div className="col-4">
            <button onClick={this.openBuffetMenu} className="btn btn-info">ดาวน์โหลด Buffet Menu</button>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

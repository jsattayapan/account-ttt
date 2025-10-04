import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import { TitleBar } from './components'
import { getCustomerTablesByDate, getCustomerTablesById } from './tunnel'

export default class DailyShift extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentView: 'table',
      tables: [],
      info : {},
      date: '',
      id: ''
    }
  }

  componentDidMount(){
    const date = new Date()
    getCustomerTablesByDate({date}, res => {
      if(res.status){
        console.log(res.tables);
        this.setState(() => ({
          tables: res.tables.sort((a, b) => b.id - a.id)
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  setDate = e => {
    const value = e.target.value
    this.setState(() => ({
      date: value
    }))
  }

  setId = e => {
    const value = e.target.value
    this.setState(() => ({
      id: value
    }))
  }

  getByDate = () => {
    if(this.state.date === ''){
      alert('กรุณาระบุวันที่')
      return
    }
    getCustomerTablesByDate({date: this.state.date}, res => {
      if(res.status){
        console.log(res.tables);
        this.setState(() => ({
          tables: res.tables.sort((a, b) => b.id - a.id),
          currentView: 'table'
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  closeInfo = () => {
    this.setState(() => ({
      currentView: 'table'
    }))
  }

  getById = id => {
    if(id === ''){
      alert('กรุณาระบุหมายเลขใบเสร็จ')
      return
    }
    getCustomerTablesById({id}, res => {
      if(res.status){
        console.log(res.info);
        this.setState(() => ({
          currentView: 'table-info',
          info: res.info
        }))
      }else{
        alert(res.msg)
      }
    })
  }


  render(){
    return(
      <div className="row">
        <TitleBar title='ข้อมูลตามโต๊ะ' />
      <div className="col-2">
          <label>หมายเลขบิล: </label>
        </div>
        <div className="col-4">
          <input onChange={this.setId} type='text' />
        </div>
        <div className="col-6">
          <button onClick={() => this.getById(this.state.id)} className="btn btn-success">ค้นหา</button>
        </div>
        <div className="col-2">
          <br />
          <label>วันที่: </label>
        </div>
        <div className="col-4">
          <br />
          <input onChange={this.setDate} type='date' />
        </div>
        <div className="col-6">
          <br />
          <button onClick={this.getByDate} className="btn btn-success">สรุปรายวัน</button>
        </div>

          {this.state.currentView === 'table' && <div className="col-12">
            <br />
          <table className="table table-hover">
              <thead>
                <tr>
                  <th># ใบเสร็จ</th>
                <th>เบอร์โต๊ะ</th>
                <th>ชำระเงินโดย</th>
                <th>Service Charge</th>
                <th>ยอดเงิน</th>
              <th>เปิดโต๊ะ</th>
            <th>เฃ็คบิล</th>
                </tr>
              </thead>
              <tbody>
                {this.state.tables.map(x => (
                  <tr onClick={() => this.getById(x.id)}>
                    <td>{x.id}</td>
                    <td>{x.table_number}</td>
                    <td align="center">{x.method}</td>
                    <td align="right">{numeral(x.service_charge_amount).format('0,0')}.-</td>
                    <td align="right">{numeral(x.total_amount).format('0,0')}.-</td>
                  <td align="right">{moment(x.open_at).format('LT')}</td>
                <td align="right">{moment(x.close_at).format('LT')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
          {this.state.currentView === 'table-info' &&
            <div className="col-12">
              <br />
              <div className="row">
                <div className="col-4">
                  # ใบเสร็จ: <h4>{this.state.info.id}</h4>
                </div>
                <div className="col-4">

                </div>
                <div className="col-4">
                  <button onClick={this.closeInfo} className="btn btn-danger">กลับ</button>
                </div>
              </div>
              <div className="row">
                <InfoBox title='# โต๊ะ:' text={this.state.info.table_number} />
                <InfoBox title='# ลูกค้า:' text={this.state.info.number_of_guest} />
                <InfoBox title='zone:' text={this.state.info.zone} />
                <InfoBox title='ชำระโดย:' text={this.state.info.method} />
                <InfoBox title='ภาษา:' text={this.state.info.language} />
              <InfoBox title='เข้า:' text={moment(this.state.info.open_at).format('LT')} />
              <InfoBox title='ออก:' text={moment(this.state.info.close_at).format('LT')} />
            <InfoBox title='เปิดโต๊ะโดย:' text={this.state.info.open_by} />
          <InfoBox title='รับเงินโดย:' text={this.state.info.close_by} />
              </div>
              <div className="row">
                <div className="col-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>รายการอาหาร</th>
                        <th>จำนวน</th>
                      <th>ราคา/หน่วย</th>
                      <th>ราคารวม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.info.item_orders.map(x => {
                        let price = x.price
                        if(this.state.info.table_number === 'Staffs'){
                          price = x.staff_price
                        }
                        return <tr>
                            <td>{x.name}</td>
                          <td>{x.quantity}</td>
                        <td>{numeral(price).format('0,0')}</td>
                      <td>{numeral(price * x.quantity).format('0,0')}</td>
                          </tr>
                      })}
                    </tbody>
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                      <th>ยอดเงินรวม: </th>
                      <th>{numeral(this.state.info.sub_total_amount).format('0,0')}</th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                      <th>ส่วนลด: </th>
                    <th>{numeral(this.state.info.discount_amount).format('0,0')}</th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                      <th>Service Charge: </th>
                    <th>{numeral(this.state.info.service_charge_amount).format('0,0')}</th>
                      </tr>

                      <tr>
                        <th></th>
                        <th></th>
                      <th>ยอดที่ต้องชำระ: </th>
                    <th>{numeral(this.state.info.total_amount).format('0,0')}</th>
                      </tr>
                      {this.state.info.method === 'card' &&
                        <tr>
                          <th></th>
                          <th></th>
                        <th>จ่ายผ่านบัตร: </th>
                      <th>{this.state.info.room_number}</th>
                        </tr>}
                        {this.state.info.method === 'multiple' &&
                          <tr>
                            <th></th>
                            <th></th>
                          <th colSpan="2">{
                              this.state.info.multiple_payment.map(p => {
                                let type = p.paymentType === 'cash' ? 'เงินสด' :
                  p.paymentType === 'creditCard' ? 'บัตร' :
                  p.paymentType === 'halfHalf' ? 'คนละครึ่ง' :
                  p.paymentType === 'G-Wallet' ? 'G-Wallet' : 'ไทยชนะ';
                                  return <p>{type}: {numeral(p.amount).format('0,0')}.- {p.paymentType !== 'cash' ? `|| ${p.reference}` : ''}</p>
                              }
                              )
                            }</th>
                          </tr>}
                        {this.state.info.method === 'transfer' &&
                          <tr>
                            <th></th>
                            <th></th>
                          <th>โอนเงิน Ref# : </th>
                        <th>{this.state.info.room_number}</th>
                          </tr>}
                          {this.state.info.method === 'room' &&
                            <tr>
                              <th></th>
                              <th></th>
                            <th>โอนเข้าห้องพัก: </th>
                          <th>{this.state.info.room_number}</th>
                            </tr>}
                    </thead>
                  </table>
                </div>
              </div>
              <div className="row">
                <div className="col-6"  >
                  <table width="100%">
                    <thead>
                      <tr>
                        <th width="75%">รายละเอียด</th>
                        <th width="15%">ส่งโดย</th>
                        <th width="10%">เวลา</th>
                      </tr>
                    </thead>
                  </table>
                  <div
                    className=""
                    style={{
                      margin: '5px 0',
                      width: '100%',
                      height: '440px',
                      overflow: 'scroll'
                    }}
                  >
                    <table width="100%">
                      {this.state.info.logList.map(log => (
                        <tbody>
                          <tr>
                            {(() => {
                              switch (log.status) {
                                case 'sent':
                                  return (
                                    <div>
                                      <td valign="top" width="15%">
                                        สั่ง :
                                      </td>
                                      <td valid="top" width="60%">
                                        <b>{log.name} x {log.quantity}
                                        </b>{' '}
                                        {log.detail !== null
                                          ? `หมายเหตุ:${log.detail}`
                                          : ``}
                                          {log.from_table !== null
                                            ? `ย้ายมาจากโต๊ะ:${log.from_table}`
                                            : ``}
                                      </td>
                                    </div>
                                  );
                                  break;
                                case 'cancel':
                                  return (
                                    <div>
                                      <td valign="top" width="15%">
                                        ยกเลิก :
                                      </td>
                                      <td valid="top" width="60%">
                                        <b>{log.name} x {log.quantity}
                                        </b>{' '}
                                        {log.detail !== null
                                          ? `หมายเหตุ:${log.detail}`
                                          : ``}
                                      </td>
                                    </div>

                                  );
                                  break;
                                case 'complete':
                                  return (
                                    <div>
                                      <td valign="top" width="15%">
                                        ปรุงเสร็จ :
                                      </td>
                                      <td valid="top" width="60%">
                                        <b>{log.name} x {log.quantity}
                                        </b>
                                      </td>
                                    </div>
                                  );
                                  break;
                                case 'opened':
                                  return (
                                    <td valid="top" width="75%">
                                      เปิดโต๊ะ
                                    </td>
                                  );
                                  break;
                                case 'checked':
                                  return (
                                    <td valid="top" width="75%">
                                      เรียกเช็คบิล
                                    </td>
                                  );
                                  break;
                                  case 'close-table':
                                    return (
                                    <td valid="top" width="75%">
                                      ปิดโต๊ะโดยไม่ชำระเงิน
                                    </td>
                                  );
                                       break;
                                      case 'paid':
                                    return (
                                    <td valid="top" width="75%">
                                      ชำระเงินสำเร็จ
                                    </td>
                                  );
                                       break;
                                  case 'cancel-payment':
                                    return (
                                    <td valid="top" width="75%">
                                      ยกเลิกการจ่ายเงิน
                                    </td>
                                  );
                                      break;
                                  case 'transfer':
                                    return (
                                      <div>
                                        <td valid="top" width="15%">
                                          ย้าย :
                                        </td>
                                        <td valid="top" width="60%">
                                          {log.detail}
                                        </td>
                                      </div>

                                    );
                                    break;
                                case 'discount':
                                  return (
                                    <td valid="top" width="75%">
                                      ใส่ส่วนลดเป็น: {log.detail}
                                    </td>
                                  );
                                default:
                                  return ;
                              }
                            })()}
                            <td valign="top" width="15%">
                              {log.short_name}
                            </td>
                            <td valign="top" width="10%">
                              {moment(log.timestamp).format('hh:mm')}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              {this.state.info.item_cancel.length !== 0 &&
                  <div className="col-6">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>รายการยกเลิก</th>
                          <th>จำนวน</th>
                        <th>หมายเหตุ</th>
                      <th>บันทึกโดย</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.info.item_cancel.map(x => {
                          return <tr>
                              <td>{x.name}</td>
                            <td>{x.quantity}</td>
                          <td>{x.detail}</td>
                        <td>{x.short_name}</td>
                            </tr>
                        })}
                      </tbody>
                    </table>
                  </div>
              }
              </div>
            </div>
        }
      </div>
    )
  }
}

const InfoBox = (props) => {
  return(
    <div className="col-2 info-box">
      <div className="row">
        <div className="col-12">
          {props.title}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h3><b>{props.text}</b></h3>
        </div>
      </div>

    </div>
  )
}

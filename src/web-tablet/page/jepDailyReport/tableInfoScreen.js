import React, { useState, useEffect } from "react";
import { getCustomerTablesById } from '../../tunnel'
import moment from "moment";
import numeral from "numeral";
import LoadingScreen from './loadingScreen'

const InfoBox = (props) => {
    return(
      <div className="">
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

  const rowStyle = {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}

const TableInfoScreen = (props) => {

    let {data, cancel} = props

    let total = data.item_orders.reduce((total, x) => {
        const price = data.table_number === 'Staffs' ? x.staff_price : x.price;
        return total += (x.quantity * price)
    }, 0)


  return (
    <div style={styles.loadingScreen}>
    <div style={{ padding: '20px' }}>
      <div style={rowStyle}>
        <h4>ใบเสร็จ: {data.id}</h4>
        <button onClick={cancel} className="cancel-button">ปิด</button>
      </div>
    <br />
      {/* InfoBoxes */}
      <div style={rowStyle}>
        <InfoBox title="# โต๊ะ:" text={data.table_number} />
        <InfoBox title="# ลูกค้า:" text={data.number_of_guest} />
        <InfoBox title="zone:" text={data.zone} />
        <InfoBox title="ชำระโดย:" text={data.method} />
        <InfoBox title="ภาษา:" text={data.language} />
        <InfoBox title="เข้า:" text={moment(data.open_at).format('LT')} />
        <InfoBox title="ออก:" text={moment(data.close_at).format('LT')} />
        <InfoBox title="เปิดโต๊ะโดย:" text={data.open_by} />
        <InfoBox title="รับเงินโดย:" text={data.close_by} />
      </div>
      {/* Total Summary */}
      <div className="info-table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{width: '20%', textAlign: 'right'}}>ยอดเงินรวม</th>
              <th style={{width: '20%', textAlign: 'right'}}>ส่วนลด</th>
              <th style={{width: '20%', textAlign: 'right'}}>Service Charge</th>
              <th style={{width: '20%', textAlign: 'right'}}>ยอดที่ต้องชำระ</th>
              <th style={{width: '20%', textAlign: 'right'}}>ชำระโดย</th>
            </tr>
            {/* Other rows */}
          </thead>
          <tbody>
            <tr>
                <td style={{width: '20%', textAlign: 'right'}}>{numeral(data.sub_total_amount).format('0,0')}.-</td>
                <td style={{width: '20%', textAlign: 'right'}}>{numeral(data.discount_amount).format('0,0')}.-</td>
                <td style={{width: '20%', textAlign: 'right'}}>{numeral(data.service_charge_amount).format('0,0')}.-</td>
                <td style={{width: '20%', textAlign: 'right'}}>{numeral(data.total_amount).format('0,0')}.-</td>
                <td style={{width: '20%', textAlign: 'right'}}>{data.method === 'card' ? 'จ่ายผ่านบัตร: ' + data.room_number: data.method === 'complimentary' ? 'ไม่รับเงิน' : data.method === 'transfer' ? 'โอนเงิน Ref#: ' + data.room_number: data.method === 'room' ? 'โอนเข้าห้องพัก: ' + data.room_number : data.method === 'cash' ? 'เงินสด' : data.method === 'multiple' ? 'แบ่งจ่าย' : 'ไม่พบข้อมูล'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <div style={rowStyle}>


      {/* Item Orders */}
      <div className="info-table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{width: '45%'}}>รายการอาหาร</th>
              <th style={{width: '15%', textAlign: 'right'}}>จำนวน</th>
              <th style={{width: '20%', textAlign: 'right'}}>ราคา/หน่วย</th>
              <th style={{width: '20%', textAlign: 'right'}}>รวม: {numeral(total).format('0,0')}.-</th>
            </tr>
          </thead>
          <tbody>
            {data.item_orders.map((x) => {
              const price = data.table_number === 'Staffs' ? x.staff_price : x.price;
              return (
                <tr key={x.name}>
                  <td style={{width: '45%'}}>{x.name}</td>
                  <td style={{width: '15%', textAlign: 'right'}}>{x.quantity}</td>
                  <td style={{width: '20%', textAlign: 'right'}}>{numeral(price).format('0,0')}.-</td>
                  <td style={{width: '20%', textAlign: 'right'}}>{numeral(price * x.quantity).format('0,0')}.-</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Logs */}
      <div className="info-table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{width: '20%'}}>Logs</th>
              <th style={{width: '50%'}}></th>
              <th style={{width: '15%'}}>ส่งโดย</th>
              <th style={{width: '15%'}}>เวลา</th>
            </tr>
          </thead>
          <tbody>
            {data.logList.map((log, index) => {
                  let statusText;

switch (log.status) {
  case 'sent':
    statusText = 'สั่ง :';
    break;
  case 'cancel':
    statusText = 'ยกเลิก :';
    break;
  case 'opened':
    statusText = 'เปิดโต๊ะ';
    break;
  case 'transfer':
    statusText = 'ย้ายโต๊ะ';
    break;
  case 'discount':
    statusText = 'ปรับส่วนลด';
    break;
  case 'checked':
    statusText = 'เรียกเช็คบิล';
    break;
  case 'complete':
    statusText = 'ปรุงเสร็จ';
        break;
        case 'cancel-payment':
    statusText = 'ยกเลิกการจ่ายเงิน';
        break;
        case 'close-table':
    statusText = 'ปิดโต๊ะโดยไม่ชำระเงิน';
        break;
case 'paid':
    statusText = 'ชำระเงิน';   
    break;
  default:
    statusText = 'ชำระเงิน';
}

                  return (
              <tr key={index}>
                <td  style={{width: '20%'}}>{statusText}</td>
                <td  style={{width: '50%'}}>{log.name} {(log.status === 'sent' || log.status === 'cancel') ? 'x ' + log.quantity : ''}  {(log.status === 'cancel' || log.status === 'discount' || log.status === 'transfer') ? <b>{` : ${log.detail}`} </b>: ''}</td>
                <td  style={{width: '15%'}}>{log.short_name}</td>
                <td  style={{width: '15%'}}>{moment(log.timestamp).format('LT')}</td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
      </div>


    </div>
    </div>
  ) ;
};

const App = (props) => {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState(null)

useEffect(() => {
    getCustomerTablesById({id : props.id}, res => {
        console.log(res);
        if(res.status){
            setData(res.info)
            setLoading(false)


        }
    })
}, [])

  return (
    isLoading && data === null ? <LoadingScreen loadingStatus={[]}/> :
      <TableInfoScreen data={data} cancel={props.closeTableInfoSceen} />
  );
};

const styles = {
  loadingScreen: {
    padding: '20px',
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "white",
    // color: "white",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    zIndex: 1000,
    fontSize: "1rem",
  },
};

export default App;

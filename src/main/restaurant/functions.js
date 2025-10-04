import React from 'react';
import ReactDOMServer from 'react-dom/server'
import numeral from 'numeral'

export const formatItemsReport = (vip, staff, customer) => {
  let result = [...customer]
  staff.forEach(item => {
    let found = result.filter(x => x.code === item.code)
    if(found.length === 0){
      result = [...result, {code: item.code, name: item.name, staffQty: item.qty , meat: item.meat, cat: item.cat}]
    }else{
      result = result.filter(x => x.code !== item.code)
      result = [...result, {code: item.code, name: item.name, qty: found[0].qty, staffQty: item.qty , meat: item.meat, cat: item.cat}]
    }
  })

  vip.forEach(item => {
    let found = result.filter(x => x.code === item.code)
    if(found.length === 0){
      result = [...result, {code: item.code, name: item.name, vipQty: item.qty , meat: item.meat, cat: item.cat}]
    }else{
      result = result.filter(x => x.code !== item.code)
      result = [...result, {code: item.code, name: item.name, qty: found[0].qty, staffQty: found[0].staffQty, vipQty:  item.qty , meat: item.meat, cat: item.cat}]
    }
  })
  return result
}

export const numFormat = number => {
  if(number === '-'){
    return number
  }else{
    return numeral(number).format('0,0')
  }
}


export const printerReport = (state) => {
    const myWindow = window.open("", state.title, "width=595,height=842");
    const tableStyle = {borderCollapse: "collapse",border: "1px solid black", width: "100%"}
    const th = {border: "1px solid black"}
    const td = {paddingRight: "5px", paddingLeft: "5px", bodrderLeft: "1px solid black", borderRight: "1px solid black"}
    const htmlString = ReactDOMServer.renderToStaticMarkup(
      <div>
        <h3>{state.title}</h3>
        <br />
        <h3>เครื่องดื่ม</h3>
      <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.baverage.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <h3>ไก่</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.chicken.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      <h3>หมู</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.pork.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      <h3>เนื้อ</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.beef.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      <h3>กุ้ง</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.prawn.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      <h3>หมึก</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.squid.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      <h3>ปู</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.crab.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      <h3>ทะเล</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.seafood.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      <h3>หอย</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.shell.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      <h3>ผัก</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.vegetable.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      <h3>ปลา</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.fish.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      <h3>อื่นๆ</h3>
        <table className="table" style={tableStyle}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>ลูกค้า</th>
              <th>พนักงาน</th>
              <th>VIP</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {state.else.map(x => (
              <tr>
                <td>{x.code}</td>
                <td>{x.name}</td>
                <td>{x.qty || 0}</td>
                <td>{x.staffQty || 0}</td>
                <td>{x.vipQty || 0}</td>
              <td>{(x.qty || 0) + (x.staffQty || 0) + (x.vipQty || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    myWindow.document.write(htmlString);
}

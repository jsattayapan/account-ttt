import React, { useState } from "react";
import numeral from "numeral";


export const CustomerTables = props => {

    return <div className="tablez-container">
            <table className="styled-cancel-table">
              <thead>
                <tr>
                  <th style={{width: '15%'}}>Bill No.</th>
                  <th style={{width: '15%'}}># โต๊ะ</th>
                  <th style={{width: '15%', textAlign: 'right'}}>ยอดเงิน</th>
                  <th style={{width: '15%', textAlign: 'right'}}>ชำระโดย</th>
                  <th style={{width: '20%', }}>หมายเหตุ</th>
                  <th style={{width: '20%', }}></th>
                </tr>
              </thead>
              <tbody>
                {
                    props.data.sort((a,b) => b.id - a.id).map(item => (
                        <tr>
                        <td style={{width: '15%'}}>{item.id}</td>
                        <td style={{width: '15%'}}># {item.table_number}</td>
                        <td style={{width: '15%', textAlign: 'right'}}>{item.discount_amount ? <b style={{color:'red'}}>(-%)</b> : ''} {numeral(item.total_amount).format('0,0')}.-</td>
                        <td style={{width: '15%', textAlign: 'right'}}>{item.method === 'cash' ? 'เงินสด' : item.method === 'transfer'? 'โอนเงิน' : item.method === 'card'? 'บัตรเครดิต' : item.method === 'multiple' ? 'แบ่งจ่าย' : 'ไม่พบข้อมูล'}</td>
                        <td style={{width: '20%'}}>{item.room_number}</td>

                        <td style={{width: '20%', textAlign: 'center'}}><button
                className={`info-button` } onClick={ () => props.handleOpenTableInfo(item.id)}
              >ดูรายการ</button></td>
                      </tr>
                    ))
                }

              </tbody>
            </table>
            </div>
}

export default CustomerTables;

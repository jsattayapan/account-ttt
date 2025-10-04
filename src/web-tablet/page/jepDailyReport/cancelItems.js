import React, { useState } from "react";
import moment from "moment";
import "./cancelItems.css"; // Add CSS for styling


export const CancelItems = props => {

    return  <div className="tablez-container">
            <table className="styled-cancel-table">
              <thead>
                <tr>
                  <th style={{width: '15%'}}>[Bill No.] # โต๊ะ</th>
                  <th style={{width: '20%'}}>รายการ</th>
                  <th style={{width: '10%'}}>จำนวน</th>
                  <th style={{width: '25%'}}>หมายเหตุ</th>
                  <th style={{width: '15%'}}>บันทึก</th>
                  <th style={{width: '15%'}}>เวลา</th>
                </tr>
              </thead>
              <tbody>
                {
                    props.data.payload.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(item => (
                        <tr>
                        <td style={{width: '15%'}}>[{item.id}] #{item.table_number} </td>
                        <td style={{width: '20%'}}>{item.name}</td>
                        <td style={{width: '10%'}}>{item.quantity}</td>
                        <td style={{width: '25%'}}>{item.detail}</td>
                        <td style={{width: '15%'}}>{item.short_name}</td>
                        <td style={{width: '15%'}}>{moment(item.timestamp).format('HH:mm')}</td>
                      </tr>
                    ))
                }

              </tbody>
            </table>
            </div>
}

export default CancelItems;

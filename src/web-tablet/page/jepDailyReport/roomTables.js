import React, { useState } from "react";
import numeral from "numeral";

export const RoomTables = props => {

    return <div className="tablez-container">
            <table className="styled-cancel-table">
              <thead>
                <tr>
                  <th style={{width: '15%'}}>Bill No.</th>
                  <th style={{width: '15%'}}># โต๊ะ</th>
                  <th style={{width: '20%', textAlign: 'right'}}>ยอดเงิน</th>
                  <th style={{width: '38%'}}>หมายเลขห้องพัก</th>
                  <th style={{width: '12%'}}></th>
                </tr>
              </thead>
              <tbody>
                {
                    props.data.map(item => (
                        <tr>
                        <td style={{width: '15%'}}>{item.id}</td>
                        <td style={{width: '15%'}}># {item.table_number}</td>
                        <td style={{width: '20%', textAlign: 'right'}}>{numeral(item.total_amount).format('0,0')}.-</td>
                        <td style={{width: '38%'}}># {item.room_number}</td>
                        <td style={{width: '12%'}}><button
                className={`info-button` }  onClick={ () => props.handleOpenTableInfo(item.id)}
              >ดูรายการ</button></td>
                      </tr>
                    ))
                }

              </tbody>
            </table>
            </div>
}

export default RoomTables;

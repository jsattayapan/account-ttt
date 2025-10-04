import React, {useEffect, useState} from 'react'
import moment from 'moment'

export const LogsList = props => {
    const sortedItems = props.loglist.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    return(
      <div className='row'>
        <div className='col-12'>
                  <h4>Employee Logs</h4>
              </div>
              <div className='col-12'>
                  <table className='table table-striped'>
                      <thead>
                          <tr>
                              
                              <th style={{width: '70%'}}>รายละเอียด</th>
                              <th style={{width: '15%'}}>บันทึกโดย</th>
                              <th style={{width: '15%'}}>วันที่</th>
                          </tr>
                      </thead>
                      <tbody>
                          {sortedItems.length !== 0 ? 
                          sortedItems.map(log => 
                              <tr>
                                  
                                  <td style={{width: '70%'}}>{log.detail}</td>
                                  <td style={{width: '15%'}}>{log.createBy.first_name}</td>
                                  <td style={{width: '15%'}}>{moment(log.timestamp).format('DD/MM/YYYY')}</td>
                              </tr>
                          )   :
                          <tr>
                              <td align='center' colSpan={4}>ไม่มีข้อมูล</td>
                          </tr>
                      }
                      </tbody>
                  </table>
              </div>
      </div>
    )
  }

  export default LogsList
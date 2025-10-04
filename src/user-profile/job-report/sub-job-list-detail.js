import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import moment from 'moment'

import {
  faBed, faBuilding, faLocationArrow, faTools, faUsersCog, faCloudSun, faUser
  } from '@fortawesome/free-solid-svg-icons'

import { IP
  } from './../tunnel'

export default class SubJobListDetail extends React.Component{
  constructor(props){
    super(props)
    this.state = {
    }
  }
  render(){
    const x = this.props.job
    let color = ''
    if(x.status === 'เสร็จ'){
      color = '#95ff6b'
    } else if (x.status === 'กำลังทำ'){
      color = 'orange'
    } else{
      color = 'red'
    }
    return(
      <tr className="my-3">
        <td style={{background: '#424241'}}>
          <div className="row">
            <div className="col-6">
              <p><span style={{color}}>[{x.status}]</span> {x.detail}</p>
              {!(x.type === 'งานภายในอาคาร' || x.type === 'งานภายในห้องพัก') && <span style={{fontWeight: '300', color: '#ded9d9'}}><FontAwesomeIcon icon={faLocationArrow} /> {x.location}</span>}
                {
                  x.workerList.length ?
                  <div className="row mt-2">
                    {
                      x.workerList.map(y => (
                        <div className="col-2">
                          <img style={{verticalAlign: 'middle', width: '50px', height: '50px', borderRadius: '50%'}} src={IP + '/public/employee/' + y.imageUrl} />
                        </div>
                      ))
                    }
                  </div> : ''
                }
            </div>
            <div className="col-6">
              {
                x.imageList.length !== 0 &&
                <img style={{width: '140px', height:'140px', objectFit: 'cover'}} className="jobImage" src={IP + '/public/storageJobImages/' + x.imageList[0].filename} />
              }
            </div>
          </div>
          <hr />
          <div className='row'>
            <div className="col-3">
              <span style={{fontWeight: '300', color: '#ded9d9'}}>Type:&nbsp;
                <FontAwesomeIcon
                  size="1x"
                  icon=
                  {
                    x.type === 'งานภายในห้องพัก'? faBed :
                    x.type === 'ซ่อมอุปกรณ์'? faTools :
                    x.type === 'ติดตั้งอุปกรณ์'? faUsersCog :
                    x.type === 'งานภายนอกอาคาร'? faCloudSun : faBuilding
                  } />
              </span>
            </div>
            <div className="col-5">
              <span style={{fontWeight: '300', color: '#ded9d9'}}><FontAwesomeIcon icon={faUser} /> {x.createBy.name !== undefined ? x.createBy.name : x.createBy.first_name}</span>
            </div>
            <div className="col-4">
              <span style={{fontWeight: '300', color: '#ded9d9'}}>{moment(x.timestamp).fromNow()}</span>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}

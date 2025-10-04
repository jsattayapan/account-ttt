import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SubJobListDetail from './sub-job-list-detail'

import {
  faChevronCircleLeft, faChevronCircleRight, faBed, faBuilding, faChevronDown
  } from '@fortawesome/free-solid-svg-icons'

export default class SubJobList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showList: false
    }
  }

  showListOnClick = () => {
    this.setState(() => ({
      showList: !this.state.showList
    }))
  }

  render(){
    const x = this.props.job
    let totalJob = x.jobList.filter(x => x.status !== 'ยกเลิก')
    let completeJob = x.jobList.filter(x => x.status === 'เสร็จ')
    return(
      <tr className="my-3">
        <td style={{background: '#424241'}}>
          <div className='row'>
            <div className="col-4">
              <span style={{fontWeight: '300', color: '#ded9d9'}}>
                <FontAwesomeIcon
                  size="1x"
                  icon={ faBuilding } />: {x.buildingName} ({completeJob.length}/{totalJob.length})
              </span>
            </div>
            <div className="col-6">
              {x.propertyName && <span style={{fontWeight: '300', color: '#ded9d9'}}>
                <FontAwesomeIcon
                  size="1x"
                  icon={ faBed } />: {x.propertyName}
              </span>}
            </div>
            <div className="col-2 text-right">
              <span onClick={this.showListOnClick} style={{fontWeight: '300', color: '#ded9d9'}}>
                <FontAwesomeIcon
                  size="1x"
                  icon={ faChevronDown } />
              </span>
            </div>
            {
              this.state.showList ?
              <div className="col-12">
                <table>
                  {
                    x.jobList.map(x => <SubJobListDetail job={x} />)
                  }
                </table>
              </div>
              :
              <div className="col-12">
                <ul>
                  {
                    x.jobList.map(x => <li>{x.detail}</li>)
                  }
                </ul>
              </div>
            }
          </div>
        </td>
      </tr>
    )
  }
}

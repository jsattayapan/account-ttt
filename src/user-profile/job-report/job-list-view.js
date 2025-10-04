import React from 'react'
import moment from 'moment'
import SubJobListDetail from './sub-job-list-detail'
import SubJobList from './sub-job-list'
import { BottomNav } from './../index.js'

import { faUndoAlt } from '@fortawesome/free-solid-svg-icons'

export default class JobListView extends React.Component {
    constructor(props){
      super(props)
      this.state = {
      }
    }
    render(){
      let { jobList, changePage } = this.props
      return  (
          <div>
              <div className="d-flex flex-row justify-content-center mt-4">
                <table style={{color: 'white', fontSize: '13px'}} className="table">
                  <tbody>
                    {
                      jobList.map(x => {
                        let htmlCode = ''
                        if(x.type === 'งานภายในอาคาร' || x.type === 'งานภายในห้องพัก'){
                          htmlCode =
                           <SubJobList job={x} />
                        } else {
                          htmlCode =
                          <SubJobListDetail job={x} />
                        }
                        return htmlCode

                      })
                    }
                  </tbody>
                </table>
              </div>
              <br />
              <br />
              <BottomNav
                icon1='รายงานใหม่'
                icon2={faUndoAlt}
                onClick1={() => changePage('createNewJob')}
                onClick2={() => changePage('main')}
                 />
            </div>
      )
    }
}

import React from 'react'
import moment from 'moment'
import { TitleBar } from './components'
import { getStaffsSaleDaily, getStaffsSaleByMonth } from './tunnel'
import {Bar} from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SemipolarLoading } from 'react-loadingg';
import { faArrowRight, faArrowLeft, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default class StaffsSale extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      staffs: [],
      month: new Date(),
      monthly: [],
      selectMonth: '',
      loading: false
    }
  }

  componentDidMount(){
    this.getByMonth(0)
  }

  setMonth = month => {
    this.setState(() => ({
      month
    }))
  }
  getByMonth = (month) => {
    this.setState(() => ({
      loading: true
    }))
    let date = new Date(this.state.month)
    date.setMonth(date.getMonth() + month)
    if(this.state.month === ''){
      alert('กรุณาเลือกเดือน')
      return
    }
    console.log(date);
    getStaffsSaleByMonth({date}, res => {
      if(res.status){
        console.log(res)
        this.setState(() => ({
          month: date,
          data: res.staffs.sort((a, b) => b.total - a.total).map(x => x['total']),
          labels: res.staffs.sort((a, b) => b.total - a.total).map(x => x['short_name']),
          monthly: res.staffs.sort((a, b) => b.total - a.total),
          loading: false
        }))
        console.log(this.state.data);
        console.log(this.state.labels);
      }else{
        alert(res.msg)
        this.setState(() => ({
          loading: false
        }))
      }
    })
  }

  render(){
    return(
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-5 text-right">
              <FontAwesomeIcon className="arrowBtn" onClick={() => this.getByMonth(-1)} icon={faArrowLeft} size="2x" />
            </div>
            <div className="col-2 text-center">
              {moment(this.state.month).format('MMM, YYYY')}
            </div>
            <div className="col-5">
              <FontAwesomeIcon className="arrowBtn" onClick={() => this.getByMonth(1)} icon={faArrowRight} size="2x" />
            </div>
          </div>
        </div>
        <div className="col-12">
          {this.state.loading ? <SemipolarLoading /> : <div className="row">
            <div className="col-12">
              <div className="col-12">
                {this.state.monthly.map((x, i) => (
                    <div className="row rank-container">
                      <div className="col-2 rank-number" style={
                          i === 0 ? {background: '#fce545', borderBottom: '5px solid red'}
                          : i === 1 ? {background: '#8cc0f0', borderBottom: '5px solid black'}
                          : {}

                        }>
                        {i+1}
                      </div>
                      <div className="col-8">
                        <div className="rank-user" style={{width: `${x.total/this.state.monthly[0].total*100}%`}}>
                        <div className="row">
                          <div className="col-12">
                            {x.total}
                          </div>
                        </div>
                      </div>
                          <b>{x.short_name}</b>
                      </div>
                    </div>
                  ))}
              </div>

            </div>
          </div>}
        </div>
      </div>
    )
  }
}

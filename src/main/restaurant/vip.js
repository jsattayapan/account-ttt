import React from 'react'
import numeral from 'numeral'
import { getVip, getVipByTable } from './tunnel'

import { TitleBar } from './components'


export default class Vip extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      vips: [],
      view: 'main',
      items: [],
      table: ''
    }
  }
  componentDidMount(){
    getVip(res => {
      if(res.status){
        this.setState(() => ({
          vips: res.vips.sort((a, b) => b.amount - a.amount)
        }))
      }else{
        alert(res.msg)
      }
    })
  }

backBtn = () => {
  this.setState(() => (({
    view: 'main',
    items: [],
    table: []
  })))
}

  getVipInfo = table => {
    getVipByTable({table, month: new Date()}, res => {
      if(res.status){
        this.setState(() => ({
          view: 'detail',
          items: res.items.sort((a, b) => b.qty - a.qty),
          table: res.table
        }))
        console.log(res)
      }else{
        alert(res.msg)
      }
    })
  }
  render(){
    return(
      <div>
        <TitleBar title='V.I.P' />
      {this.state.view === 'main' && <div className="row">
        {this.state.vips.map(x => (
          <VipBox onClick={() => this.getVipInfo(x.table)} table={x.table} amount={x.amount} />
        ))}
      </div>}

      {this.state.view === 'detail' &&
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-6">
                  {this.state.table}
                </div>
                <div className="col-6">
                  <button onClick={this.backBtn} className="btn btn-danger">
                    กลับ
                  </button>
                </div>
            </div>
            <div className="row">
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>รายการ</th>
                    <th>จำนวน</th>
                  <th>ราคา/หน่วย</th>
                <th>ราคารวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.items.map(x => (
                      <tr>
                        <td>{x.name}</td>
                      <td>{x.qty}</td>
                    <td>{x.price}</td>
                  <td>{x.price * x.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
        }
      </div>
    )
  }
}

function VipBox (props){
  return(
    <div className="col-3 vipBox" onClick={props.onClick}>
      <div className="row">
        <div className="col-12 vipBox-detail">
          {props.table}
        </div>
      </div>
      <div className="row">
        <div className="col-12 vipBox-title">
          {numeral(props.amount).format('0,0')}
        </div>
      </div>
    </div>
  )
}

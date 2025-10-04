import React from 'react'
import numeral from 'numeral'
import {
  getSellerList,
  getItemsBySellerId
} from './tunnel'

export default class SupplierList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      supplierList: [],
      selectedId: ''
    }
  }
  componentDidMount(){
    getSellerList(res => {
      if(res.status){
        this.setState(() => ({
          supplierList: res.supplierList
        }))
      }else{
        alert(res.msg)
      }
    })
  }
  setSupplierId = id => {
    this.setState(() => ({
      selectedId: id
    }))
  }
  clearId = () => {
    this.setState(() => ({
      selectedId: ''
    }))
  }
  render(){
    return(
      <div className="row">
        { this.state.selectedId === '' ? <div className="col-12">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>ชื่อ</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.supplierList.map(x => (
                  <tr onClick={() => this.setSupplierId(x.id)}>
                    <td>{x.id}</td>
                  <td>{x.name}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        :
        <SupplierDetail id={this.state.selectedId} clearId={this.clearId} />
      }
      </div>
    )
  }
}

class SupplierDetail extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      id: this.props.id,
      name: '',
      itemList: []
    }
  }

  componentDidMount(){
    getItemsBySellerId({id: this.props.id}, res => {
      if(res.status){
        console.log(res);
        this.setState(() => ({
          name: res.seller.name,
          itemList: res.itemList
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return(
      <div className="col-12">
        <div className="row mt-3">
          <div className="col-6">
            ID: <b>{this.state.id}</b>
          </div>
          <div className="col-6">
            <button className="btn btn-danger" onClick={this.props.clearId}>กลับ</button>
          </div>
          <div className="col-12">
            <b>{this.state.name}</b>
          </div>
        </div>
        <hr />
      <div className="row">
        <div className="col-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>ชื่อ</th>
                <th>หน่วย</th>
                <th align='right'>ราคาล่าสุด</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.itemList.map(x =>
                <tr>
                  <td>{x.id}</td>
                <td>{x.name}</td>
                <td>{x.unit}</td>
              <td align='right'>{numeral(x.current_price).format('0,0')}.-</td>
                </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
      </div>
    )
  }
}

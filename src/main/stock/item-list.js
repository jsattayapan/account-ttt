import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import {PurchaseDetail} from './confirm-payment'

import {
  getItemList,
  findPurchaseByItemId,
  getConfirmPurchaseById,
  getSuppliers
} from './tunnel'

export default class ItemList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      itemList: [],
      selectedId: '',
      searchText: '',
      suppliers: [],
    }
  }
  componentDidMount(){
    getItemList(res => {
      if(res.status){
        this.setState(() => ({
          itemList: res.itemList
        }))
      }else{
        alert(res.msg)
      }
    })
    getSuppliers(res => {
      if(res.status){
        this.setState(() => ({suppliers: res.suppliers}))
      }else{
        alert(res.msg)
      }
    })
  }
  setItemId = id => {
    this.setState(() => ({
      selectedId: id
    }))
  }
  clearId = () => {
    this.setState(() => ({
      selectedId: ''
    }))
  }

  textOnChange = e => {
    const value = e.target.value
    this.setState(() => ({
      searchText: value
    }))
  }

  render(){
    return(
      <div className="row">
        { this.state.selectedId === '' ? <div className="col-12">
        <div className="col-12 my-2">
          <label className="label-control">
            ค้นหา
          </label>
          <input onChange={this.textOnChange} value={this.state.searchText} placeholder="ชื่อสินค้า" type="text" className="form-control" />
        </div>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>ชื่อ</th>
                <th>หน่วย</th>
                <th>ราคาล่าสุด</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.itemList.filter(x => {
                  if(this.state.searchText === ''){
                    return true
                  }
                  if(x.name.includes(this.state.searchText)){
                    return true
                  }else{
                    return false
                  }
                }).map(x => (
                  <tr onClick={() => this.setItemId(x.id)}>
                    <td>{x.id}</td>
                  <td>{x.name}</td>
                  <td>{x.unit}</td>
                <td style={{ textAlign: 'right' }}>{numeral(x.current_price).format('0,0.00')}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        :
        <SearchPurchaseHistroriesByItem suppliers={this.state.suppliers} itemId={this.state.selectedId} backBtn={this.clearId} />
      }
      </div>
    )
  }
}

class SearchPurchaseHistroriesByItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      purchaseList: [],
      itemId: '',
      itemName: '',
      itemUnit: '',
      purchase: {},
      showDetail:false
    }
  }

  componentDidMount() {
    let itemId = this.props.itemId
    findPurchaseByItemId({itemId}, res => {
      if(res.status){
        this.setState(() => ({
          purchaseList: res.purchaseList,
          itemId,
          itemName: res.itemName,
          itemUnit: res.itemUnit
        }))
      }else{
        alert(res.msg)
        this.props.backBtn();
      }
    })
  }

  backPage = () => {
    this.setState(() => ({
      showDetail: false,
      purchase: {}
    }))
  }

  poClick = id => {
    getConfirmPurchaseById({id}, res => {
      if(res.status){
        console.log(res.purchase);
          let purchase = res.purchase
          let itemsTotal = purchase.items.reduce((sum, i) => sum + (i.quantity * i.price), 0)
          let expenseTotal = purchase.expenses.reduce((sum, i) => sum + i.amount, 0)
          purchase['stockValue'] = purchase.includeVat == 1 ? (itemsTotal/107*100) : itemsTotal
          purchase['expenseValue'] = expenseTotal
        this.setState(() => ({
          showDetail: true,
          purchase
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return(
      <div className='mx-2 my-1'>
      {!this.state.showDetail ?
      <div className="row">
        <div className="col-12">
          <button onClick={ () => this.props.backBtn()} className="btn btn-danger">กลับ</button>
        </div>
        <div className="col-12">
          <p>{this.state.itemId}</p>
          <h3>{this.state.itemName}</h3>
        </div>
        <br />
        <div className="col-12">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th width="10%">Purchase ID</th>
              <th width="10%">วันที่ซื้อ</th>
            <th width="40%">ร้านค้า</th>
          <th width="20%">จำนวน ({this.state.itemUnit})</th>
          <th width="20%">ราคา</th>
              </tr>
            </thead>
            <tbody>
              {this.state.purchaseList.map(x =>
                <tr onClick={() => this.poClick(x.purchaseId)}>
                  <td>{x.purchaseId}</td>
                <td>{moment(x.purchaseDate).format('DD/MM/YYYY')}</td>
              <td>{x.sellerName}</td>
              <td>{x.quantity}</td>
            <td>{x.price}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>:
      <PurchaseDetail
        setPurchase={purchase => this.setState(() => ({purchase}))}
        purchase={this.state.purchase}
        user={this.props.user}
        reloadById={this.poClick}
        suppliers={this.props.suppliers.reduce((result, i) => ([...result, {value: i.id, label: i.name}]), [])}
        backPage={this.backPage} />}
      </div>
    )
  }
}

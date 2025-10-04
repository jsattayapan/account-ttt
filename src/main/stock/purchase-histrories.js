import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import Select from 'react-select';

import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {PurchaseDetail} from './confirm-payment'

import {getPurchaseHistrories, getConfirmPurchaseById, getSuppliers, getMaintenance}  from './tunnel'

export default class PurchaseHistrories extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      purchaseHistrories: [],
      showDetail: false,
      purchase: {},
      suppliers: [],
      typeOptions: [],
      selectedType: 'ทั้งหมด',
      selectedDate: new Date(),
      searchText: ''
    }
  }

  componentDidMount() {
    getPurchaseHistrories(res => {
      if(res.status){
        let typeOptions = []
        res.purchaseHistrories.forEach(x => {
          let found = typeOptions.find(y => y.value === x.type)
          if(!found){
            typeOptions = [ ...typeOptions, { value : x.type, label: x.type}]
          }
        })
        typeOptions.unshift({value: 'ทั้งหมด', label: 'ทั้งหมด'})
        let purchaseHistrories = res.purchaseHistrories.sort((a, b) => b.timestamp > a.timestamp)
        console.log(purchaseHistrories)
        this.setState(() => ({
          purchaseHistrories,
          typeOptions
        }))
      } else{
        alert(res.msg);
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

  backPage = () => {
    this.setState(() => ({
      showDetail: false,
      purchase: {}
    }))
    getPurchaseHistrories(res => {
      if(res.status){
        let purchaseHistrories = res.purchaseHistrories.sort((a, b) => b.timestamp > a.timestamp)
        this.setState(() => ({
          purchaseHistrories
        }))
      } else{
        alert(res.msg);
      }
    })
  }

  poClick = id => {
    getConfirmPurchaseById({id}, res => {
      if(res.status){
        console.log(res.purchase);
          
          let purchase = res.purchase
          
          
          const subTotal = purchase.items.reduce((total, { total: t, vat }) => {
            if (vat === 'vat') {
              return purchase.includeVat === 1
                ? {
                    sub: total.sub + t * 100 / 107,
                    vat: total.vat + t * 7 / 107
                  }
                : {
                    sub: total.sub + t,
                    vat: total.vat + t * 7 / 100
                  };
            }
            return { sub: total.sub + t, vat: total.vat };
          }, { sub: 0, vat: 0 });
          
          console.log(subTotal)
    
          
    
    
          
          let itemsTotal = purchase.items.reduce((sum, i) => sum + (i.quantity * i.price), 0)
          let expenseTotal = purchase.expenses.reduce((sum, i) => sum + i.amount, 0)
          purchase['stockValue'] = subTotal.sub
          purchase['vat'] = subTotal.vat
          purchase['expenseValue'] = expenseTotal
          purchase['total'] = subTotal.vat + subTotal.sub + expenseTotal - purchase.discount 
        this.setState(() => ({
          showDetail: true,
          purchase
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  changeType = e => {
    let type = e.value
    this.setState(() => ({
      selectedType: type
    }))
  }

  changeMonth = status => {
    let date = new Date(this.state.selectedDate)
    let newDate
    if(status){
      newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    }else{
      newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    }
    this.setState(() => ({
      selectedDate: newDate
    }))
  }

  searchTextOnChange = e => {
    let value = e.target.value
    this.setState(() => ({
      searchText: value
    }))
  }

  render(){

    let purchaseHistrories = this.state.purchaseHistrories.filter(x => moment(x.timestamp).format('MM/YYYY') === moment(this.state.selectedDate).format('MM/YYYY'))
    purchaseHistrories = purchaseHistrories.sort((a,b) => moment(b.timestamp) - moment(a.timestamp))

    return(
      <div>
        {!this.state.showDetail &&
          <div className="row mt-3">
            <div className="col-12">
              <label className="pr-2">หมายเลขใบสั่งซื้อ: </label>
                <input
                  className="mr-2"
                  type="text"
                  value={this.state.searchText}
                  onChange={this.searchTextOnChange}
                  placeholder="eg. uywku..."
                />
              <button onClick={() => this.poClick(this.state.searchText)} className="btn btn-success" disabled={this.state.searchText.trim() === ''}>ค้นหา</button>
            </div>
          <div className="col-4 text-right">
            <button onClick={() => this.changeMonth(false)} className="btn btn-warning">&larr;</button>
          </div>
          <div className="col-4 text-center">
            <button className="btn btn-dark" disabled>{moment(this.state.selectedDate).format('MMM/YYYY')}</button>
          </div>
          <div className="col-2">
            <button onClick={() => this.changeMonth(true)} className="btn btn-warning">&rarr;</button>
          </div>
          <div className="col-2">
            <Select onChange={this.changeType} options={this.state.typeOptions} />
          </div>
          <div className="col-12">
            <table className="table">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>หมายเลขใบสั่งซื้อ</th>
                  <th>ร้านค้า</th>
                  <th>สั่งซื้อโดย</th>
                  <th>จ่ายเงินครบ</th>
                  <th>ราคารวม</th>
                  <th>จำนวน</th>
                </tr>
              </thead>
              <tbody>
                { this.state.selectedType === 'ทั้งหมด' ? purchaseHistrories.map(x => (
                  <tr onClick={() => this.poClick(x.id)} className="tr-hover">
                    <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                    <td className="underline-blue" >{x.id}</td>
                    <td>{x.supplier}</td>
                    <td>{x.requester}</td>
                    <td align="center">{x.paymentStatus === 'unpaid' ? <FontAwesomeIcon icon={faTimes} color="red" /> : <FontAwesomeIcon icon={faCheck} color="green" />} </td>
                    <td align="right">{numeral(x.total).format('0,0.00')}</td>
                    <td align="right" style={getTextColor(x.received, x.quantity)}>{numeral(x.received).format('0,0.00')}/{numeral(x.quantity).format('0,0.00')}</td>
                  </tr>
                )) :
                purchaseHistrories.filter(x => x.type === this.state.selectedType).map(x => (
                  <tr onClick={() => this.poClick(x.id)} className="tr-hover">
                    <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                    <td className="underline-blue" >{x.id}</td>
                    <td>{x.supplier}</td>
                    <td>{x.requester}</td>
                    <td align="center">{x.paymentStatus === 'unpaid' ? <FontAwesomeIcon icon={faTimes} color="red" /> : <FontAwesomeIcon icon={faCheck} color="green" />} </td>
                    <td align="right">{numeral(x.total).format('0,0.00')}</td>
                    <td align="right" style={getTextColor(x.received, x.quantity)}>{numeral(x.received).format('0,0.00')}/{numeral(x.quantity).format('0,0.00')}</td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
        </div>}
        {this.state.showDetail &&
          <PurchaseDetail
            setPurchase={purchase => this.setState(() => ({purchase}))}
            purchase={this.state.purchase}
            reloadById={this.poClick}
            user={this.props.user}
            suppliers={this.state.suppliers.reduce((result, i) => ([...result, {value: i.id, label: i.name}]), [])}
            backPage={this.backPage} />
        }
      </div>
    )
  }
}

const getTextColor = (received, quantity) => {
  if(received === quantity){
    return {color: 'green'}
  }

  if(received === 0){
    return {color: 'red'}
  }

  if(received < quantity){
    return {color: 'orange'}
  }
}

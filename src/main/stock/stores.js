import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import { getStores, getStoreById, getItemsHistroryByStoreId } from  './tunnel'

export default class Stores extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      stores: [],
      storeId: '',
      showDetail: false,
      storeName: ''
    }
  }

  componentDidMount(){
    getStores(res => {
      if(res.status){
        this.setState({
          stores: res.stores
        })
      }else{
        alert(res.msg)
      }
    })
  }

  getStore = (id, name) => {
    this.setState(() => ({
      storeId: id,
      storeName: name,
      showDetail: true
    }))
  }

  backPage = () => {
    this.setState(() => ({
      storeId: '',
      showDetail: false
    }))
  }

  render(){
    return(
      <div>
        <div className="row">
          <div className="col-12">
            Stores
          </div>
        </div>
        { !this.state.showDetail &&
          <div className="row">
          {this.state.stores.map(x => (
            <StoreBox onClick={this.getStore}  store={x} />
          ))}
        </div>}
        { this.state.showDetail &&
          <Store backPage={this.backPage} storeId={this.state.storeId} storeName={this.state.storeName} />
          }
      </div>
    )
  }
}

class Store extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      store: {
        current: [],
        histrory: []
      },
      itemsHistroryList: [],
      currentMonth: new Date(),
      monthlyTotal: 0
    }
  }

  changeMonth = (type) => {
    let newMonth = this.state.currentMonth
    if(type === '-'){
      newMonth.setMonth(newMonth.getMonth() - 1)
    }else{
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    this.setState(() => ({
      currentMonth: newMonth
    }), () => {
      this.setHistrories()
    })
  }

  setHistrories = () => {
    const date = this.state.currentMonth
    getItemsHistroryByStoreId({id: this.props.storeId, from:moment(date).clone().startOf('month'), end: moment(date).clone().endOf('month') }, res => {
      if(res.status){
        console.log(res.itemsHistroryList);
        let monthlyTotal = res.itemsHistroryList.reduce((total, item) => {
          return total += item.price * item.quantity
        }, 0)
        let formatItems = res.itemsHistroryList.reduce((result, item) => {
          let found = result.filter(x => moment(x.date).format('DD/MM/YYYY') === moment(item.timestamp).format('DD/MM/YYYY'))
          if(found.length !== 0){
            let index = result.findIndex(x => moment(x.date).format('DD/MM/YYYY') === moment(item.timestamp).format('DD/MM/YYYY'))
            result[index].items = [...result[index].items, item ]
          }else{
            result = [...result, {date: item.timestamp, items: [item]}]
          }
          return result
        }, [])
        console.log(formatItems);
        this.setState(() => ({
          itemsHistroryList: formatItems.sort((a,b) => b.date > a.date),
          monthlyTotal
        }))
      }
    })
  }

  componentDidMount(){
    this.setHistrories()
  }

  render(){
    return(
      <div className="row mt-5">
        <div className="col-8">
          <h3>{this.props.storeName}</h3>
        </div>
        <div className="col-4">
          <button onClick={this.props.backPage} className="btn btn-danger">กลับ</button>
        </div>
        <div className="col-12 mb-3">
          <div className="row justify-content-around">
            <div className="col-2">
              <button onClick={() => this.changeMonth('-')} className='btn btn-info'>- 1 เดือน</button>
            </div>
            <div className="col-4">
              <h4>{moment(this.state.currentMonth).format('MMM YYYY')}</h4>
            </div>
            <div className="col-2">
              <button onClick={() => this.changeMonth('+')} className='btn btn-info'>+ 1 เดือน</button>
            </div>
          </div>
        </div>

        <div className="col-12">

          <table className="table">
            <thead>
              <tr>
                <th>ยอดรวมทั้งเดือน: {numeral(this.state.monthlyTotal).format('0,0.00')}</th>
              </tr>
              <tr>
                <th>ประเภท</th>
                <th>รายการ</th>
                <th>เวลา</th>
                <th>จำนวน</th>
                <th>ราคาต่อหน่วย</th>
              <th>ราคารวม</th>
              </tr>
            </thead>

            {this.state.itemsHistroryList.map(x => (
              <tbody>
                <tr style={{backgroundColor: '#e3e3e3'}}>
                  <td align="center" colSpan="4">วันที่ {moment(x.date).format('DD/MM/YYYY')}</td>
                <td align='right' colSpan="2"><b>ยอดรวม: {numeral(x.items.reduce((total, i) => total += i.price*i.quantity, 0)).format('0,0.00')}</b></td>
                </tr>
                {
                  x.items.map(y => (
                    <tr>
                      <td>{y.type}</td>
                      <td>{y.name} /{y.unit}</td>
                    <td>{moment(y.timestamp).format('HH:mm')}</td>
                  <td>{y.quantity}</td>
                <td>{numeral(y.price).format('0,0.00')}</td>
                <td>{numeral(y.price * y.quantity).format('0,0.00')}</td>
                    </tr>
                  ))
                }
              </tbody>
            ))}
          </table>
        </div>
    </div>
    )
  }
}

{/*
  <tr>
    <td>{y.name}</td>
    <td>{y.storeId}</td>
  <td>{moment(y.timestamp).format('HH:mm')}</td>
<td>{y.quantity}</td>
<td>{y.price}</td>
<td>{y.price * y.quantity}</td>
  </tr>
   */}


const StoreBox = props => {
  return (
    <div onClick={() => props.onClick(props.store.id, props.store.name)} className="supplierBox col-3">
      <div className="row"><div className='col-12'>{props.store.name}</div></div>
    </div>
  )
}

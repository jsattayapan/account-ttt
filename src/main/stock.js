import React from 'react'
import Suppliers from './stock/suppliers'
import ConfirmPayment from './stock/confirm-payment'
import Stores from './stock/stores'
import Report from './stock/report'
import PurchaseHistrories from './stock/purchase-histrories'
import Expenses from './stock/expenses'
import CashAccount from './stock/cash-account'
import Maintenance from './stock/maintenance'
import SupplierList from './stock/supplier-list'
import ItemList from './stock/item-list'


import { SubMenuComponent } from './view-props'

export default class StockView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'Report'
    }
  }
  changePage = page => {
    this.setState(() => ({currentPage: page }))
  }
  render(){
    const menuDisplays = [
      'Report',
      'ร้านค้าติดเครดิต',
      'สต๊อกรีสอร์ท',
      'เงินสด',
      'ค่าใช้จ่าย',
      'ประวัติการซื้อ',
      'รายการซ่อมสินค้า',
      'Suppliers',
      'รายการสินค้า'
    ]

    return(
      <div className="row">
        <SubMenuComponent name='Purchase Report' currentPage={this.state.currentPage} menuDisplays={menuDisplays} changePage={this.changePage} />
        <div className="col-12">
        {this.state.currentPage === 'ร้านค้าติดเครดิต' && <Suppliers user={this.props.user} />}
        {this.state.currentPage === 'สต๊อกรีสอร์ท' && <Stores user={this.props.user} />}
        {this.state.currentPage === 'Report' && <Report user={this.props.user} />}
        {this.state.currentPage === 'ค่าใช้จ่าย' && <Expenses user={this.props.user} />}
        {this.state.currentPage === 'ประวัติการซื้อ' && <PurchaseHistrories user={this.props.user} />}
        {this.state.currentPage === 'เงินสด' && <CashAccount user={this.props.user} />}
        {this.state.currentPage === 'รายการซ่อมสินค้า' && <Maintenance user={this.props.user} />}
        {this.state.currentPage === 'Suppliers' && <SupplierList user={this.props.user} />}
        {this.state.currentPage === 'รายการสินค้า' && <ItemList user={this.props.user} />}
      </div>
    </div>
    )
  }
}

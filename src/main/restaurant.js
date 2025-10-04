import React from 'react'


import DailyShift from './restaurant/daily-shift';
import DailySaleItems from './restaurant/daily-sale-items'
import CustomerTables from './restaurant/customer-tables'
import StaffsSale from './restaurant/staffs-sale'
import Vip from './restaurant/vip'
import PosUser from './restaurant/pos-user'
import ItemList from './restaurant/menu-items'
import MenuPromotion from './restaurant/menu-promotion'
import Summary from './restaurant/summary'
import Recipe from './restaurant/recipe'

import { SubMenuComponent } from './view-props'

export default class Main extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'Summary'
    }
  }

  changePage = (page) => {
    this.setState(() => ({currentPage: page}))
  }

  render(){
    const menuDisplays = [
      'Summary',
      'ยอดเมนู',
      'ข้อมูลโต๊ะ',
      'โต๊ะ VIP',
      'POS User',
      'เมนูอาหาร',
      'โปรโมชั่น',
      'Recipe'
    ]
    return(
      <div className="row">
        <SubMenuComponent name='ร้านเจี๊ยบ Report' currentPage={this.state.currentPage} menuDisplays={menuDisplays} changePage={this.changePage} />
        <div className="col-12">
            {this.state.currentPage === 'Summary' &&
              <Summary />}
            {this.state.currentPage === 'ยอดเมนู' &&
            <DailySaleItems />}
            {this.state.currentPage === 'ข้อมูลโต๊ะ' &&
            <CustomerTables />}
            {this.state.currentPage === 'โต๊ะ VIP' &&
            <Vip />}
            {this.state.currentPage === 'POS User' &&
            <PosUser />}
            {this.state.currentPage === 'เมนูอาหาร' &&
            <ItemList user={this.props.user} />}
            {this.state.currentPage === 'โปรโมชั่น' &&
            <MenuPromotion user={this.props.user} />}
            {this.state.currentPage === 'Recipe' &&
            <Recipe user={this.props.user} />}
        </div>
      </div>
    )
  }
}

import React from 'react'
import { faCube, faDrumstickBite, faUserFriends, faGavel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from 'react-select';

import validator from 'validator'

import TransferHotKitchen from './store-kitchenTransfer'
import StaffFood from './store-kitchenStaffFood'
import PrepareIngredients from './store-kitchenIngredient'
import Equipment from './store-equipment'

export default class KitchenStoreManagement extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      subPage: '',
    }
  }
  componentDidMount(){

  }

  render(){
    return (
      <div className="row">
        <div className="col-12 mb-3">
          <div className="row">
            <div
              onClick={() => this.setState(() => ({ subPage: 'เตรียมวัตถุดิบ'}))}
              className={`${this.state.subPage === 'เตรียมวัตถุดิบ' ? 'icon-btn-select' : 'icon-btn'} col-md-3 col-11 mx-3 py-3 mb-2`}
                >
              <div className="row">
                <div className="col-12 text-center mb-2">
                  <FontAwesomeIcon icon={faCube} size="3x" />
                </div>
                <div className="col-12 text-center">
                  เตรียมวัตถุดิบ
                </div>
              </div>
            </div>

            <div
              onClick={() => this.setState(() => ({ subPage: 'ส่งเข้าครัวร้อน'}))}
              className={`${this.state.subPage === 'ส่งเข้าครัวร้อน' ? 'icon-btn-select' : 'icon-btn'} col-md-3 col-11 mx-3 py-3 mb-2`}
              >
              <div className="row">
                <div className="col-12 text-center mb-2">
                  <FontAwesomeIcon icon={faDrumstickBite} size="3x" />
                </div>
                <div className="col-12 text-center">
                  ส่งเข้าครัวร้อน
                </div>
              </div>
            </div>
            <div
              onClick={() => this.setState(() => ({ subPage: 'ทำอาหารพนักงาน'}))}
              className={`${this.state.subPage === 'ทำอาหารพนักงาน' ? 'icon-btn-select' : 'icon-btn'} col-md-3 col-11 mx-3 py-3 mb-2`}
              >
              <div className="row">
                <div className="col-12 text-center mb-2">
                  <FontAwesomeIcon icon={faUserFriends} size="3x" />
                </div>
                <div className="col-12 text-center">
                  ทำอาหารพนักงาน
                </div>
              </div>
            </div>
            <div
              onClick={() => this.setState(() => ({ subPage: 'อุปกรณ์'}))}
              className={`${this.state.subPage === 'อุปกรณ์' ? 'icon-btn-select' : 'icon-btn'} col-md-3 col-11 mx-3 py-3 mb-2`}
              >
              <div className="row">
                <div className="col-12 text-center mb-2">
                  <FontAwesomeIcon icon={faGavel} size="3x" />
                </div>
                <div className="col-12 text-center">
                  อุปกรณ์
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          this.state.subPage === 'เตรียมวัตถุดิบ' &&
          <PrepareIngredients user={this.props.user} />
        }
        {
          this.state.subPage === 'ส่งเข้าครัวร้อน' &&
          <TransferHotKitchen storeId='uywcp6key6iuc5' user={this.props.user} />
        }
        {
          this.state.subPage === 'ทำอาหารพนักงาน' &&
          <StaffFood user={this.props.user} />
        }
        {
          this.state.subPage === 'อุปกรณ์' &&
          <Equipment storeId='uywcp6key6iuc5' user={this.props.user} />
        }
      </div>
    )
  }
}
